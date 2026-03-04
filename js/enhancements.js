/**
 * Frontend Enhancements
 * @description Preloader, PWA, Performance, and Accessibility Features
 * @version 3.0.0 - Refined Edition
 * @license MIT
 */

(function() {
    'use strict';

    // ===== PRELOADER =====
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(function() {
                preloader.classList.add('hidden');
                // Remove from DOM after transition
                setTimeout(function() {
                    preloader.remove();
                }, 500);
            }, 800);
        }
    });

    // ===== DETECT SYSTEM THEME PREFERENCE =====
    function detectSystemTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        // If user hasn't set a preference, use system preference
        if (!savedTheme) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (!prefersDark) {
                document.body.classList.add('light-theme');
                const themeIcon = document.querySelector('#themeToggle i');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
            }
        }
    }

    // ===== WATCH FOR SYSTEM THEME CHANGES =====
    if (window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeQuery.addEventListener('change', function(e) {
            const savedTheme = localStorage.getItem('theme');
            if (!savedTheme) {
                if (e.matches) {
                    document.body.classList.remove('light-theme');
                } else {
                    document.body.classList.add('light-theme');
                }
            }
        });
    }

    // ===== LAZY LOADING IMAGES =====
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }

    // ===== ENHANCED FORM VALIDATION =====
    function enhanceFormValidation() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(function(input) {
            // Real-time validation
            input.addEventListener('blur', function() {
                validateField(input);
            });

            input.addEventListener('input', function() {
                if (input.classList.contains('is-invalid')) {
                    validateField(input);
                }
            });
        });

        function validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let message = '';

            // Required field check
            if (field.hasAttribute('required') && value === '') {
                isValid = false;
                message = 'This field is required';
            }

            // Email validation
            if (field.type === 'email' && value !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    message = 'Please enter a valid email address';
                }
            }

            // Update field state
            if (isValid) {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
                removeErrorMessage(field);
            } else {
                field.classList.remove('is-valid');
                field.classList.add('is-invalid');
                showErrorMessage(field, message);
            }

            return isValid;
        }

        function showErrorMessage(field, message) {
            removeErrorMessage(field);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }

        function removeErrorMessage(field) {
            const existingError = field.parentNode.querySelector('.invalid-feedback');
            if (existingError) {
                existingError.remove();
            }
        }
    }

    // ===== PERFORMANCE MONITORING =====
    function monitorPerformance() {
        if ('PerformanceObserver' in window) {
            // Monitor Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver(function(list) {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
            });
            
            try {
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // Browser doesn't support this metric
            }

            // Monitor First Input Delay (FID)
            const fidObserver = new PerformanceObserver(function(list) {
                const entries = list.getEntries();
                entries.forEach(function(entry) {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });
            
            try {
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                // Browser doesn't support this metric
            }
        }

        // Log page load time
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log('Page Load Time:', pageLoadTime + 'ms');
            }, 0);
        });
    }

    // ===== SERVICE WORKER REGISTRATION (PWA) =====
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                        console.log('ServiceWorker registered:', registration.scope);
                    })
                    .catch(function(error) {
                        console.log('ServiceWorker registration failed:', error);
                    });
            });
        }
    }

    // ===== KEYBOARD NAVIGATION ENHANCEMENT =====
    function enhanceKeyboardNavigation() {
        // Add visible focus for keyboard users
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

        // Escape key to close modals/menus
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const navbar = document.querySelector('.navbar-collapse');
                if (navbar && navbar.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbar);
                    bsCollapse.hide();
                }
            }
        });
    }

    // ===== NETWORK STATUS INDICATOR =====
    function monitorNetworkStatus() {
        function updateOnlineStatus() {
            const isOnline = navigator.onLine;
            
            if (!isOnline) {
                showNotification('You are offline. Some features may not work.', 'warning');
            }
        }

        window.addEventListener('online', function() {
            showNotification('Connection restored!', 'success');
        });

        window.addEventListener('offline', updateOnlineStatus);
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
        notification.style.zIndex = '10000';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(function() {
            notification.remove();
        }, 3000);
    }

    // ===== INITIALIZE ALL ENHANCEMENTS =====
    function init() {
        detectSystemTheme();
        lazyLoadImages();
        enhanceFormValidation();
        monitorPerformance();
        // registerServiceWorker(); // Uncomment when sw.js is ready
        enhanceKeyboardNavigation();
        monitorNetworkStatus();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('%c✨ Frontend Enhancements Loaded!', 'color: #00d4ff; font-size: 14px; font-weight: bold;');
    console.log('%c♿ Accessibility Features Active', 'color: #28a745; font-size: 12px;');
    console.log('%c⚡ Performance Monitoring Active', 'color: #ffc107; font-size: 12px;');

})();
