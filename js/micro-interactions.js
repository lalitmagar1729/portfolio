/**
 * Micro-interactions and Enhanced Focus Indicators
 * @description Adds delightful animations and accessibility features
 * @version 3.0.0 - Refined Edition
 * @license MIT
 */

(function() {
    'use strict';

    // ===== PREVENT TRANSITIONS ON PAGE LOAD =====
    document.body.classList.add('preload');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.body.classList.remove('preload');
        }, 100);
    });

    // ===== KEYBOARD NAVIGATION DETECTION =====
    let isUsingKeyboard = false;

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            isUsingKeyboard = true;
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        isUsingKeyboard = false;
        document.body.classList.remove('keyboard-nav');
    });

    // ===== RIPPLE EFFECT ON CLICK =====
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');

        button.appendChild(ripple);

        setTimeout(function() {
            ripple.remove();
        }, 600);
    }

    // Add ripple to buttons
    const buttons = document.querySelectorAll('.btn, .btn-filter');
    buttons.forEach(function(button) {
        button.addEventListener('click', createRipple);
    });

    // ===== CARD TILT EFFECT =====

    function addCardTilt() {
        const cards = document.querySelectorAll('.project-card, .stat-card, .interest-card');
        
        cards.forEach(function(card) {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                card.style.transform = '';
            });
        });
    }

    // ===== MAGNETIC BUTTONS =====
    function addMagneticEffect() {
        const magneticElements = document.querySelectorAll('.btn, .social-link, .floating-icon');
        
        magneticElements.forEach(function(element) {
            element.addEventListener('mousemove', function(e) {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
            });
            
            element.addEventListener('mouseleave', function() {
                element.style.transform = '';
            });
        });
    }

    // ===== SMOOTH SCROLL WITH EASING =====
    function smoothScrollTo(target, duration) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function
            const ease = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }

    // ===== PARALLAX EFFECT ON SCROLL =====
    function addParallaxEffect() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(function(element) {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = 'translate3d(0, ' + yPos + 'px, 0)';
            });
        });
    }

    // ===== ANIMATED COUNTER ON SCROLL =====
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    animateValue(counter, 0, target, 2000);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(function(counter) {
            observer.observe(counter);
        });
    }

    function animateValue(element, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = end;
            }
        }
        
        requestAnimationFrame(update);
    }

    // ===== FOCUS TRAP FOR MODALS =====
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }

    // ===== ANNOUNCE TO SCREEN READERS =====
    function announce(message, priority) {
        const announcer = document.getElementById('aria-announcer') || createAnnouncer();
        announcer.textContent = message;
        
        if (priority === 'assertive') {
            announcer.setAttribute('aria-live', 'assertive');
        } else {
            announcer.setAttribute('aria-live', 'polite');
        }
        
        setTimeout(function() {
            announcer.textContent = '';
        }, 1000);
    }

    function createAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'aria-announcer';
        announcer.className = 'visually-hidden';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcer);
        return announcer;
    }

    // ===== INITIALIZE ALL INTERACTIONS =====
    function init() {
        addCardTilt();
        addMagneticEffect();
        addParallaxEffect();
        animateCounters();
        
        // Announce page load
        setTimeout(function() {
            announce('Portfolio page loaded', 'polite');
        }, 1000);
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('%c✨ Micro-interactions Active!', 'color: #00e5ff; font-size: 14px; font-weight: bold;');
    console.log('%c🎯 Enhanced Focus Indicators Enabled', 'color: #28a745; font-size: 12px;');

})();
