// Menu Functionality for Golden Thoughts Blog
// This file handles all menu-related functionality including mobile menu interactions

// Initialize menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const menuCloseBtn = document.querySelector('.menu-close-btn');
    const menuTouchOverlay = document.querySelector('.menu-touch-overlay');
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMenu);
    }
    
    // Close menu with X button
    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', closeMenu);
    }
    
    // Close menu when clicking on overlay
    if (menuTouchOverlay) {
        menuTouchOverlay.addEventListener('click', closeMenu);
    }
    
    // Close menu when clicking on a nav link
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
    
    // Setup menu swipe functionality for mobile
    setupMenuSwipe();
    
    // Handle escape key to close menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('show')) {
            closeMenu();
        }
    });
});

// Open the mobile menu
function openMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuTouchOverlay = document.querySelector('.menu-touch-overlay');
    
    if (navLinks) {
        navLinks.classList.add('show');
        
        // Toggle icon between hamburger and X (handled by CSS)
        const icon = document.querySelector('.mobile-menu i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
        
        // Show overlay
        if (menuTouchOverlay) {
            menuTouchOverlay.classList.add('show');
        }
        
        // Prevent scrolling when menu is open
        document.body.style.overflow = 'hidden';
        
        // Add animation class
        navLinks.classList.add('menu-animation');
        
        // Announce for screen readers
        announceForScreenReaders('Menu opened');
    }
}

// Close the mobile menu
function closeMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuTouchOverlay = document.querySelector('.menu-touch-overlay');
    
    if (navLinks && navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
        
        // Reset icon
        const icon = document.querySelector('.mobile-menu i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        
        // Hide overlay
        if (menuTouchOverlay) {
            menuTouchOverlay.classList.remove('show');
        }
        
        // Restore scrolling
        document.body.style.overflow = 'auto';
        
        // Remove animation class after transition
        setTimeout(() => {
            navLinks.classList.remove('menu-animation');
        }, 300);
        
        // Announce for screen readers
        announceForScreenReaders('Menu closed');
    }
}

// Setup swipe detection for mobile menu
function setupMenuSwipe() {
    let touchStartX = 0;
    let touchEndX = 0;
    const navLinks = document.querySelector('.nav-links');
    
    // Detect swipe from left edge to open menu
    document.addEventListener('touchstart', (e) => {
        if (e.touches[0].clientX < 30) { // Only detect swipes starting from left edge
            touchStartX = e.touches[0].screenX;
        }
    }, {passive: true});
    
    document.addEventListener('touchend', (e) => {
        if (touchStartX > 0) { // Only process if we started tracking from left edge
            touchEndX = e.changedTouches[0].screenX;
            handleMenuSwipe();
            touchStartX = 0; // Reset after handling
        }
    }, {passive: true});
    
    // Detect swipe on menu to close it
    if (navLinks) {
        navLinks.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].screenX;
        }, {passive: true});
        
        navLinks.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleMenuSwipeClose();
        }, {passive: true});
    }
    
    function handleMenuSwipe() {
        const swipeThreshold = 50;
        if (touchEndX - touchStartX > swipeThreshold) {
            // Swiped right from left edge - open menu if closed
            if (navLinks && !navLinks.classList.contains('show')) {
                openMenu();
            }
        }
    }
    
    function handleMenuSwipeClose() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swiped left on menu - close menu if open
            if (navLinks && navLinks.classList.contains('show')) {
                closeMenu();
            }
        }
    }
}

// Announce changes for screen readers
function announceForScreenReaders(message) {
    let ariaLive = document.getElementById('aria-live-announcer');
    
    if (!ariaLive) {
        ariaLive = document.createElement('div');
        ariaLive.id = 'aria-live-announcer';
        ariaLive.setAttribute('aria-live', 'polite');
        ariaLive.setAttribute('aria-atomic', 'true');
        ariaLive.className = 'sr-only';
        document.body.appendChild(ariaLive);
    }
    
    ariaLive.textContent = message;
}

