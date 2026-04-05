// Simplified canvas animation for hero section
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('container');
    
    if (!canvas) {
        console.error('Main canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context');
        return;
    }

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Simple particle system - optimized for dark background
    const particles = [];
    const particleCount = 80;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() * 0.8 - 0.4); /* Slower horizontal speed */
            this.speedY = (Math.random() * 0.8 - 0.4); /* Slower vertical speed */
            this.lifetime = Math.random() * 2 + 1; /* 1-3 second lifetime */
            this.age = 0;
            // Use soft gold and indigo particles for the dark background
            this.color = Math.random() > 0.5 
                ? 'rgba(255, 215, 0, 0.4)' /* Soft Gold #FFD700 */
                : 'rgba(75, 0, 130, 0.4)'; /* Indigo #4B0082 */
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.age += 0.016; /* Approx 60fps */
            
            // Bounce off edges
            if (this.x <= 0 || this.x >= canvas.width) this.speedX *= -1;
            if (this.y <= 0 || this.y >= canvas.height) this.speedY *= -1;
        }
        
        draw() {
            // Fade out as particle ages
            const opacity = 1 - (this.age / this.lifetime);
            if (opacity <= 0) return;
            
            ctx.fillStyle = this.color.replace(/0\.[0-9]+/, opacity.toFixed(2));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        isDead() {
            return this.age >= this.lifetime;
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        // Clear canvas completely (no trails)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles, remove dead ones
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].isDead()) {
                particles.splice(i, 1);
            }
        }
        
        // Add new particles to maintain count
        while (particles.length < particleCount) {
            particles.push(new Particle());
        }
        
        requestAnimationFrame(animate);
    }

    // Start animation
    animate();
});