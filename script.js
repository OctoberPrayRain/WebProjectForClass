const canvas = document.querySelector('#starCanvas');
const context = canvas.getContext('2d');
const revealItems = document.querySelectorAll('.reveal');

let petals = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    petals = Array.from({ length: Math.min(64, Math.floor(window.innerWidth / 18)) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 2 + Math.random() * 4,
        speed: 0.35 + Math.random() * 0.85,
        drift: -0.35 + Math.random() * 0.7,
        alpha: 0.18 + Math.random() * 0.34,
        angle: Math.random() * Math.PI
    }));
}

function drawPetals() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach((petal) => {
        petal.angle += 0.01;
        context.save();
        context.translate(petal.x, petal.y);
        context.rotate(petal.angle);
        context.fillStyle = `rgba(251, 114, 153, ${petal.alpha})`;
        context.beginPath();
        context.ellipse(0, 0, petal.radius * 0.72, petal.radius * 1.65, 0, 0, Math.PI * 2);
        context.fill();
        context.restore();

        petal.x += petal.drift;
        petal.y += petal.speed;
        if (petal.y > canvas.height + 20 || petal.x < -20 || petal.x > canvas.width + 20) {
            petal.x = Math.random() * canvas.width;
            petal.y = -20;
        }
    });
    requestAnimationFrame(drawPetals);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.16 });

revealItems.forEach((item) => observer.observe(item));

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawPetals();
