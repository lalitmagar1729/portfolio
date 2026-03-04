/**
 * WhatsApp Floating Button
 * @description Enhanced WhatsApp button with analytics and interactions
 * @version 1.0.0
 * @license MIT
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhatsApp);
    } else {
        initWhatsApp();
    }

    function initWhatsApp() {
        const whatsappButton = document.querySelector('.whatsapp-float');
        
        if (!whatsappButton) {
            console.warn('WhatsApp button not found in DOM');
            return;
        }

        // Track WhatsApp button clicks
        whatsappButton.addEventListener('click', function(e) {
            // Log analytics (you can integrate with Google Analytics here)
            console.log('WhatsApp button clicked');
            
            // Optional: Track with Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'WhatsApp Button',
                    'value': 1
                });
            }

            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        // Show/hide button on scroll (optional)
        let lastScrollTop = 0;
        let scrollTimeout;

        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Hide button when scrolling down fast, show when scrolling up
                if (scrollTop > lastScrollTop && scrollTop > 300) {
                    whatsappButton.style.transform = 'translateY(100px)';
                    whatsappButton.style.opacity = '0';
                } else {
                    whatsappButton.style.transform = 'translateY(0)';
                    whatsappButton.style.opacity = '1';
                }
                
                lastScrollTop = scrollTop;
            }, 100);
        });

        // Add entrance animation
        setTimeout(function() {
            whatsappButton.style.opacity = '1';
            whatsappButton.style.transform = 'scale(1)';
        }, 1000);

        // Initial state for entrance animation
        whatsappButton.style.opacity = '0';
        whatsappButton.style.transform = 'scale(0.5)';
        whatsappButton.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

        console.log('%c💬 WhatsApp Button Active!', 'color: #25d366; font-size: 14px; font-weight: bold;');
    }

})();
