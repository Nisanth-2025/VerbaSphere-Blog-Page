// Mobile Enhancements for Golden Thoughts Blog
// This file adds touch gestures, responsive features and other mobile-specific functionality

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all mobile enhancements
    setupLazyLoading();
    setupTouchGestures();
    setupSwipeIndicators();
    setupDoubleTap();
    setupMobileScrollFix();
    setupMobileViewport();
    enhanceMobileAccessibility();
    setupScrollToTop();
});

// Setup lazy loading for images
function setupLazyLoading() {
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.setAttribute('src', img.getAttribute('data-src'));
        });
        return;
    }
    
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        lazyImageObserver.observe(img);
    });
}

// Setup swipe indicators for mobile
function setupSwipeIndicators() {
    const blogGrid = document.querySelector('.blog-grid');
    const swipeLeft = document.querySelector('.swipe-indicator.swipe-left');
    const swipeRight = document.querySelector('.swipe-indicator.swipe-right');
    
    if (!blogGrid || !swipeLeft || !swipeRight) return;
    
    // Only show on mobile
    if (window.innerWidth <= 768) {
        swipeLeft.style.display = 'flex';
        swipeRight.style.display = 'flex';
        
        // Fade indicators after 3 seconds
        setTimeout(() => {
            swipeLeft.style.opacity = '0';
            swipeRight.style.opacity = '0';
        }, 3000);
        
        // Show indicators when touching the blog grid
        blogGrid.addEventListener('touchstart', () => {
            swipeLeft.style.opacity = '0.7';
            swipeRight.style.opacity = '0.7';
            
            // Hide again after 2 seconds
            setTimeout(() => {
                swipeLeft.style.opacity = '0';
                swipeRight.style.opacity = '0';
            }, 2000);
        });
        
        // Handle clicks on indicators
        swipeLeft.addEventListener('click', () => {
            blogGrid.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });
        
        swipeRight.addEventListener('click', () => {
            blogGrid.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });
    }
}

// Setup touch gestures for blog cards
function setupTouchGestures() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
[O    // For horizontal scrolling on mobile
    blogGrid.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, {passive: true});
    
    blogGrid.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleBlogGridSwipe();
    }, {passive: true});
    
    function handleBlogGridSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        const swipeThreshold = 50;
        
        if (Math.abs(swipeDistance) < swipeThreshold) return;
        
        if (swipeDistance > 0) {
            // Swiped right
            blogGrid.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        } else {
            // Swiped left
            blogGrid.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    }
}

// Setup double-tap functionality for mobile
function setupDoubleTap() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;
    
    let lastTap = 0;
    const doubleTapDelay = 300; // ms
    
    blogGrid.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < doubleTapDelay && tapLength > 0) {
            // Double tap detected
            const blogCard = e.target.closest('.blog-card');
            if (blogCard) {
                const likeIcon = blogCard.querySelector('.likes i');
                if (likeIcon) {
                    // Like the post with visual feedback
                    likePost(blogCard);
                    e.preventDefault();
                }
            }
        }
        
        lastTap = currentTime;
    });
    
    function likePost(blogCard) {
        const likeIcon = blogCard.querySelector('.likes i');
        const likeCount = blogCard.querySelector('.like-count');
        
        if (!likeIcon || !likeCount) return;
        
        if (likeIcon.classList.contains('far')) {
            likeIcon.classList.remove('far');
            likeIcon.classList.add('fas');
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
            
            // Add heart animation
            likeIcon.classList.add('heart-beat');
            setTimeout(() => {
                likeIcon.classList.remove('heart-beat');
            }, 1000);
            
            // Show feedback toast
            showToast('Post liked!');
        } else {
            likeIcon.classList.remove('fas');
            likeIcon.classList.add('far');
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
            showToast('Like removed');
        }
    }
}

// Fix scroll jank on mobile
function setupMobileScrollFix() {
    // Fix for iOS momentum scrolling
    document.addEventListener('touchmove', (e) => {
        if (e.target.closest('.modal-content') || e.target.closest('.nav-links.show')) {
            // Allow scrolling within modals and menu
        } else if (document.querySelector('.modal.show') || document.querySelector('.nav-links.show')) {
            // Prevent background scrolling when modal or menu is open
            e.preventDefault();
        }
    }, { passive: false });
    
    // Fix iOS rubber band effect
    document.body.addEventListener('touchstart', (e) => {
        const element = e.target;
        const scrollableElements = ['.blog-grid', '.modal-content', '.comments-section'];
        let preventScroll = true;
        
        scrollableElements.forEach(selector => {
            if (element.closest(selector)) {
                preventScroll = false;
            }
        });
        
        if (preventScroll) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Adjust viewport for mobile devices
function setupMobileViewport() {
    // Fix for iOS input zooming
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
        }
    }
    
    // Adjust for notch-based phones
    const safeAreaStyle = document.createElement('style');
    safeAreaStyle.innerHTML = `
        @supports (padding: max(0px)) {
            header, footer {
                padding-left: max(5%, env(safe-area-inset-left));
                padding-right: max(5%, env(safe-area-inset-right));
            }
            footer {
                padding-bottom: max(1rem, env(safe-area-inset-bottom));
            }
        }
    `;
    document.head.appendChild(safeAreaStyle);
}

// Enhance mobile accessibility
function enhanceMobileAccessibility() {
[I    // Increase touch target sizes
    document.querySelectorAll('button, a, .blog-card').forEach(element => {
        element.addEventListener('touchstart', () => {}, {passive: true});
    });
    
    // Add vibration feedback for actions where available
    const actionButtons = document.querySelectorAll('.read-more-btn, .comment-submit, .likes i');
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            if ('vibrate' in navigator) {
                navigator.vibrate(15);
            }
        });
    });
}

// Create and show a toast notification
function showToast(message, duration = 2000) {
    let toast = document.querySelector('.mobile-toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'mobile-toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Setup theme toggle switch - removed as requested

// Setup scroll to top button
function setupScrollToTop() {
    if (!document.querySelector('.scroll-top-btn')) {
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-top-btn';
        scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollTopBtn);
        
        // Initially hide
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.pointerEvents = 'auto';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.pointerEvents = 'none';
            }
        });
        
        // Scroll to top with smooth behavior
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Vibrate feedback if available
            if ('vibrate' in navigator) {
                navigator.vibrate(15);
            }
        });
    }
}

// Setup pull-to-refresh functionality
function setupPullToRefresh() {
    let touchStartY = 0;
    let touchEndY = 0;
    const pullThreshold = 150;
    let isPulling = false;
    
    // Create pull indicator if it doesn't exist
    let pullIndicator = document.querySelector('.pull-indicator');
    if (!pullIndicator) {
        pullIndicator = document.createElement('div');
        pullIndicator.className = 'pull-indicator';
        pullIndicator.innerHTML = '<i class="fas fa-sync-alt"></i>';
        document.body.insertBefore(pullIndicator, document.body.firstChild);
    }
    
    document.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) {
            touchStartY = e.touches[0].clientY;
            isPulling = true;
        }
    }, {passive: true});
    
    document.addEventListener('touchmove', (e) => {
        if (isPulling && window.scrollY === 0) {
            touchEndY = e.touches[0].clientY;
            const pullDistance = touchEndY - touchStartY;
            
            if (pullDistance > 0 && pullDistance < pullThreshold) {
                pullIndicator.style.transform = `translateY(${Math.min(pullDistance, 70)}px)`;
                pullIndicator.style.opacity = Math.min(pullDistance / 70, 1);
                
                // Rotate icon based on pull distance
                const rotationDegree = (pullDistance / pullThreshold) * 360;
                pullIndicator.querySelector('i').style.transform = `rotate(${rotationDegree}deg)`;
            }
        }
    }, {passive: true});
    
    document.addEventListener('touchend', (e) => {
        if (isPulling) {
            touchEndY = e.changedTouches[0].clientY;
            const pullDistance = touchEndY - touchStartY;
            
            if (pullDistance > pullThreshold) {
                // Pull threshold reached, perform refresh
                pullIndicator.classList.add('refreshing');
                showToast('Refreshing content...');
                
                // Simulate refresh (in real app, you would fetch new data)
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                // Reset pull indicator
                pullIndicator.style.transform = 'translateY(0)';
                pullIndicator.style.opacity = '0';
            }
            
            isPulling = false;
        }
    }, {passive: true});
}

