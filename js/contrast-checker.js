/**
 * Color Contrast Checker
 * @description Validates WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
 * @version 5.0.0 - Fully Fixed Edition
 * @license MIT
 */

(function() {
    'use strict';

    // Only run in development mode
    var isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '' ||
                       window.location.protocol === 'file:';
    
    if (!isDevelopment) {
        console.log('Contrast Checker: Disabled (Production Mode)');
        return;
    }

    // Convert RGB to relative luminance
    function getLuminance(r, g, b) {
        var rs = r / 255;
        var gs = g / 255;
        var bs = b / 255;
        
        rs = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
        gs = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
        bs = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
        
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    // Calculate contrast ratio
    function getContrastRatio(rgb1, rgb2) {
        var lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
        var lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
        var lighter = Math.max(lum1, lum2);
        var darker = Math.min(lum1, lum2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    // Parse RGB color
    function parseRGB(color) {
        if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
            return null;
        }
        var match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
        }
        return null;
    }

    // Get computed color
    function getColor(element, property) {
        try {
            if (!element || !element.nodeType) {
                return null;
            }
            var style = window.getComputedStyle(element);
            if (!style) {
                return null;
            }
            var color = style[property];
            return parseRGB(color);
        } catch (error) {
            return null;
        }
    }

    // Check if text is large (18px+ or 14px+ bold)
    function isLargeText(element) {
        try {
            if (!element || !element.nodeType) {
                return false;
            }
            var style = window.getComputedStyle(element);
            if (!style) {
                return false;
            }
            var fontSize = parseFloat(style.fontSize);
            var fontWeight = parseInt(style.fontWeight, 10) || 400;
            
            return fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
        } catch (error) {
            return false;
        }
    }

    // Check contrast for an element
    function checkElementContrast(element) {
        try {
            if (!element || !element.nodeType) {
                return null;
            }
            
            var textColor = getColor(element, 'color');
            if (!textColor) {
                return null;
            }
            
            var bgColor = getColor(element, 'backgroundColor');
            
            // If background is transparent, find parent with background
            if (!bgColor || (bgColor[0] === 0 && bgColor[1] === 0 && bgColor[2] === 0)) {
                var parent = element.parentElement;
                var depth = 0;
                var maxDepth = 10;
                
                while (parent && depth < maxDepth) {
                    var parentBg = getColor(parent, 'backgroundColor');
                    if (parentBg && !(parentBg[0] === 0 && parentBg[1] === 0 && parentBg[2] === 0)) {
                        bgColor = parentBg;
                        break;
                    }
                    parent = parent.parentElement;
                    depth++;
                }
                
                if (!bgColor || (bgColor[0] === 0 && bgColor[1] === 0 && bgColor[2] === 0)) {
                    bgColor = getColor(document.body, 'backgroundColor');
                    if (!bgColor) {
                        bgColor = [10, 10, 10];
                    }
                }
            }
            
            if (!bgColor) {
                return null;
            }
            
            return getContrastRatio(textColor, bgColor);
        } catch (error) {
            return null;
        }
    }

    // Check all text elements
    function checkAllContrast() {
        try {
            var textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6, li, td, th, label');
            var issues = [];
            var checkedCount = 0;
            
            for (var i = 0; i < textElements.length; i++) {
                var element = textElements[i];
                
                try {
                    if (!element || element.offsetParent === null) {
                        continue;
                    }
                    
                    var text = element.textContent || element.innerText || '';
                    if (!text || text.trim().length === 0) {
                        continue;
                    }
                    
                    var ratio = checkElementContrast(element);
                    if (!ratio || isNaN(ratio)) {
                        continue;
                    }
                    
                    checkedCount++;
                    
                    var isLarge = isLargeText(element);
                    var requiredRatio = isLarge ? 3 : 4.5;
                    
                    if (ratio < requiredRatio) {
                        issues.push({
                            element: element,
                            ratio: ratio.toFixed(2),
                            required: requiredRatio,
                            text: text.substring(0, 50),
                            isLarge: isLarge
                        });
                    }
                } catch (error) {
                    // Skip elements that cause errors
                }
            }
            
            console.log('Checked ' + checkedCount + ' text elements');
            return issues;
        } catch (error) {
            console.error('Error checking contrast:', error);
            return [];
        }
    }

    // Display results
    function displayResults() {
        try {
            var issues = checkAllContrast();
            
            if (!issues || issues.length === 0) {
                console.log('%cAll text passes WCAG AA contrast requirements!', 'color: #28a745; font-size: 14px; font-weight: bold;');
                return;
            }
            
            console.group('%cContrast Issues Found: ' + issues.length, 'color: #ffc107; font-size: 14px; font-weight: bold;');
            
            for (var i = 0; i < issues.length; i++) {
                var issue = issues[i];
                if (!issue) {
                    continue;
                }
                console.group('Issue ' + (i + 1) + ': Ratio ' + issue.ratio + ':1 (Required: ' + issue.required + ':1)');
                console.log('Element:', issue.element);
                console.log('Text:', issue.text);
                console.log('Large text:', issue.isLarge);
                console.groupEnd();
            }
            
            console.groupEnd();
        } catch (error) {
            console.error('Error displaying results:', error);
        }
    }

    // Run check after page load
    function runCheck() {
        setTimeout(displayResults, 1000);
    }

    if (document.readyState === 'complete') {
        runCheck();
    } else {
        if (window.addEventListener) {
            window.addEventListener('load', runCheck, false);
        } else if (window.attachEvent) {
            window.attachEvent('onload', runCheck);
        }
    }

    // Re-check on theme change
    try {
        if (typeof MutationObserver !== 'undefined') {
            var observer = new MutationObserver(function(mutations) {
                try {
                    for (var i = 0; i < mutations.length; i++) {
                        if (mutations[i].attributeName === 'class') {
                            setTimeout(displayResults, 500);
                            break;
                        }
                    }
                } catch (error) {
                    console.warn('Error in mutation observer:', error);
                }
            });

            if (document.body) {
                observer.observe(document.body, {
                    attributes: true,
                    attributeFilter: ['class']
                });
            }
        }
    } catch (error) {
        console.warn('Could not set up mutation observer:', error);
    }

    console.log('%cContrast Checker Active (Development Mode)', 'color: #00d4ff; font-size: 12px;');

})();
