/**
 * Portfolio Website - Main JavaScript
 * @description Core functionality for portfolio interactions
 * @author Lalit Magar
 * @version 3.0.0 - Refined Edition
 * @license MIT
 */

(function ($) {
  "use strict";

  // ===== Initialize AOS Animation =====
  AOS.init({
    duration: 800,
    once: true,
    offset: 50,
    easing: "ease-out-cubic",
    delay: 0,
    mirror: false,
    anchorPlacement: "top-bottom",
    disable: "mobile",
  });

  // Refresh AOS on window resize
  let resizeTimer;
  $(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      AOS.refresh();
    }, 250);
  });

  // ===== Current Year in Footer =====
  $("#currentYear").text(new Date().getFullYear());

  // ===== Custom Easing Functions =====
  $.easing.easeInOutCubic = function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
    return (c / 2) * ((t -= 2) * t * t + 2) + b;
  };

  $.easing.easeInOutQuart = function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b;
    return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
  };

  // ===== Smooth Scroll for Navigation Links =====
  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    const target = $(this.getAttribute("href"));

    if (target.length) {
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: target.offset().top - 80,
          },
          {
            duration: 800,
            easing: "easeInOutCubic",
          }
        );

      $(".navbar-collapse").collapse("hide");
    }
  });

  // ===== Sticky Navbar with Hide/Reveal =====
  let lastScrollTop = 0;
  let scrollDelta = 5;
  let navbarHeight = $(".navbar").outerHeight();
  let scrollTicking = false;
  let lastScrollTime = 0;
  const scrollThrottle = 16; // ~60fps

  $(window).on("scroll", function () {
    const now = Date.now();
    if (!scrollTicking && now - lastScrollTime > scrollThrottle) {
      window.requestAnimationFrame(function () {
        handleScroll();
        scrollTicking = false;
        lastScrollTime = now;
      });
      scrollTicking = true;
    }
  });

  function handleScroll() {
    let scrollPos = $(window).scrollTop();

    // Hide/Reveal Navbar
    if (Math.abs(lastScrollTop - scrollPos) > scrollDelta) {
      if (scrollPos > lastScrollTop && scrollPos > navbarHeight) {
        $(".navbar").removeClass("nav-down").addClass("nav-up");
      } else {
        if (scrollPos + $(window).height() < $(document).height()) {
          $(".navbar").removeClass("nav-up").addClass("nav-down");
        }
      }
      lastScrollTop = scrollPos;
    }

    // Active Navigation Highlighting
    let scrollPosWithOffset = scrollPos + 150;

    $("section").each(function () {
      const currSection = $(this);
      const sectionTop = currSection.offset().top;
      const sectionHeight = currSection.outerHeight();
      const sectionId = currSection.attr("id");

      if (
        scrollPosWithOffset >= sectionTop &&
        scrollPosWithOffset < sectionTop + sectionHeight
      ) {
        $(".nav-link").removeClass("active");
        $('.nav-link[href="#' + sectionId + '"]').addClass("active");
      }
    });

    // Navbar background on scroll
    if (scrollPos > 50) {
      $(".navbar").addClass("scrolled");
      if ($("body").hasClass("light-theme")) {
        $(".navbar").css("background", "rgba(255, 255, 255, 0.95)");
      } else {
        $(".navbar").css("background", "rgba(10, 10, 10, 0.95)");
      }
    } else {
      $(".navbar").removeClass("scrolled");
      if ($("body").hasClass("light-theme")) {
        $(".navbar").css("background", "rgba(255, 255, 255, 0.85)");
      } else {
        $(".navbar").css("background", "rgba(10, 10, 10, 0.85)");
      }
    }

    // Quick contact buttons are always visible (no scroll logic needed)

    // Update Scroll Progress Bar
    const scrollPercent =
      (scrollPos / ($(document).height() - $(window).height())) * 100;
    $("#scrollProgress").css("width", scrollPercent + "%");

    // Navbar Shadow
    if (scrollPos > 100) {
      $(".navbar").addClass("navbar-shadow");
    } else {
      $(".navbar").removeClass("navbar-shadow");
    }
  }

  // ===== Optimized Parallax Scrolling (Disabled for better performance) =====
  // Parallax effects can cause scroll jank, so we're disabling them
  // If you want to re-enable, uncomment the code below
  /*
    let ticking = false;
    let lastScrollY = 0;

    function updateParallax() {
        const scrolled = lastScrollY;
        
        if (scrolled < window.innerHeight) {
            $('.hero-section').css('transform', 'translate3d(0, ' + (scrolled * 0.2) + 'px, 0)');
        }
        
        ticking = false;
    }

    $(window).on('scroll', function() {
        lastScrollY = window.scrollY;
        
        if (!ticking && lastScrollY < window.innerHeight) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    */

  // ===== Counter Animation =====
  function animateCounterSmooth(element, target, duration = 2500) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (target - start) * easeOutQuart);

      element.text(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.text(target);
      }
    }

    requestAnimationFrame(update);
  }

  function animateCounters() {
    $(".counter").each(function () {
      const $this = $(this);
      const countTo = parseInt($this.attr("data-target"));
      animateCounterSmooth($this, countTo, 2500);
    });
  }

  let counterAnimated = false;
  $(window).on("scroll", function () {
    const statsSection = $(".stats-section");
    if (statsSection.length && !counterAnimated) {
      const statsSectionTop = statsSection.offset().top;
      const windowBottom = $(window).scrollTop() + $(window).height();

      if (windowBottom > statsSectionTop) {
        animateCounters();
        counterAnimated = true;
      }
    }
  });

  // ===== Skills Progress Bar Animation with Number Counter =====
  function animateProgressBars() {
    $(".progress-bar").each(function () {
      const $bar = $(this);
      const $percentage = $bar.closest(".skill-item").find(".skill-percentage");
      const targetWidth = parseInt($bar.attr("data-width"));
      let currentWidth = 0;
      const duration = 1500;
      const startTime = performance.now();

      function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);

        currentWidth = targetWidth * easeOutCubic;
        $bar.css("width", currentWidth + "%");

        // Animate the percentage number
        $percentage.text(Math.floor(currentWidth) + "%");

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          $percentage.text(targetWidth + "%");
        }
      }

      requestAnimationFrame(animate);
    });
  }

  let skillsAnimated = false;
  $(window).on("scroll", function () {
    const skillsSection = $("#skills");
    if (skillsSection.length && !skillsAnimated) {
      const skillsSectionTop = skillsSection.offset().top;
      const windowBottom = $(window).scrollTop() + $(window).height();

      if (windowBottom > skillsSectionTop + 200) {
        animateProgressBars();
        skillsAnimated = true;
      }
    }
  });

  // ===== Smooth Typing Effect =====
  let typingFrame;

  function smoothType() {
    const typedText = $("#typed-text");
    if (!typedText.length) return;

    const texts = [
      "Full Stack Developer",
      "Web Designer",
      "Problem Solver",
      "Tech Enthusiast",
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let lastTime = 0;

    function animate(currentTime) {
      const deltaTime = currentTime - lastTime;

      if (deltaTime > (isDeleting ? 50 : 100)) {
        const currentText = texts[textIndex];

        if (isDeleting) {
          typedText.text(currentText.substring(0, charIndex - 1));
          charIndex--;
        } else {
          typedText.text(currentText.substring(0, charIndex + 1));
          charIndex++;
        }

        lastTime = currentTime;

        if (!isDeleting && charIndex === currentText.length) {
          isDeleting = true;
          setTimeout(() => {
            typingFrame = requestAnimationFrame(animate);
          }, 2000);
          return;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          setTimeout(() => {
            typingFrame = requestAnimationFrame(animate);
          }, 500);
          return;
        }
      }

      typingFrame = requestAnimationFrame(animate);
    }

    typingFrame = requestAnimationFrame(animate);
  }

  smoothType();

  // ===== Project Filter with Enhanced Animation =====
  $(".btn-filter").on("click", function () {
    const filter = $(this).attr("data-filter");

    // Update active button
    $(".btn-filter").removeClass("active").attr("aria-pressed", "false");
    $(this).addClass("active").attr("aria-pressed", "true");

    // Count visible projects
    let visibleCount = 0;

    // Filter projects with staggered animation
    $(".project-item").each(function (index) {
      const $item = $(this);
      const category = $item.attr("data-category");
      const shouldShow = filter === "all" || category === filter;

      if (shouldShow) {
        visibleCount++;
        setTimeout(() => {
          $item
            .stop(true, true)
            .removeClass("hidden")
            .css({
              opacity: "0",
              transform: "scale(0.8) translateY(20px)",
            })
            .animate(
              {
                opacity: "1",
              },
              400
            )
            .css({
              transform: "scale(1) translateY(0)",
              transition: "transform 0.4s ease",
            });
        }, index * 50);
      } else {
        $item.stop(true, true).animate(
          {
            opacity: "0",
          },
          300,
          function () {
            $(this).addClass("hidden");
          }
        );
      }
    });

    // Update project count
    setTimeout(() => {
      updateProjectCount(visibleCount);
    }, 400);
  });

  // Update project count display
  function updateProjectCount(count) {
    let $countDisplay = $(".project-count");
    if (!$countDisplay.length) {
      $countDisplay = $('<div class="project-count"></div>');
      $("#projectsContainer").after($countDisplay);
    }
    $countDisplay.html(
      `Showing <strong>${count}</strong> project${count !== 1 ? "s" : ""}`
    );
  }

  // Initialize project count
  $(window).on("load", function () {
    const totalProjects = $(".project-item").length;
    updateProjectCount(totalProjects);
  });

  // ===== Contact Form Submission =====
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();

    const $form = $(this);
    const $submitBtn = $form.find('button[type="submit"]');
    const $formMessage = $("#formMessage");

    // Get form data
    const formData = {
      name: $("#name").val().trim(),
      email: $("#email").val().trim(),
      subject: $("#subject").val().trim(),
      message: $("#message").val().trim(),
    };

    // Validate form
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      showFormMessage("error", "Please fill in all fields.");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showFormMessage("error", "Please enter a valid email address.");
      return;
    }

    // Disable submit button
    $submitBtn
      .prop("disabled", true)
      .html('<i class="fas fa-spinner fa-spin me-2"></i>Sending...');

    // Simulate sending (replace with actual backend call)
    setTimeout(function () {
      // Success
      showFormMessage(
        "success",
        "Thank you! Your message has been sent successfully. I'll get back to you soon!"
      );
      $form[0].reset();

      // Re-enable button
      $submitBtn
        .prop("disabled", false)
        .html('<i class="fas fa-paper-plane me-2"></i>Send Message');

      // Log form data (for testing)
      console.log("Form Data:", formData);

      // Optional: Send to backend
      // sendToBackend(formData);
    }, 1500);
  });

  // Show form message helper
  function showFormMessage(type, message) {
    const $formMessage = $("#formMessage");
    const alertClass = type === "success" ? "alert-success" : "alert-danger";
    const icon =
      type === "success" ? "fa-check-circle" : "fa-exclamation-circle";

    $formMessage.html(
      `<div class="alert ${alertClass} alert-dismissible fade show" role="alert">` +
      `<i class="fas ${icon} me-2"></i>${message}` +
      '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
      "</div>"
    );

    // Auto-hide after 5 seconds
    setTimeout(function () {
      $formMessage.fadeOut(function () {
        $(this).html("").show();
      });
    }, 5000);
  }

  // Optional: Send to backend function
  function sendToBackend(formData) {
    // Example using Formspree
    /*
        fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
            showFormMessage('error', 'Failed to send message. Please try again.');
        });
        */
    // Example using EmailJS
    /*
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
            }, function(error) {
                console.log('FAILED...', error);
                showFormMessage('error', 'Failed to send message. Please try again.');
            });
        */
  }

  // ===== Theme Toggle =====
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    $("body").addClass("light-theme");
    $("#themeToggle i").removeClass("fa-moon").addClass("fa-sun");
  }

  $("#themeToggle").on("click", function () {
    $("body").toggleClass("light-theme");
    const icon = $(this).find("i");

    if ($("body").hasClass("light-theme")) {
      icon.removeClass("fa-moon").addClass("fa-sun");
      localStorage.setItem("theme", "light");
    } else {
      icon.removeClass("fa-sun").addClass("fa-moon");
      localStorage.setItem("theme", "dark");
    }
  });

  // ===== Scroll Progress Bar =====
  $("<div>", {
    id: "scrollProgress",
    class: "scroll-progress-bar",
  }).prependTo("body");

  // ===== Reveal on Scroll =====
  function revealOnScroll() {
    const reveals = $(".reveal-on-scroll");

    reveals.each(function () {
      const windowHeight = $(window).height();
      const elementTop = $(this).offset().top;
      const elementVisible = 150;
      const scrollPos = $(window).scrollTop();

      if (scrollPos > elementTop - windowHeight + elementVisible) {
        $(this).addClass("revealed");
      }
    });
  }

  $(window).on("scroll", revealOnScroll);
  revealOnScroll();

  // ===== Scroll Indicator Dots =====
  $(".scroll-indicator-dot").on("click", function (e) {
    e.preventDefault();
    const target = $(this).attr("href");

    if ($(target).length) {
      $("html, body").animate(
        {
          scrollTop: $(target).offset().top - 70,
        },
        1000
      );
    }
  });

  $(window).on("scroll", function () {
    const scrollPos = $(window).scrollTop() + 200;

    $("section[id]").each(function () {
      const section = $(this);
      const sectionTop = section.offset().top;
      const sectionHeight = section.outerHeight();
      const sectionId = section.attr("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        $(".scroll-indicator-dot").removeClass("active");
        $('.scroll-indicator-dot[data-target="' + sectionId + '"]').addClass(
          "active"
        );
      }
    });
  });

  $(".scroll-indicator-dot").first().addClass("active");

  // ===== Scroll Hint Arrow =====
  if ($(".hero-section").length) {
    const scrollHint = $("<div>", {
      class: "scroll-hint",
      html: '<i class="fas fa-chevron-down"></i>',
    }).appendTo(".hero-section");

    scrollHint.on("click", function () {
      const nextSection = $(".hero-section").next("section");
      if (nextSection.length) {
        $("html, body").animate(
          {
            scrollTop: nextSection.offset().top - 70,
          },
          1000
        );
      }
    });

    $(window).on("scroll", function () {
      if ($(window).scrollTop() > 100) {
        scrollHint.fadeOut();
      } else {
        scrollHint.fadeIn();
      }
    });
  }

  // ===== Intersection Observer =====
  if ("IntersectionObserver" in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    }, observerOptions);

    document.querySelectorAll("section").forEach(function (section) {
      observer.observe(section);
    });
  }

  // ===== Add Reveal Classes on Load =====
  $(window).on("load", function () {
    $(
      ".stat-card, .project-card, .skill-item, .timeline-item, .interest-card, .tech-icon"
    ).addClass("reveal-on-scroll");

    $(".stat-card").each(function (index) {
      $(this).attr("data-aos-delay", index * 100);
    });

    $(".project-card").each(function (index) {
      $(this).attr("data-aos-delay", index * 150);
    });

    $("body").addClass("loaded");

    setTimeout(function () {
      $(
        ".hero-section h1, .hero-section h2, .hero-section p, .hero-buttons"
      ).addClass("fade-in-up");
      $("body").addClass("fully-loaded");
    }, 300);
  });

  // ===== Keyboard Navigation =====
  $(document).on("keydown", function (e) {
    if (e.key === "t" || e.key === "T") {
      if (!$(e.target).is("input, textarea")) {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      }
    }
  });

  // ===== Navbar Collapse on Outside Click =====
  $(document).on("click", function (e) {
    const navbar = $(".navbar-collapse");
    if (!$(e.target).closest(".navbar").length && navbar.hasClass("show")) {
      navbar.collapse("hide");
    }
  });

  // ===== Form Validation Enhancement =====
  $("input, textarea").on("blur", function () {
    if ($(this).val().trim() === "" && $(this).prop("required")) {
      $(this).addClass("is-invalid");
    } else {
      $(this).removeClass("is-invalid").addClass("is-valid");
    }
  });

  // ===== Lazy Loading Images =====
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(function (
      entries,
      observer
    ) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll("img.lazy").forEach(function (img) {
      imageObserver.observe(img);
    });
  }

  // ===== Cleanup on Page Unload =====
  $(window).on("beforeunload", function () {
    if (typingFrame) {
      cancelAnimationFrame(typingFrame);
    }
  });

  // ===== Console Messages =====
  console.log(
    "%c✨ Ultra-Smooth Portfolio Loaded!",
    "color: #00d4ff; font-size: 18px; font-weight: bold;"
  );
  console.log(
    "%c🚀 60 FPS Animations Active",
    "color: #7b2ff7; font-size: 14px;"
  );
})(jQuery);
