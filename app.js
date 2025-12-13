// =========================================
// JAVASCRIPT CODE - ĐÃ SỬA HOÀN TOÀN
// =========================================

// DOM Elements
const header = document.getElementById("header");
const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector(".action-btn__icon");
const languageToggle = document.getElementById("language-toggle");
const languageText = languageToggle.querySelector(".language-text");
const backToTopBtn = document.querySelector(".back-to-top");
const fadeElements = document.querySelectorAll(".fade-in");
const navLinks = document.querySelectorAll(".nav__link");

// State variables
let currentTheme = "light";
let currentLanguage = "vi";
let lastScrollY = window.scrollY;
let ticking = false;
let isMenuOpen = false;

// =========================================
// THEME TOGGLE FUNCTIONALITY
// =========================================
function toggleTheme() {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", currentTheme);

    // Update theme icon
    themeIcon.className = `action-btn__icon fas fa-${
        currentTheme === "light" ? "moon" : "sun"
    }`;

    // Save preference to localStorage
    localStorage.setItem("portfolio-theme", currentTheme);
}

// Initialize theme from localStorage or default to light
function initTheme() {
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme) {
        currentTheme = savedTheme;
        document.documentElement.setAttribute("data-theme", currentTheme);
        themeIcon.className = `action-btn__icon fas fa-${
            currentTheme === "light" ? "moon" : "sun"
        }`;
    }
}

// =========================================
// LANGUAGE TOGGLE FUNCTIONALITY
// =========================================
function toggleLanguage() {
    currentLanguage = currentLanguage === "vi" ? "en" : "vi";

    // Update all elements with language data attributes
    document
        .querySelectorAll("[data-lang-vi][data-lang-en]")
        .forEach((element) => {
            element.textContent = element.getAttribute(
                `data-lang-${currentLanguage}`
            );
        });

    // Update language toggle button text
    languageText.textContent = currentLanguage === "vi" ? "EN" : "VI";

    // Save preference to localStorage
    localStorage.setItem("portfolio-language", currentLanguage);
}

// Initialize language from localStorage or default to Vietnamese
function initLanguage() {
    const savedLanguage = localStorage.getItem("portfolio-language");
    if (savedLanguage) {
        currentLanguage = savedLanguage;

        // Update all elements with language data attributes
        document
            .querySelectorAll("[data-lang-vi][data-lang-en]")
            .forEach((element) => {
                element.textContent = element.getAttribute(
                    `data-lang-${currentLanguage}`
                );
            });

        // Update language toggle button text
        languageText.textContent = currentLanguage === "vi" ? "EN" : "VI";
    }
}

// =========================================
// NAVBAR SCROLL BEHAVIOR
// =========================================
function updateHeaderOnScroll() {
    const currentScrollY = window.scrollY;

    // Add scrolled class when scrolling down
    if (currentScrollY > 50) {
        header.classList.add("header--scrolled");
    } else {
        header.classList.remove("header--scrolled");
    }

    // Show/hide header based on scroll direction
    if (currentScrollY > lastScrollY && currentScrollY > 100 && !isMenuOpen) {
        // Scrolling down and past 100px - hide header
        header.classList.add("header--hidden");
    } else {
        // Scrolling up - show header
        header.classList.remove("header--hidden");
    }

    lastScrollY = currentScrollY;
    ticking = false;
}

// Throttle scroll events for performance
function onScroll() {
    if (!ticking) {
        requestAnimationFrame(updateHeaderOnScroll);
        ticking = true;
    }
}

// =========================================
// MOBILE MENU TOGGLE
// =========================================
function toggleMobileMenu(e) {
    if (e) {
        e.stopPropagation(); // Ngăn event bubbling
    }

    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
        mainNav.classList.add("header__nav--open");
        navToggle.innerHTML = '<i class="fas fa-times"></i>';
        navToggle.style.transform = "rotate(90deg)";
        document.body.style.overflow = "hidden";
    } else {
        mainNav.classList.remove("header__nav--open");
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        navToggle.style.transform = "rotate(0)";
        document.body.style.overflow = "";
    }
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    if (isMenuOpen) {
        isMenuOpen = false;
        mainNav.classList.remove("header__nav--open");
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        navToggle.style.transform = "rotate(0)";
        document.body.style.overflow = "";
    }
}

// =========================================
// BACK TO TOP BUTTON
// =========================================
function toggleBackToTop() {
    if (window.scrollY > window.innerHeight) {
        backToTopBtn.classList.add("back-to-top--visible");
    } else {
        backToTopBtn.classList.remove("back-to-top--visible");
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

// =========================================
// FADE-IN ANIMATION ON SCROLL
// =========================================
function checkFadeElements() {
    fadeElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        }
    });
}

// Initialize fade elements
function initFadeElements() {
    fadeElements.forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
}

// =========================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// =========================================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight =
                    document.querySelector(".header").offsetHeight;
                const targetPosition =
                    targetElement.getBoundingClientRect().top +
                    window.pageYOffset -
                    headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                });

                // Update active nav link
                navLinks.forEach((link) =>
                    link.classList.remove("nav__link--active")
                );
                this.classList.add("nav__link--active");

                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Update active nav link on scroll
function updateActiveNavLink() {
    const scrollPosition = window.scrollY;

    document.querySelectorAll("section").forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute("id");

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {
            navLinks.forEach((link) => {
                link.classList.remove("nav__link--active");
                if (link.getAttribute("href") === `#${sectionId}`) {
                    link.classList.add("nav__link--active");
                }
            });
        }
    });
}

// =========================================
// EVENT LISTENERS
// =========================================
window.addEventListener("scroll", onScroll);
window.addEventListener("scroll", toggleBackToTop);
window.addEventListener("scroll", checkFadeElements);
window.addEventListener("scroll", updateActiveNavLink);
window.addEventListener("load", checkFadeElements);

navToggle.addEventListener("click", toggleMobileMenu);
themeToggle.addEventListener("click", toggleTheme);
languageToggle.addEventListener("click", toggleLanguage);
backToTopBtn.addEventListener("click", scrollToTop);

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
    if (
        !e.target.closest(".header__nav") &&
        !e.target.closest(".nav__toggle") &&
        isMenuOpen
    ) {
        toggleMobileMenu();
    }
});

// Close mobile menu when window is resized to desktop size
window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && isMenuOpen) {
        toggleMobileMenu();
    }
});

// =========================================
// INITIALIZATION
// =========================================
function init() {
    initTheme();
    initLanguage();
    initFadeElements();
    initSmoothScrolling();
    checkFadeElements();
    toggleBackToTop();
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
