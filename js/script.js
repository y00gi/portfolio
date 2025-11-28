// ---------------- Lenis Smooth Scrolling -----------------
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
    // Add other optional settings if needed
});

// Function to handle the update loop
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

// Start the loop
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

/* 1. STARFIELD BACKGROUND EFFECT */
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];

const initCanvas = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    createStars();
};

const createStars = () => {
    stars = [];
    const count = Math.floor(width * height / 10000); // Responsive star count
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5,
            vx: (Math.random() - 0.5) * 0.5, // Velocity
            vy: (Math.random() - 0.5) * 0.5
        });
    }
};

const animateStars = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    
    stars.forEach(star => {
        // Move star
        star.x += star.vx;
        star.y += star.vy;

        // Bounce off edges (or wrap around)
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.globalAlpha = Math.random() * 0.5 + 0.3; // Twinkle
        ctx.fill();
    });

    requestAnimationFrame(animateStars);
};

window.addEventListener('resize', initCanvas);
initCanvas();
animateStars();


/* 2. SCROLL REVEAL ANIMATION */
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


/* 3. TYPEWRITER EFFECT */
const textElement = document.getElementById('typewriter');
const phrases = ['SaaS Platforms', 'Secure APIs', 'Workflow Automation'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

const type = () => {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        textElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
};

// Start typing
type();


/* 4. 3D TILT & SPOTLIGHT EFFECT */
const cards = document.querySelectorAll('[data-tilt]');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Spotlight CSS vars
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);

        // Tilt Calculation
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Intensity of tilt
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        card.style.setProperty('--x', `50%`);
        card.style.setProperty('--y', `50%`);
    });
});

//   --------------Messages-----------------
function selectService(service) {
    // Fill message input
    document.querySelector("textarea[name='message']").value = "Service Request: " + service;
    
    // Smooth Scroll To Contact Section
    document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
  }