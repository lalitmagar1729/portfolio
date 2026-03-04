/**
 * Neural Network Animation for Hero Section
 * @description Creates animated nodes and connecting lines
 * @version 3.0.0 - Refined Edition
 * @license MIT
 */

(function() {
    'use strict';

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNeuralNetwork);
  } else {
    initNeuralNetwork();
  }

  function initNeuralNetwork() {
    const heroSection = document.querySelector(".hero-section");
    if (!heroSection) return;

    // Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Create container
    const neuralContainer = document.createElement("div");
    neuralContainer.className = "neural-network";
    neuralContainer.appendChild(canvas);
    heroSection.insertBefore(neuralContainer, heroSection.firstChild);

    // Configuration
    const config = {
      particleCount: 80,
      particleSpeed: 0.3,
      lineDistance: 150,
      particleSize: 3,
      lineWidth: 1,
      particleColor: "#00d4ff",
      lineColor: "#00d4ff",
      particleOpacity: 0.6,
      lineOpacity: 0.2,
    };

    let particles = [];
    let animationId;
    let isLightTheme = document.body.classList.contains("light-theme");

    // Update colors based on theme
    function updateThemeColors() {
      isLightTheme = document.body.classList.contains("light-theme");
      if (isLightTheme) {
        config.particleColor = "#667eea";
        config.lineColor = "#667eea";
      } else {
        config.particleColor = "#00d4ff";
        config.lineColor = "#00d4ff";
      }
    }

    // Particle class
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * config.particleSpeed;
        this.vy = (Math.random() - 0.5) * config.particleSpeed;
        this.radius = Math.random() * config.particleSize + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Keep within bounds
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = config.particleColor;
        ctx.globalAlpha = config.particleOpacity;
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = config.particleColor;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Initialize particles
    function initParticles() {
      particles = [];
      for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
      }
    }

    // Draw connections between particles
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.lineDistance) {
            const opacity =
              (1 - distance / config.lineDistance) * config.lineOpacity;
            ctx.beginPath();
            ctx.strokeStyle = config.lineColor;
            ctx.globalAlpha = opacity;
            ctx.lineWidth = config.lineWidth;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // Resize canvas
    function resizeCanvas() {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;

      // Adjust particle count based on screen size
      const area = canvas.width * canvas.height;
      const baseArea = 1920 * 1080;
      config.particleCount = Math.floor(80 * (area / baseArea));
      config.particleCount = Math.max(30, Math.min(100, config.particleCount));

      initParticles();
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      drawConnections();

      animationId = requestAnimationFrame(animate);
    }

    // Initialize
    resizeCanvas();
    updateThemeColors();
    animate();

    // Handle window resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
      }, 250);
    });

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      updateThemeColors();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Cleanup on page unload
    window.addEventListener("beforeunload", () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      observer.disconnect();
    });

    console.log(
      "%c🧠 Neural Network Animation Active!",
      "color: #00d4ff; font-size: 14px; font-weight: bold;"
    );
  }
})();
