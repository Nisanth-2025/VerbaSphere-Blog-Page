// VerbaSphere Blog - Combined JavaScript File
// Contains all functionality from script.js, menu-functions.js, and mobile-enhancements.js

// ======= CONTENTS FROM script.js =======
// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const menuCloseBtn = document.querySelector('.menu-close-btn');
const menuTouchOverlay = document.querySelector('.menu-touch-overlay');
const uploadBtn = document.querySelector('.upload-btn');
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const uploadModal = document.getElementById('uploadModal');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');
const blogForm = document.getElementById('blog-form');
const blogContent = document.getElementById('blog-content');
const charCounter = document.getElementById('char-counter');
const blogImageInput = document.getElementById('blog-image');
const imagePreview = document.getElementById('image-preview');
const blogGrid = document.querySelector('.blog-grid');
const blogTemplate = document.getElementById('blog-template');

// Sample blog data for initial display
const sampleBlogs = [
    {
        id: 1,
        title: 'The Art of Mindfulness in a Digital Age',
        author: 'Emma Wilson',
        date: '2025-05-15',
        excerpt: 'In an era where digital distractions are omnipresent, mastering mindfulness has become essential for mental well-being and productivity.',
        image: 'https://source.unsplash.com/random/600x400/?mindfulness',
        likes: 24,
        comments: [
            {
                id: 101,
                author: 'Michael Brown',
                date: '2025-05-16',
                content: 'Great insights! I\'ve been practicing mindfulness for years and it has changed my life.',
                replies: [
                    {
                        id: 201,
                        author: 'Emma Wilson',
                        date: '2025-05-16',
                        content: 'Thanks Michael! Glad to hear about your experience.'
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        title: 'Sustainable Living: Small Changes, Big Impact',
        author: 'David Chen',
        date: '2025-05-14',
        excerpt: 'Discover how minor adjustments to your daily habits can contribute significantly to environmental conservation and sustainability.',
        image: 'https://source.unsplash.com/random/600x400/?sustainability',
        likes: 18,
        comments: []
    },
    {
        id: 3,
        title: 'The Future of Remote Work',
        author: 'Sarah Johnson',
        date: '2025-05-12',
        excerpt: 'As remote work becomes the new normal, we explore the implications for productivity, work-life balance, and organizational culture.',
        image: 'https://source.unsplash.com/random/600x400/?remote-work',
        likes: 32,
        comments: [
            {
                id: 102,
                author: 'James Wilson',
                date: '2025-05-13',
                content: 'Remote work has transformed my life. I love the flexibility it offers.',
                replies: []
            },
            {
                id: 103,
                author: 'Lisa Thompson',
                date: '2025-05-14',
                content: 'I miss the office environment sometimes. Human interaction is important too.',
                replies: []
            }
        ]
    }
];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the blog posts
    loadSampleBlogs();
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close menu button functionality
    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', closeMenu);
    }
    
    // Menu touch overlay
    if (menuTouchOverlay) {
        menuTouchOverlay.addEventListener('click', closeMenu);
    }
    
    // Close mobile menu when clicking on a nav link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.mobile-menu') && 
            !e.target.closest('.nav-links') && 
            navLinks.classList.contains('show')) {
            closeMenu();
        }
    });
    
    // Touch events for mobile swipe
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    // Setup menu swipe functionality for mobile
    setupMenuSwipe();
    
    // Setup lazy loading for images
    setupLazyLoading();
    
    // Modal functionality
    uploadBtn.addEventListener('click', () => openModal(uploadModal));
    loginBtn.addEventListener('click', () => openModal(loginModal));
    signupBtn.addEventListener('click', () => openModal(signupModal));
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Switch between login and signup forms
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(signupModal);
    });
    
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(signupModal);
        openModal(loginModal);
    });
    
    // Character counter for blog content
    blogContent.addEventListener('input', updateCharCounter);
    
    // Blog image preview
    blogImageInput.addEventListener('change', handleImagePreview);
    
    // Blog form submission
    blogForm.addEventListener('submit', handleBlogSubmission);
    
    // Setup scroll to top button
    setupScrollToTop();
    
    // Setup search functionality
    setupSearch();
    
    // Enhance comments with emoji picker
    enhanceComments();
    
    // Setup double-tap for mobile
    setupDoubleTap();
    
    // Enhance keyboard navigation
    enhanceKeyboardNavigation();
});

// Functions
function toggleMobileMenu() {
    navLinks.classList.toggle('show');
    
    // Toggle icon between hamburger and X
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('show')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        document.querySelector('.menu-touch-overlay').style.visibility = 'visible';
        document.querySelector('.menu-touch-overlay').style.opacity = '1';
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = 'auto'; // Restore scrolling when menu is closed
        document.querySelector('.menu-touch-overlay').style.visibility = 'hidden';
        document.querySelector('.menu-touch-overlay').style.opacity = '0';
    }
}

function closeMenu() {
    if (navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = 'auto';
        document.querySelector('.menu-touch-overlay').style.visibility = 'hidden';
        document.querySelector('.menu-touch-overlay').style.opacity = '0';
    }
}

function openModal(modal) {
    closeAllModals();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => closeModal(modal));
}

function updateCharCounter() {
    const currentLength = blogContent.value.length;
    charCounter.textContent = currentLength;
    
    // Visual feedback as user approaches the limit
    if (currentLength > 450) {
        charCounter.style.color = '#e6c766';
    } else if (currentLength > 400) {
        charCounter.style.color = '#aaa';
    } else {
        charCounter.style.color = '#aaa';
    }
}

function handleImagePreview(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function handleBlogSubmission(e) {
    e.preventDefault();
    
    // Get form values
    const title = document.getElementById('blog-title').value;
    const author = document.getElementById('author-name').value;
    const content = document.getElementById('blog-content').value;
    
    // Get image if available
    let imageUrl = '';
    if (blogImageInput.files && blogImageInput.files[0]) {
        // In a real application, you would upload the image to a server
        // and use the returned URL. For this demo, we'll use a placeholder
        imageUrl = URL.createObjectURL(blogImageInput.files[0]);
    } else {
        // Use a random placeholder image if none uploaded
        const topics = ['writing', 'blog', 'creativity', 'technology'];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        imageUrl = `https://source.unsplash.com/random/600x400/?${randomTopic}`;
    }
    
    // Create new blog object
    const newBlog = {
        id: Date.now(), // Using timestamp as ID
        title: title,
        author: author,
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        excerpt: content.slice(0, 150) + (content.length > 150 ? '...' : ''),
        image: imageUrl,
        likes: 0,
        comments: []
    };
    
    // Add the blog to the top of the list
    addBlogToPage(newBlog, true);
    
    // Reset the form
    blogForm.reset();
    imagePreview.style.display = 'none';
    imagePreview.innerHTML = '';
    
    // Close the modal
    closeAllModals();
    
    // Show success message
    showNotification('Blog published successfully!');
}

// Initialize the blog posts
function loadSampleBlogs() {
    // Show loading spinner
    const loadingSpinner = document.querySelector('.loading-spinner');
    loadingSpinner.style.display = 'block';
    
    // Clear existing blogs
    blogGrid.innerHTML = '';
    
    // Add the swipe indicators back after clearing
    const swipeLeft = document.createElement('div');
    swipeLeft.className = 'swipe-indicator swipe-left';
    swipeLeft.innerHTML = '<i class="fas fa-chevron-left"></i>';
    blogGrid.appendChild(swipeLeft);
    
    const swipeRight = document.createElement('div');
    swipeRight.className = 'swipe-indicator swipe-right';
    swipeRight.innerHTML = '<i class="fas fa-chevron-right"></i>';
    blogGrid.appendChild(swipeRight);
    
    // Re-add the loading spinner
    blogGrid.appendChild(loadingSpinner);
    
    // Simulate network request with a small timeout
    setTimeout(() => {
        // Add sample blogs to the page
        sampleBlogs.forEach(blog => {
            addBlogToPage(blog);
        });
        
        // Hide loading spinner after blogs are loaded
        loadingSpinner.style.display = 'none';
        
        // Add event listeners to swipe indicators for manual control
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
        
        // Show swipe indicators on small screens
        if (window.innerWidth <= 768) {
            swipeLeft.style.display = 'flex';
            swipeRight.style.display = 'flex';
        } else {
            swipeLeft.style.display = 'none';
            swipeRight.style.display = 'none';
        }
        
        // Update swipe indicators visibility on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                swipeLeft.style.display = 'flex';
                swipeRight.style.display = 'flex';
            } else {
                swipeLeft.style.display = 'none';
                swipeRight.style.display = 'none';
            }
        });
    }, 800); // Simulate loading time
}

function addBlogToPage(blog, prepend = false) {
    // Clone the blog template
    const blogElement = document.importNode(blogTemplate.content, true);
    
    // Fill in the blog data
    const blogCard = blogElement.querySelector('.blog-card');
    blogCard.dataset.id = blog.id;
    
    const blogImage = blogElement.querySelector('.blog-image');
    // Set up lazy loading
    blogImage.dataset.src = blog.image;
    blogImage.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'; // Tiny placeholder
    blogImage.alt = blog.title;
    blogImage.classList.add('lazy-image');
    
    blogElement.querySelector('.blog-title').textContent = blog.title;
    blogElement.querySelector('.blog-author').textContent = `By ${blog.author}`;
    blogElement.querySelector('.blog-date').textContent = formatDate(blog.date);
    blogElement.querySelector('.blog-excerpt').textContent = blog.excerpt;
    blogElement.querySelector('.like-count').textContent = blog.likes;
    blogElement.querySelector('.comment-count').textContent = blog.comments.length;
    
    // Set up event listeners for the blog card
    const readMoreBtn = blogElement.querySelector('.read-more-btn');
    readMoreBtn.addEventListener('click', function() {
        toggleCommentSection(blogCard);
    });
    
    const likeBtn = blogElement.querySelector('.likes i');
    likeBtn.addEventListener('click', function() {
        toggleLike(blogCard);
    });
    
    const commentForm = blogElement.querySelector('.comment-form');
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addComment(blogCard);
    });
    
    // Load existing comments
    const commentsList = blogElement.querySelector('.comments-list');
    blog.comments.forEach(comment => {
        commentsList.appendChild(createCommentElement(comment));
    });
    
    // Add to the DOM
    if (prepend) {
        blogGrid.prepend(blogElement);
    } else {
        blogGrid.appendChild(blogElement);
    }
}

function toggleCommentSection(blogCard) {
    blogCard.classList.toggle('expanded');
    const readMoreBtn = blogCard.querySelector('.read-more-btn');
    if (blogCard.classList.contains('expanded')) {
        readMoreBtn.textContent = 'Close';
    } else {
        readMoreBtn.textContent = 'Read More';
    }
}

function toggleLike(blogCard) {
    const likeIcon = blogCard.querySelector('.likes i');
    const likeCount = blogCard.querySelector('.like-count');
    
    if (likeIcon.classList.contains('far')) {
        likeIcon.classList.remove('far');
        likeIcon.classList.add('fas');
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
    } else {
        likeIcon.classList.remove('fas');
        likeIcon.classList.add('far');
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
    }
}

function addComment(blogCard) {
    const commentInput = blogCard.querySelector('.comment-input');
    const content = commentInput.value.trim();
    
    if (!content) return;
    
    // In a real app, we would verify if user is logged in
    // For demo purposes, we'll use a guest name
    const author = 'Guest User';
    
    const newComment = {
        id: Date.now(),
        author: author,
        date: new Date().toISOString().split('T')[0],
        content: content,
        replies: []
    };
    
    const commentsList = blogCard.querySelector('.comments-list');
    commentsList.appendChild(createCommentElement(newComment));
    
    // Update comment count
    const commentCount = blogCard.querySelector('.comment-count');
    commentCount.textContent = parseInt(commentCount.textContent) + 1;
    
    // Clear the input
    commentInput.value = '';
}

function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.dataset.id = comment.id;
    
    const commentHeader = document.createElement('div');
    commentHeader.className = 'comment-header';
    
    const commentAuthor = document.createElement('span');
    commentAuthor.className = 'comment-author';
    commentAuthor.textContent = comment.author;
    
    const commentDate = document.createElement('span');
    commentDate.className = 'comment-date';
    commentDate.textContent = formatDate(comment.date);
    
    commentHeader.appendChild(commentAuthor);
    commentHeader.appendChild(commentDate);
    
    const commentContent = document.createElement('div');
    commentContent.className = 'comment-content';
    commentContent.textContent = comment.content;
    
    const commentActions = document.createElement('div');
    commentActions.className = 'comment-actions';
    
    const replyBtn = document.createElement('button');
    replyBtn.className = 'reply-btn';
    replyBtn.textContent = 'Reply';
    replyBtn.addEventListener('click', function() {
        toggleReplyForm(commentDiv);
    });
    
    commentActions.appendChild(replyBtn);
    
    commentDiv.appendChild(commentHeader);
    commentDiv.appendChild(commentContent);
    commentDiv.appendChild(commentActions);
    
    // Add reply form (hidden by default)
    const replyForm = document.createElement('form');
    replyForm.className = 'reply-form comment-form';
    replyForm.innerHTML = `
        <textarea placeholder="Write a reply..." class="comment-input" maxlength="200"></textarea>
        <button type="submit" class="comment-submit">Reply</button>
    `;
    replyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addReply(commentDiv);
    });
    
    commentDiv.appendChild(replyForm);
    
    // Add existing replies
    if (comment.replies && comment.replies.length > 0) {
        const repliesDiv = document.createElement('div');
        repliesDiv.className = 'replies';
        
        comment.replies.forEach(reply => {
            const replyElement = createCommentElement(reply);
            replyElement.classList.add('reply');
            repliesDiv.appendChild(replyElement);
        });
        
        commentDiv.appendChild(repliesDiv);
    }
    
    return commentDiv;
}

function toggleReplyForm(commentDiv) {
    const replyForm = commentDiv.querySelector('.reply-form');
    replyForm.style.display = replyForm.style.display === 'block' ? 'none' : 'block';
    
    if (replyForm.style.display === 'block') {
        replyForm.querySelector('.comment-input').focus();
    }
}

function addReply(commentDiv) {
    const replyInput = commentDiv.querySelector('.reply-form .comment-input');
    const content = replyInput.value.trim();
    
    if (!content) return;
    
    // In a real app, we would verify if user is logged in
    // For demo purposes, we'll use a guest name
    const author = 'Guest User';
    
    const newReply = {
        id: Date.now(),
        author: author,
        date: new Date().toISOString().split('T')[0],
        content: content,
        replies: [] // No nested replies for simplicity
    };
    
    // Check if replies container exists, create if not
    let repliesDiv = commentDiv.querySelector('.replies');
    if (!repliesDiv) {
        repliesDiv = document.createElement('div');
        repliesDiv.className = 'replies';
        commentDiv.appendChild(repliesDiv);
    }
    
    const replyElement = createCommentElement(newReply);
    replyElement.classList.add('reply');
    repliesDiv.appendChild(replyElement);
    
    // Hide the reply form
    commentDiv.querySelector('.reply-form').style.display = 'none';
    
    // Clear the input
    replyInput.value = '';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--gold-color)';
    notification.style.color = 'var(--dark-color)';
    notification.style.padding = '1rem 2rem';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '9999';
    notification.style.transform = 'translateY(100px)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animation
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize login and signup forms
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // In a real app, you would handle authentication here
    closeAllModals();
    showNotification('Login successful!');
    updateAuthState(true);
});

document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // In a real app, you would handle registration here
    closeAllModals();
    showNotification('Account created successfully!');
    updateAuthState(true);
});

function updateAuthState(isLoggedIn) {
    if (isLoggedIn) {
        // Change auth buttons to user profile
        const authBtns = document.querySelector('.auth-buttons');
        authBtns.innerHTML = `
            <div class="user-profile">
                <span>Welcome, User!</span>
                <button class="logout-btn">Logout</button>
            </div>
        `;
        
        // Add logout functionality
        document.querySelector('.logout-btn').addEventListener('click', function() {
            updateAuthState(false);
            showNotification('Logged out successfully!');
        });
    } else {
        // Restore original auth buttons
        const authBtns = document.querySelector('.auth-buttons');
        authBtns.innerHTML = `
            <button class="login-btn">Login</button>
            <button class="signup-btn">Sign Up</button>
        `;
        
        // Reattach event listeners
        document.querySelector('.login-btn').addEventListener('click', () => openModal(loginModal));
        document.querySelector('.signup-btn').addEventListener('click', () => openModal(signupModal));
    }
}

// Scroll to top button
function setupScrollToTop() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.style.position = 'fixed';
    scrollTopBtn.style.bottom = '20px';
    scrollTopBtn.style.right = '20px';
    scrollTopBtn.style.backgroundColor = 'var(--gold-color)';
    scrollTopBtn.style.color = 'var(--dark-color)';
    scrollTopBtn.style.border = 'none';
    scrollTopBtn.style.borderRadius = '50%';
    scrollTopBtn.style.width = '40px';
    scrollTopBtn.style.height = '40px';
    scrollTopBtn.style.fontSize = '1.2rem';
    scrollTopBtn.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    scrollTopBtn.style.cursor = 'pointer';
    scrollTopBtn.style.zIndex = '100';
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.transform = 'translateY(20px)';
    scrollTopBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    document.body.appendChild(scrollTopBtn);
    
    // Show button when page is scrolled down
    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.transform = 'translateY(20px)';
        }
    }, 200));
    
    // Scroll to top when button is clicked
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Search functionality
function setupSearch() {
    // Create search bar
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.maxWidth = '600px';
    searchContainer.style.margin = '2rem auto';
    searchContainer.style.position = 'relative';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search blogs...';
    searchInput.className = 'search-input';
    searchInput.style.width = '100%';
    searchInput.style.padding = '0.8rem 1rem 0.8rem 2.5rem';
    searchInput.style.borderRadius = '4px';
    searchInput.style.border = 'none';
    searchInput.style.backgroundColor = 'var(--dark-secondary)';
    searchInput.style.color = 'var(--white-color)';
    searchInput.style.fontSize = '1rem';
    
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search';
    searchIcon.style.position = 'absolute';
    searchIcon.style.left = '1rem';
    searchIcon.style.top = '50%';
    searchIcon.style.transform = 'translateY(-50%)';
    searchIcon.style.color = 'var(--gold-color)';
    
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchInput);
    
    // Find the right place to insert the search
    const featuredSection = document.querySelector('.featured-blogs');
    featuredSection.insertBefore(searchContainer, featuredSection.firstChild);
    
    // Search functionality
    searchInput.addEventListener('input', debounce(function() {
        const searchTerm = this.value.toLowerCase().trim();
        const blogCards = document.querySelectorAll('.blog-card');
        
        if (searchTerm === '') {
            // Show all blogs
            blogCards.forEach(card => {
                card.style.display = 'block';
                // Reset animation
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                }, 10);
            });
            return;
        }
        
        // Filter blogs
        blogCards.forEach(card => {
            const title = card.querySelector('.blog-title').textContent.toLowerCase();
            const author = card.querySelector('.blog-author').textContent.toLowerCase();
            const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || author.includes(searchTerm) || excerpt.includes(searchTerm)) {
                card.style.display = 'block';
                // Animate the appearance
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                }, 10);
            } else {
                card.style.display = 'none';
            }
        });
    }, 300));
}

// Enhanced comment features
function enhanceComments() {
    // Add emoji picker to comments
    const addEmojiPicker = (commentInput) => {
        const emojiContainer = document.createElement('div');
        emojiContainer.className = 'emoji-container';
        emojiContainer.style.marginBottom = '0.5rem';
        emojiContainer.style.display = 'flex';
        emojiContainer.style.gap = '0.5rem';
        
        const commonEmojis = ['👍', '❤️', '😊', '👏', '🙏', '🎉'];
        
        commonEmojis.forEach(emoji => {
            const emojiBtn = document.createElement('button');
            emojiBtn.type = 'button';
            emojiBtn.className = 'emoji-btn';
            emojiBtn.textContent = emoji;
            emojiBtn.style.border = 'none';
            emojiBtn.style.background = 'transparent';
            emojiBtn.style.fontSize = '1.2rem';
            emojiBtn.style.cursor = 'pointer';
            emojiBtn.style.transition = 'transform 0.2s ease';
            
            emojiBtn.addEventListener('click', () => {
                commentInput.value += emoji;
                commentInput.focus();
            });
            
            emojiBtn.addEventListener('mouseenter', () => {
                emojiBtn.style.transform = 'scale(1.2)';
            });
            
            emojiBtn.addEventListener('mouseleave', () => {
                emojiBtn.style.transform = 'scale(1)';
            });
            
            emojiContainer.appendChild(emojiBtn);
        });
        
        const commentForm = commentInput.closest('.comment-form');
        commentForm.insertBefore(emojiContainer, commentInput);
    };
    
    // Add emoji pickers to all comment forms
    document.querySelectorAll('.comment-form .comment-input').forEach(input => {
        addEmojiPicker(input);
    });
    
    // Observer to add emoji pickers to new comments
    const commentObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        const inputs = node.querySelectorAll('.comment-form .comment-input');
                        inputs.forEach(input => {
                            if (!input.previousElementSibling || !input.previousElementSibling.classList.contains('emoji-container')) {
                                addEmojiPicker(input);
                            }
                        });
                    }
                });
            }
        });
    });
    
    commentObserver.observe(document.querySelector('.blog-grid'), {
        childList: true,
        subtree: true
    });
}

// Add double-tap support for mobile
function setupDoubleTap() {
    let lastTap = 0;
    let tapTimeout;
    const blogGrid = document.querySelector('.blog-grid');
    
    blogGrid.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        clearTimeout(tapTimeout);
        
        if (tapLength < 300 && tapLength > 0) {
            // Double tap detected
            const blogCard = e.target.closest('.blog-card');
            if (blogCard) {
                const likeIcon = blogCard.querySelector('.likes i');
                if (likeIcon) {
                    // Trigger like with visual feedback
                    toggleLike(blogCard);
                    
                    // Create a heart animation at tap position
                    const heart = document.createElement('div');
                    heart.innerHTML = '❤️';
                    heart.style.position = 'fixed';
                    heart.style.left = `${e.changedTouches[0].clientX - 15}px`;
                    heart.style.top = `${e.changedTouches[0].clientY - 15}px`;
                    heart.style.fontSize = '30px';
                    heart.style.pointerEvents = 'none';
                    heart.style.zIndex = '9999';
                    heart.style.opacity = '1';
                    heart.style.transform = 'scale(1)';
                    heart.style.transition = 'all 0.5s ease';
                    document.body.appendChild(heart);
                    
                    // Animate and remove the heart
                    setTimeout(() => {
                        heart.style.opacity = '0';
                        heart.style.transform = 'scale(3) translateY(-20px)';
                    }, 50);
                    
                    setTimeout(() => {
                        document.body.removeChild(heart);
                    }, 550);
                    
                    e.preventDefault();
                }
            }
        } else {
            // Single tap - add ripple effect for visual feedback
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            ripple.style.position = 'absolute';
            ripple.style.width = '40px';
            ripple.style.height = '40px';
            ripple.style.backgroundColor = 'rgba(212, 175, 55, 0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.left = `${e.changedTouches[0].clientX - e.target.getBoundingClientRect().left - 20}px`;
            ripple.style.top = `${e.changedTouches[0].clientY - e.target.getBoundingClientRect().top - 20}px`;
            ripple.style.transform = 'scale(0)';
            ripple.style.transition = 'transform 0.3s ease-out';
            
            const container = e.target.closest('.blog-card');
            if (container) {
                container.style.position = 'relative';
                container.style.overflow = 'hidden';
                container.appendChild(ripple);
                
                // Trigger animation
                setTimeout(() => {
                    ripple.style.transform = 'scale(4)';
                    ripple.style.opacity = '0';
                }, 10);
                
                // Remove ripple after animation
                setTimeout(() => {
                    if (container.contains(ripple)) {
                        container.removeChild(ripple);
                    }
                }, 600);
            }
        }
        
        lastTap = currentTime;
    });
}

// Add menu swipe functionality
function setupMenuSwipe() {
    let menuTouchStartX = 0;
    let menuTouchEndX = 0;
    
    // Only trigger menu swipe when near the left edge of the screen
    document.addEventListener('touchstart', e => {
        if (e.touches[0].clientX < 50) { // Only detect swipes starting from left edge
            menuTouchStartX = e.changedTouches[0].screenX;
        }
    }, {passive: true});
    
    document.addEventListener('touchend', e => {
        if (menuTouchStartX > 0) { // Only process if we started tracking from left edge
            menuTouchEndX = e.changedTouches[0].screenX;
            handleMenuSwipe();
            menuTouchStartX = 0; // Reset after handling
        }
    }, {passive: true});
    
    // Close the menu when clicking on the overlay
    document.querySelector('.menu-touch-overlay').addEventListener('click', closeMenu);
    
    // Close menu with the dedicated close button
    document.querySelector('.menu-close-btn').addEventListener('click', closeMenu);
    
    function handleMenuSwipe() {
        if (menuTouchEndX - menuTouchStartX > 75) {
            // Swiped right - open menu if it's closed
            if (!navLinks.classList.contains('show')) {
                toggleMobileMenu();
            }
        } else if (menuTouchStartX - menuTouchEndX > 75) {
            // Swiped left - close menu if it's open
            if (navLinks.classList.contains('show')) {
                closeMenu();
            }
        }
    }
}

// Enhance keyboard navigation
function enhanceKeyboardNavigation() {
    // Setup keyboard navigation for blog cards
    document.addEventListener('keydown', (e) => {
        // Don't interfere with text input areas
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Get all visible blog cards
        const blogCards = Array.from(document.querySelectorAll('.blog-card')).filter(
            card => window.getComputedStyle(card).display !== 'none'
        );
        
        if (blogCards.length === 0) return;
        
        // Find which card is currently active
        let activeIndex = blogCards.findIndex(card => card.classList.contains('active-card'));
        
        // If no card is active, activate the first one
        if (activeIndex === -1) {
            blogCards[0].classList.add('active-card');
            activeIndex = 0;
        }
        
        // Handle arrow keys for navigation
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                if (activeIndex < blogCards.length - 1) {
                    blogCards[activeIndex].classList.remove('active-card');
                    blogCards[activeIndex + 1].classList.add('active-card');
                    blogCards[activeIndex + 1].scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                if (activeIndex > 0) {
                    blogCards[activeIndex].classList.remove('active-card');
                    blogCards[activeIndex - 1].classList.add('active-card');
                    blogCards[activeIndex - 1].scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }
                break;
            case 'Enter':
                // Activate the read more button on the active card
                if (document.activeElement.tagName !== 'BUTTON') {
                    const readMoreBtn = blogCards[activeIndex].querySelector('.read-more-btn');
                    if (readMoreBtn) {
                        e.preventDefault();
                        readMoreBtn.click();
                    }
                }
                break;
            case 'l':
            case 'L':
                // Like the active card
                if (document.activeElement.tagName !== 'BUTTON' && 
                    document.activeElement.tagName !== 'INPUT' && 
                    document.activeElement.tagName !== 'TEXTAREA') {
                    const likeBtn = blogCards[activeIndex].querySelector('.likes i');
                    if (likeBtn) {
                        e.preventDefault();
                        toggleLike(blogCards[activeIndex]);
                    }
                }
                break;
        }
    });
    
    // Add keyboard shortcuts help button
    const helpBtn = document.createElement('button');
    helpBtn.className = 'keyboard-help-btn';
    helpBtn.innerHTML = '<i class="fas fa-keyboard"></i>';
    helpBtn.setAttribute('aria-label', 'Keyboard shortcuts help');
    helpBtn.style.position = 'fixed';
    helpBtn.style.bottom = '140px';
    helpBtn.style.right = '20px';
    helpBtn.style.backgroundColor = 'var(--dark-secondary)';
    helpBtn.style.color = 'var(--gold-color)';
    helpBtn.style.border = 'none';
    helpBtn.style.borderRadius = '50%';
    helpBtn.style.width = '40px';
    helpBtn.style.height = '40px';
    helpBtn.style.fontSize = '1.2rem';
    helpBtn.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    helpBtn.style.cursor = 'pointer';
    helpBtn.style.zIndex = '100';
    
    document.body.appendChild(helpBtn);
    
    helpBtn.addEventListener('click', () => {
        // Create a custom keyboard shortcuts help dialog
        const helpDialog = document.createElement('div');
        helpDialog.className = 'keyboard-shortcuts-dialog';
        helpDialog.style.position = 'fixed';
        helpDialog.style.top = '50%';
        helpDialog.style.left = '50%';
        helpDialog.style.transform = 'translate(-50%, -50%)';
        helpDialog.style.backgroundColor = 'var(--dark-secondary)';
        helpDialog.style.color = 'var(--white-color)';
        helpDialog.style.padding = '2rem';
        helpDialog.style.borderRadius = '8px';
        helpDialog.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        helpDialog.style.zIndex = '10000';
        helpDialog.style.maxWidth = '400px';
        helpDialog.style.width = '90%';
        
        const shortcuts = [
            { key: '→, ↓', action: 'Next blog post' },
            { key: '←, ↑', action: 'Previous blog post' },
            { key: 'Enter', action: 'Expand/collapse post' },
            { key: 'L', action: 'Like post' },
            { key: 'Esc', action: 'Close modals' }
        ];
        
        let shortcutsHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="margin: 0; color: var(--gold-color);">Keyboard Shortcuts</h3>
                <button class="close-help" style="background: none; border: none; color: var(--white-color); cursor: pointer; font-size: 1.5rem;">&times;</button>
            </div>
        `;
        
        shortcuts.forEach(shortcut => {
            shortcutsHTML += `
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <span style="background-color: rgba(212, 175, 55, 0.2); padding: 0.3rem 0.6rem; border-radius: 4px; color: var(--gold-color);">${shortcut.key}</span>
                    <span>${shortcut.action}</span>
                </div>
            `;
        });
        
        helpDialog.innerHTML = shortcutsHTML;
        document.body.appendChild(helpDialog);
        
        // Close button functionality
        const closeBtn = helpDialog.querySelector('.close-help');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(helpDialog);
        });
        
        // Also close when clicking outside
        document.addEventListener('click', function closeHelp(e) {
            if (!helpDialog.contains(e.target) && e.target !== helpBtn) {
                if (document.body.contains(helpDialog)) {
                    document.body.removeChild(helpDialog);
                }
                document.removeEventListener('click', closeHelp);
            }
        });
        
        // Close with Escape key
        document.addEventListener('keydown', function escapeHelp(e) {
            if (e.key === 'Escape') {
                if (document.body.contains(helpDialog)) {
                    document.body.removeChild(helpDialog);
                }
                document.removeEventListener('keydown', escapeHelp);
            }
        });
    });
    
    // Add escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Call the keyboard navigation enhancement
// Helper function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Setup lazy loading for images
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy-image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        let lazyLoadThrottleTimeout;
        
        function lazyLoad() {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }
            
            lazyLoadThrottleTimeout = setTimeout(() => {
                const scrollTop = window.pageYOffset;
                lazyImages.forEach(img => {
                    if (img.offsetTop < window.innerHeight + scrollTop) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy-image');
                    }
                });
                
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationChange', lazyLoad);
                }
            }, 20);
        }
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
    }
}

// Variables for touch functionality
let touchStartX = 0;
let touchEndX = 0;

// Handle swipe functionality
function handleSwipe() {
    const swipeThreshold = 75;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) < swipeThreshold) return;
    
    if (swipeDistance > 0) {
        // Swiped right - show previous blog card on mobile view
        if (window.innerWidth <= 768) {
            const blogGrid = document.querySelector('.blog-grid');
            blogGrid.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
            
            // Add visual feedback
            document.querySelector('.swipe-left').style.transform = 'translateY(-50%) scale(1.2)';
            setTimeout(() => {
                document.querySelector('.swipe-left').style.transform = 'translateY(-50%) scale(1)';
            }, 300);
        }
    } else {
        // Swiped left - show next blog card on mobile view
        if (window.innerWidth <= 768) {
            const blogGrid = document.querySelector('.blog-grid');
            blogGrid.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
            
            // Add visual feedback
            document.querySelector('.swipe-right').style.transform = 'translateY(-50%) scale(1.2)';
            setTimeout(() => {
                document.querySelector('.swipe-right').style.transform = 'translateY(-50%) scale(1)';
            }, 300);
        }
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the blog posts
    loadSampleBlogs();
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a nav link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.mobile-menu') && 
            !e.target.closest('.nav-links') && 
            navLinks.classList.contains('show')) {
            closeMenu();
        }
    });
    
    // Touch events for mobile swipe
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    // Setup menu swipe functionality for mobile
    setupMenuSwipe();
    
    // Setup lazy loading for images
    setupLazyLoading();
    
    // Modal functionality
    uploadBtn.addEventListener('click', () => openModal(uploadModal));
    loginBtn.addEventListener('click', () => openModal(loginModal));
    signupBtn.addEventListener('click', () => openModal(signupModal));
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Switch between login and signup forms
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(signupModal);
    });
    
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(signupModal);
        openModal(loginModal);
    });
    
    // Character counter for blog content
    blogContent.addEventListener('input', updateCharCounter);
    
    // Blog image preview
    blogImageInput.addEventListener('change', handleImagePreview);
    
    // Blog form submission
    blogForm.addEventListener('submit', handleBlogSubmission);
    
    // Setup scroll to top button
    setupScrollToTop();
    
    // Setup search functionality
    setupSearch();
    
    // Enhance comments with emoji picker
    enhanceComments();
    
    // Setup double-tap for mobile
    setupDoubleTap();
    
    // Enhance keyboard navigation
    enhanceKeyboardNavigation();
})



// ======= CONTENTS FROM menu-functions.js =======
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



// ======= CONTENTS FROM mobile-enhancements.js =======
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
    
    // For horizontal scrolling on mobile
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
    // Increase touch target sizes
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



