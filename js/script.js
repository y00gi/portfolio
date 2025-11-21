// ---------------- Lenis Smooth Scrolling -----------------
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, { 
                offset: -80,
                duration: 1.5
            });
        }
    });
});

// Intersection Observer for sections
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(section);
});

// Active nav highlight
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => link.style.color = '#e0e0e0');
            if (navLink) navLink.style.color = '#667eea';
        }
    });
});

// ----------------- STARFIELD BACKGROUND --------------------
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Neon radial gradient helper
function neonGradient(x, y, r, alpha) {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(160, 30, 255, ${alpha})`); // purple core
    grad.addColorStop(0.5, `rgba(255, 80, 200, ${alpha})`); // pink halo
    grad.addColorStop(1, `rgba(255, 0, 140, 0)`); // transparent edge
    return grad;
}

// ---- Star ----
class Star {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.speed = Math.random() * 2 + 0.5;
        this.size = Math.random() * 0.5 + 0.4;
        this.alpha = Math.random() * 0.8 + 0.2;
    }
    update() {
        this.y += this.speed;
        if (this.y > canvas.height) this.reset();
    }
    draw() {
        const r = this.size * 3;
        ctx.fillStyle = neonGradient(this.x, this.y, r, this.alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fill();
    }
}

const stars = Array.from({ length: 200 }, () => new Star());

// ---- Burst Particles (Soft, Cinematic) ----
class Burst {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.6 + canvas.height * 0.1; // avoid very top/bottom
        this.particles = Array.from(
            { length: 4 + Math.floor(Math.random() * 10) }, // 4–8 particles only
            () => ({
                x: this.x,
                y: this.y,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.8 + 0.3, // slower glow movement
                alpha: 1,
                size: Math.random() * 0.35 + 0.25 // tiny, elegant sparkles
            })
        );
    }

    update() {
        this.particles.forEach(p => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
            p.alpha -= 0.015; // slower fade
        });
        this.particles = this.particles.filter(p => p.alpha > 0);
    }

    draw() {
        this.particles.forEach(p => {
            const r = p.size * 3; // softer glow
            ctx.fillStyle = neonGradient(p.x, p.y, r, p.alpha);
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

const bursts = [];

// 🎉 Only a few soft bursts for first 1 second
let bursting = true;
const starter = setInterval(() => {
    if (!bursting) return;
    bursts.push(new Burst()); // one burst at a time
}, 100);

// setTimeout(() => {
//     bursting = false;
//     clearInterval(starter);
// }, 100000);

// -------- Animate Everything --------
function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => { s.update(); s.draw(); });
    bursts.forEach(b => { b.update(); b.draw(); });

    requestAnimationFrame(animateStars);
}
animateStars();


// --------------Slider----------------
document.querySelectorAll('.slider').forEach(slider => {
    const slides = slider.querySelector('.slides');
    const images = slider.querySelectorAll('.slides img');
    const prev = slider.querySelector('.prev');
    const next = slider.querySelector('.next');
    const dotsContainer = slider.querySelector('.dots');
    let index = 0;

    // Create dots
    images.forEach((_, i) => {
        const dot = document.createElement("div");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('div');

    function goToSlide(i) {
        index = i;
        slides.style.transform = `translateX(-${i * 100}%)`;
        dots.forEach(dot => dot.classList.remove("active"));
        dots[i].classList.add("active");
    }

    prev.addEventListener('click', () => goToSlide((index - 1 + images.length) % images.length));
    next.addEventListener('click', () => goToSlide((index + 1) % images.length));

    // Auto slide every 4 seconds
    setInterval(() => goToSlide((index + 1) % images.length), 4000);
});

// -------------Success Meassage--------------
const form = document.querySelector(".contact-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const res = await fetch(form.action, { method: "POST", body: formData, headers: { "Accept": "application/json" }});
    if (res.ok) {
      alert("Message sent successfully! I'll respond soon 😊");
      form.reset();
    } else {
      alert("Oops! Something went wrong 😢");
    }
  });