// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header Background on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = 'var(--background-white)';
        header.style.backdropFilter = 'none';
    }
});

// Newsletter Form Submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        if (email) {
            // Simulate form submission
            const button = this.querySelector('button');
            const originalText = button.textContent;
            
            button.textContent = 'Subscribing...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Subscribed!';
                button.style.backgroundColor = 'var(--secondary-color)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.backgroundColor = '';
                    this.reset();
                }, 2000);
            }, 1000);
        }
    });
}

// Contact Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const name = this.querySelector('input[placeholder="Your Name"]').value.trim();
        const email = this.querySelector('input[placeholder="Your Email"]').value.trim();
        const subject = this.querySelector('input[placeholder="Subject"]').value.trim();
        const message = this.querySelector('textarea').value.trim();
        
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        const button = this.querySelector('button');
        const originalText = button.textContent;
        
        button.textContent = 'Sending...';
        button.disabled = true;
        
        setTimeout(() => {
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            button.textContent = originalText;
            button.disabled = false;
            this.reset();
        }, 1500);
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--secondary-color)' : type === 'error' ? '#ef4444' : 'var(--primary-color)'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: var(--shadow-large);
        z-index: 10000;
        font-weight: 500;
        max-width: 400px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease-in-out;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.tip-card, .category-card, .about-text, .about-stats');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
});

// Dynamic year in footer
document.addEventListener('DOMContentLoaded', () => {
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.textContent = footerYear.textContent.replace('2025', currentYear);
    }
});

// Scroll to top functionality
function createScrollToTopButton() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: var(--shadow-medium);
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.background = 'var(--primary-dark)';
        scrollToTopBtn.style.transform = 'translateY(-3px)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.background = 'var(--primary-color)';
        scrollToTopBtn.style.transform = 'translateY(0)';
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', createScrollToTopButton);

// Performance optimization: Lazy loading for images (if added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add smooth hover effects to cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.tip-card, .category-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add loading class to body when page loads
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Cookie Consent Banner
function initCookieConsent() {
    if (localStorage.getItem('cookieConsent')) return;

    const banner = document.createElement('div');
    banner.id = 'cookie-consent';
    banner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #1f2937;
        color: #f9fafb;
        padding: 16px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        z-index: 9999;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
        font-size: 14px;
    `;
    banner.innerHTML = `
        <p style="margin:0;flex:1;min-width:200px;">We use cookies to improve your experience. By continuing to use this site, you agree to our <a href="/privacy.html" style="color:#6366f1;text-decoration:underline;">Privacy Policy</a>.</p>
        <button id="accept-cookies" style="background:#6366f1;color:#fff;border:none;padding:10px 24px;border-radius:6px;cursor:pointer;font-weight:600;">Accept</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('accept-cookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        banner.remove();
    });
}
document.addEventListener('DOMContentLoaded', initCookieConsent);

// Simple analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    // This is where you would integrate with analytics services
    console.log('Analytics Event:', eventName, eventData);
}

// Track form submissions
document.addEventListener('submit', (e) => {
    const form = e.target;
    if (form.classList.contains('newsletter-form')) {
        trackEvent('newsletter_signup');
    } else if (form.classList.contains('contact-form')) {
        trackEvent('contact_form_submit');
    }
});

// Track navigation clicks
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        trackEvent('navigation_click', { section: e.target.textContent });
    });
});

// Add focus trap for mobile menu accessibility
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}


/* ===== TIP PAGE ENGAGEMENT FEATURES ===== */

const TIPS_DATA = [
  // Food & Cooking
  { slug: 'easy-weeknight-dinners',      cat: 'food',          title: 'Quick Weeknight Dinners',                 desc: 'Tasty home-cooked meals in 30 minutes or less.',                      icon: 'fa-utensils' },
  { slug: 'meal-prep-beginners',         cat: 'food',          title: 'Meal Prep for Beginners',                 desc: 'Batch-cook once, eat well all week — no chef skills needed.',          icon: 'fa-boxes' },
  { slug: 'indian-cooking-basics',       cat: 'food',          title: 'Indian Cooking Basics',                   desc: 'Master the techniques behind great Indian food.',                      icon: 'fa-mortar-pestle' },
  { slug: 'cooking-on-budget',           cat: 'food',          title: 'Cooking on a Budget',                     desc: 'Delicious, nutritious meals that are easy on your wallet.',            icon: 'fa-coins' },
  { slug: 'spices-flavors-guide',        cat: 'food',          title: 'Spices & Flavours Guide',                 desc: 'Build deep, complex flavours with the right spice combinations.',      icon: 'fa-pepper-hot' },
  { slug: 'pantry-essentials',           cat: 'food',          title: 'Pantry Essentials',                       desc: 'Stock these 20 staples and cook almost anything.',                    icon: 'fa-box-open' },
  { slug: 'healthy-breakfast-ideas',     cat: 'food',          title: 'Healthy Breakfast Ideas',                 desc: 'Quick, energising breakfasts that set you up for the day.',           icon: 'fa-sun' },
  { slug: 'one-pot-meals',               cat: 'food',          title: 'One-Pot Meals',                           desc: 'Fewer dishes, more flavour — complete dinners in one pot.',           icon: 'fa-fire' },
  { slug: 'air-fryer-tips',              cat: 'food',          title: 'Air Fryer Tips & Tricks',                 desc: 'Get crispy, healthy results every time with your air fryer.',         icon: 'fa-wind' },
  { slug: 'kitchen-organization',        cat: 'food',          title: 'Kitchen Organisation',                    desc: 'A well-organised kitchen makes cooking faster and more fun.',          icon: 'fa-th-large' },
  { slug: 'save-money-groceries-india',  cat: 'food',          title: 'Save Money on Groceries in India',        desc: 'Smart strategies to slash your grocery bill.',                         icon: 'fa-rupee-sign' },
  { slug: 'air-fryer-indian-recipes',    cat: 'food',          title: 'Air Fryer Indian Recipes',                desc: 'Classic Indian snacks made healthier in the air fryer.',               icon: 'fa-drumstick-bite' },
  // Home & Living
  { slug: 'home-decor-ideas',            cat: 'home',          title: 'Home Decor Ideas',                        desc: 'Transform any room on a budget with smart styling.',                  icon: 'fa-couch' },
  { slug: 'diy-home-projects',           cat: 'home',          title: 'Easy DIY Home Projects',                  desc: 'Beginner-friendly projects that personalise your space.',              icon: 'fa-tools' },
  { slug: 'small-space-living',          cat: 'home',          title: 'Small Space Living',                      desc: 'Make any compact home feel open and comfortable.',                    icon: 'fa-compress-arrows-alt' },
  { slug: 'lighting-tips',               cat: 'home',          title: 'Home Lighting Tips',                      desc: 'Create the perfect ambiance with layered lighting.',                  icon: 'fa-lightbulb' },
  { slug: 'upcycling-ideas',             cat: 'home',          title: 'Upcycling Ideas',                         desc: 'Give old items a beautiful new life.',                                icon: 'fa-recycle' },
  { slug: 'home-organization',           cat: 'home',          title: 'Home Organisation',                       desc: 'Smart systems to keep every room tidy and functional.',               icon: 'fa-boxes' },
  { slug: 'decluttering',                cat: 'home',          title: 'Decluttering Strategies',                 desc: 'Proven methods to create a calm, clutter-free environment.',          icon: 'fa-trash-alt' },
  { slug: 'energy-efficient',            cat: 'home',          title: 'Energy-Efficient Living',                 desc: 'Simple changes that cut energy bills and help the planet.',           icon: 'fa-leaf' },
  { slug: 'indoor-plants',               cat: 'home',          title: 'Indoor Plants Guide',                     desc: 'Easy-care plants that add life and freshness to any room.',           icon: 'fa-seedling' },
  { slug: 'color-psychology',            cat: 'home',          title: 'Colour Psychology',                       desc: 'How wall colours affect your mood — and how to choose wisely.',       icon: 'fa-palette' },
  { slug: 'sustainable-living',          cat: 'home',          title: 'Sustainable Living',                      desc: 'Eco-friendly habits that reduce waste and save money.',                icon: 'fa-globe' },
  { slug: 'small-apartment-decor-india', cat: 'home',          title: 'Small Apartment Decor for Indian Homes',  desc: 'Beautiful budget-friendly ideas for 1BHK and 2BHK flats.',            icon: 'fa-home' },
  // Productivity
  { slug: 'mindful-productivity',        cat: 'productivity',  title: 'Mindful Productivity',                    desc: 'Accomplish more while stressing less.',                               icon: 'fa-brain' },
  { slug: 'time-management',             cat: 'productivity',  title: 'Time Management Tips',                    desc: 'Prioritise what matters and eliminate time wasters.',                 icon: 'fa-clock' },
  { slug: 'goal-setting',                cat: 'productivity',  title: 'Goal Setting Strategies',                 desc: 'Set and achieve meaningful goals with proven frameworks.',             icon: 'fa-bullseye' },
  { slug: 'time-blocking',               cat: 'productivity',  title: 'Time Blocking Method',                    desc: 'Max out your focus by scheduling every hour of your day.',            icon: 'fa-calendar-check' },
  { slug: 'digital-minimalism',          cat: 'productivity',  title: 'Digital Minimalism',                      desc: 'Reduce digital distractions and reclaim your focus.',                 icon: 'fa-mobile-alt' },
  { slug: 'digital-detox',               cat: 'productivity',  title: 'How to Do a Digital Detox',               desc: 'Reduce screen time without feeling anxious or disconnected.',         icon: 'fa-phone-slash' },
  { slug: 'work-life-balance',           cat: 'productivity',  title: 'Work-Life Balance',                       desc: 'Set boundaries and actually enjoy your personal time.',               icon: 'fa-balance-scale' },
  { slug: 'work-from-home-india',        cat: 'productivity',  title: 'Work From Home Tips for Indians',         desc: 'Stay focused and thrive while working from home in India.',           icon: 'fa-laptop-house' },
  // Travel
  { slug: 'budget-travel-tips',          cat: 'travel',        title: 'Budget Travel Tips',                      desc: 'See more of the world without draining your savings.',                icon: 'fa-plane' },
  { slug: 'packing-hacks',               cat: 'travel',        title: 'Packing Hacks',                           desc: 'Pack smarter, lighter, and faster for any trip.',                    icon: 'fa-suitcase' },
  { slug: 'solo-travel-tips',            cat: 'travel',        title: 'Solo Travel Tips',                        desc: 'Travel alone with confidence, safety, and total freedom.',           icon: 'fa-user' },
  { slug: 'travel-planning-guide',       cat: 'travel',        title: 'Travel Planning Guide',                   desc: 'Plan any trip step-by-step and avoid common travel mistakes.',        icon: 'fa-map' },
  { slug: 'budget-trip-india',           cat: 'travel',        title: 'Travel India on a Budget',                desc: 'Explore incredible India without overspending.',                      icon: 'fa-rupee-sign' },
  // Wellness
  { slug: 'morning-wellness',            cat: 'wellness',      title: 'Morning Wellness Routine',                desc: 'Start your day with intention and energy in just 10 minutes.',       icon: 'fa-sun' },
  { slug: 'self-care-routines',          cat: 'wellness',      title: 'Self-Care Routines',                      desc: 'Quick self-care habits that fit any schedule and actually work.',    icon: 'fa-spa' },
  { slug: 'journaling-benefits',         cat: 'wellness',      title: 'Journaling for Well-being',               desc: 'How daily journaling reduces stress and boosts mental clarity.',     icon: 'fa-book' },
  { slug: 'stress-management-tips',      cat: 'wellness',      title: 'Stress Management Tips',                  desc: 'Practical techniques to manage stress and protect your well-being.', icon: 'fa-heartbeat' },
  { slug: 'better-sleep-habits',         cat: 'wellness',      title: 'Better Sleep Habits',                     desc: 'Science-backed habits that improve sleep quality every night.',       icon: 'fa-moon' },
  { slug: 'mindfulness-beginners',       cat: 'wellness',      title: 'Mindfulness for Beginners',               desc: 'Start a mindfulness practice in just 5 minutes a day.',              icon: 'fa-spa' },
  { slug: 'healthy-eating-habits',       cat: 'wellness',      title: 'Healthy Eating Habits',                   desc: 'Simple daily choices that support long-term health and energy.',     icon: 'fa-apple-alt' },
  // Relationships
  { slug: 'relationship-building',       cat: 'relationships', title: 'Relationship Building',                   desc: 'Practical ways to build stronger, more meaningful connections.',      icon: 'fa-heart' },
  { slug: 'social-connection',           cat: 'relationships', title: 'Social Connection',                       desc: 'Overcome loneliness and build a fulfilling social life.',             icon: 'fa-users' },
  { slug: 'effective-communication',     cat: 'relationships', title: 'Effective Communication',                 desc: 'Speak and listen better to transform every relationship.',            icon: 'fa-comments' },
  { slug: 'healthy-boundaries',          cat: 'relationships', title: 'Healthy Boundaries',                      desc: 'Set limits that protect your energy without guilt.',                  icon: 'fa-shield-alt' },
  // Personal Growth
  { slug: 'personal-growth',             cat: 'growth',        title: 'Personal Growth Tips',                    desc: 'Small daily habits that compound into lasting positive change.',      icon: 'fa-chart-line' },
  { slug: 'creative-expression',         cat: 'growth',        title: 'Creative Hobbies for Adults',             desc: 'Rediscover creativity — no talent or experience required.',           icon: 'fa-paint-brush' },
  { slug: 'building-confidence',         cat: 'growth',        title: 'Building Self-Confidence',                desc: 'Practical steps to develop real confidence that lasts.',              icon: 'fa-fist-raised' },
  { slug: 'habit-stacking',              cat: 'growth',        title: 'Habit Stacking Guide',                    desc: 'Stack tiny habits to make big improvements on autopilot.',            icon: 'fa-layer-group' },
  { slug: 'overcoming-procrastination',  cat: 'growth',        title: 'Overcoming Procrastination',              desc: 'Break the procrastination cycle with strategies that work.',          icon: 'fa-bolt' },
  { slug: 'growth-mindset',              cat: 'growth',        title: 'Developing a Growth Mindset',             desc: 'Train your brain to see challenges as opportunities.',                icon: 'fa-brain' },
];

const CAT_META = {
  food:          { label: 'Food & Cooking',  page: '../categories/food-cooking.html',    icon: 'fa-utensils' },
  home:          { label: 'Home & Living',   page: '../categories/home-living.html',     icon: 'fa-home' },
  productivity:  { label: 'Productivity',    page: '../categories/productivity.html',    icon: 'fa-chart-line' },
  travel:        { label: 'Travel',          page: '../categories/travel.html',          icon: 'fa-plane' },
  wellness:      { label: 'Wellness',        page: '../categories/wellness.html',        icon: 'fa-spa' },
  relationships: { label: 'Relationships',   page: '../categories/relationships.html',   icon: 'fa-heart' },
  growth:        { label: 'Personal Growth', page: '../categories/personal-growth.html', icon: 'fa-seedling' },
};

document.addEventListener('DOMContentLoaded', function() {
  if (!document.querySelector('.tip-page')) return;
  initReadingProgress();
  initBreadcrumbs();
  initSocialProof();
  initTableOfContents();
  initAlsoRead();
  initRelatedTips();
  initAuthorBio();
  initTipNewsletter();
  initSocialShare();
});

initSearch();

function initReadingProgress() {
  var bar = document.createElement('div');
  bar.id = 'reading-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', function() {
    var total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }, { passive: true });
}

function getTipSlug() {
  return window.location.pathname.split('/').pop().replace('.html', '');
}

function initBreadcrumbs() {
  var slug = getTipSlug();
  var tip = TIPS_DATA.find(function(t) { return t.slug === slug; });
  if (!tip) return;
  var cat = CAT_META[tip.cat];
  var h1El = document.querySelector('.tip-header h1');
  var h1Text = h1El ? h1El.textContent.trim() : tip.title;
  var shortTitle = h1Text.length > 52 ? h1Text.slice(0, 52) + '...' : h1Text;
  var bc = document.createElement('nav');
  bc.className = 'tip-breadcrumbs';
  bc.setAttribute('aria-label', 'Breadcrumb');
  bc.innerHTML =
    '<div class="container"><ol class="breadcrumb-list">' +
    '<li><a href="../index.html"><i class="fas fa-home"></i> Home</a></li>' +
    '<li><a href="' + cat.page + '"><i class="fas ' + cat.icon + '"></i> ' + cat.label + '</a></li>' +
    '<li aria-current="page">' + shortTitle + '</li>' +
    '</ol></div>';
  var tipPage = document.querySelector('.tip-page');
  if (tipPage) tipPage.parentNode.insertBefore(bc, tipPage);
}

function initSocialProof() {
  var slug = getTipSlug();
  var hash = 0;
  for (var i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash = hash | 0;
  }
  var count = 1200 + (Math.abs(hash) % 7300);
  var formatted = count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count;
  var meta = document.querySelector('.tip-meta');
  if (!meta) return;
  var span = document.createElement('span');
  span.className = 'readers';
  span.innerHTML = '<i class="fas fa-users"></i> ' + formatted + ' readers';
  meta.appendChild(span);
}

function initTableOfContents() {
  var headings = document.querySelectorAll('.tip-content h2');
  if (headings.length < 3) return;
  headings.forEach(function(h, i) { if (!h.id) h.id = 'toc-' + (i + 1); });
  var items = Array.from(headings).map(function(h, i) {
    return '<li><a href="#toc-' + (i + 1) + '">' + h.textContent.trim() + '</a></li>';
  }).join('');
  var toc = document.createElement('nav');
  toc.className = 'article-toc';
  toc.setAttribute('aria-label', 'Table of contents');
  toc.innerHTML =
    '<div class="toc-header"><i class="fas fa-list-ul"></i> In This Article</div>' +
    '<ol class="toc-list">' + items + '</ol>';
  var tipContent = document.querySelector('.tip-content');
  if (!tipContent) return;
  var lead = tipContent.querySelector('.lead');
  if (lead) lead.insertAdjacentElement('afterend', toc);
  else tipContent.prepend(toc);
}

function initRelatedTips() {
  var slug = getTipSlug();
  var current = TIPS_DATA.find(function(t) { return t.slug === slug; });
  if (!current) return;
  var related = TIPS_DATA.filter(function(t) { return t.cat === current.cat && t.slug !== slug; }).slice(0, 3);
  if (related.length < 2) return;
  var cards = related.map(function(t) {
    return '<a href="../tips/' + t.slug + '.html" class="related-card">' +
      '<div class="related-icon"><i class="fas ' + t.icon + '"></i></div>' +
      '<div class="related-body"><h3>' + t.title + '</h3><p>' + t.desc + '</p></div>' +
      '<span class="related-arrow"><i class="fas fa-arrow-right"></i></span></a>';
  }).join('');
  var section = document.createElement('section');
  section.className = 'related-tips';
  section.innerHTML =
    '<div class="related-tips-inner">' +
    '<h2 class="related-title"><i class="fas fa-fire"></i> You Might Also Like</h2>' +
    '<div class="related-grid">' + cards + '</div></div>';
  var tipActions = document.querySelector('.tip-actions');
  if (tipActions) tipActions.parentNode.insertBefore(section, tipActions);
}

function initSocialShare() {
  var url = encodeURIComponent(window.location.href);
  var title = encodeURIComponent(document.title);
  var box = document.createElement('div');
  box.className = 'share-box';
  box.innerHTML =
    '<span class="share-label"><i class="fas fa-share-alt"></i> Share</span>' +
    '<div class="share-buttons">' +
    '<a href="https://www.facebook.com/sharer/sharer.php?u=' + url + '" target="_blank" rel="noopener noreferrer" class="share-btn share-facebook"><i class="fab fa-facebook-f"></i> Facebook</a>' +
    '<a href="https://twitter.com/intent/tweet?text=' + title + '&url=' + url + '" target="_blank" rel="noopener noreferrer" class="share-btn share-twitter"><i class="fab fa-x-twitter"></i> X</a>' +
    '<a href="https://pinterest.com/pin/create/button/?url=' + url + '&description=' + title + '" target="_blank" rel="noopener noreferrer" class="share-btn share-pinterest"><i class="fab fa-pinterest-p"></i> Pinterest</a>' +
    '<a href="https://www.reddit.com/submit?url=' + url + '&title=' + title + '" target="_blank" rel="noopener noreferrer" class="share-btn share-reddit"><i class="fab fa-reddit-alien"></i> Reddit</a>' +
    '<a href="https://wa.me/?text=' + title + '%20' + url + '" target="_blank" rel="noopener noreferrer" class="share-btn share-whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a>' +
    '<button class="share-btn share-copy" id="tip-copy-link"><i class="fas fa-link"></i> Copy Link</button>' +
    '</div>';
  var tipActions = document.querySelector('.tip-actions');
  if (tipActions) tipActions.parentNode.insertBefore(box, tipActions);
  var copyBtn = document.getElementById('tip-copy-link');
  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      var copyText = window.location.href;
      var self = this;
      var done = function() {
        self.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(function() { self.innerHTML = '<i class="fas fa-link"></i> Copy Link'; }, 2000);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(copyText).then(done).catch(function() { fallbackCopy(copyText, done); });
      } else {
        fallbackCopy(copyText, done);
      }
    });
  }
}

function fallbackCopy(text, callback) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(ta);
  callback();
}

function initAuthorBio() {
  var tipActions = document.querySelector('.tip-actions');
  if (!tipActions) return;
  var bio = document.createElement('div');
  bio.className = 'author-bio';
  bio.innerHTML =
    '<div class="author-avatar"><i class="fas fa-pen-nib"></i></div>' +
    '<div class="author-info">' +
      '<h4>VibeAndThrive Editorial Team</h4>' +
      '<p class="author-role">Wellness &amp; Lifestyle Writers</p>' +
      '<p>Our team researches and writes practical, evidence-informed guides on wellness, productivity, home living, and more — helping you build a life that feels as good as it looks.</p>' +
    '</div>';
  tipActions.parentNode.insertBefore(bio, tipActions);
}

function initTipNewsletter() {
  var tipActions = document.querySelector('.tip-actions');
  if (!tipActions) return;
  var nl = document.createElement('div');
  nl.className = 'tip-newsletter';
  nl.innerHTML =
    '<h3><i class="fas fa-envelope"></i> Enjoyed this guide?</h3>' +
    '<p>Get practical tips on wellness, productivity, and everyday living — delivered weekly.</p>' +
    '<form class="newsletter-form">' +
      '<input type="email" placeholder="Your email address" required>' +
      '<button type="submit" class="btn btn-primary">Subscribe Free</button>' +
    '</form>';
  tipActions.parentNode.insertBefore(nl, tipActions);
}

function initSearch() {
  var overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.innerHTML =
    '<div class="search-modal" role="dialog" aria-modal="true" aria-label="Search">' +
      '<div class="search-input-wrap">' +
        '<i class="fas fa-search"></i>' +
        '<input type="search" id="site-search-input" placeholder="Search tips..." autocomplete="off" aria-label="Search tips">' +
        '<button class="search-close-btn" aria-label="Close search"><i class="fas fa-times"></i></button>' +
      '</div>' +
      '<div class="search-results" id="search-results-list"></div>' +
    '</div>';
  document.body.appendChild(overlay);

  var input = document.getElementById('site-search-input');
  var resultsList = document.getElementById('search-results-list');

  function renderResults(query) {
    var q = query.trim().toLowerCase();
    if (!q) { resultsList.innerHTML = ''; return; }
    var matches = TIPS_DATA.filter(function(t) {
      return t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
    });
    if (!matches.length) {
      resultsList.innerHTML = '<p class="search-empty">No results for "<strong>' + query + '</strong>"</p>';
      return;
    }
    var base = window.location.pathname.includes('/tips/') ? '../tips/' : 'tips/';
    resultsList.innerHTML = matches.slice(0, 8).map(function(t) {
      return '<a href="' + base + t.slug + '.html" class="search-result-item">' +
        '<div class="search-result-icon"><i class="fas ' + t.icon + '"></i></div>' +
        '<div class="search-result-text"><h4>' + t.title + '</h4><p>' + t.desc + '</p></div>' +
        '</a>';
    }).join('');
  }

  function openSearch() {
    overlay.classList.add('open');
    setTimeout(function() { input.focus(); }, 100);
  }
  function closeSearch() {
    overlay.classList.remove('open');
    input.value = '';
    resultsList.innerHTML = '';
  }

  input.addEventListener('input', function() { renderResults(this.value); });
  overlay.querySelector('.search-close-btn').addEventListener('click', closeSearch);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeSearch(); });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });

  document.addEventListener('DOMContentLoaded', function() {
    var nav = document.querySelector('.nav-container');
    if (!nav) return;
    var btn = document.createElement('button');
    btn.className = 'search-trigger-btn';
    btn.setAttribute('aria-label', 'Search');
    btn.innerHTML = '<i class="fas fa-search"></i>';
    btn.addEventListener('click', openSearch);
    var hamburger = nav.querySelector('.hamburger');
    if (hamburger) nav.insertBefore(btn, hamburger);
    else nav.appendChild(btn);
  });
}

function initAlsoRead() {
  var slug = getTipSlug();
  var current = TIPS_DATA.find(function(t) { return t.slug === slug; });
  if (!current) return;

  var others = TIPS_DATA.filter(function(t) { return t.cat !== current.cat; });
  if (others.length < 2) return;

  var hash = 0;
  for (var i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash = hash | 0;
  }
  var idx = Math.abs(hash) % (others.length - 1);
  var picks = [others[idx], others[(idx + Math.floor(others.length / 2)) % others.length]];

  var cards = picks.map(function(t) {
    return '<a href="../tips/' + t.slug + '.html" class="also-read-card">' +
      '<span class="also-read-icon"><i class="fas ' + t.icon + '"></i></span>' +
      '<span class="also-read-text">' + t.title + '</span>' +
      '<span class="also-read-arrow"><i class="fas fa-arrow-right"></i></span>' +
      '</a>';
  }).join('');

  var box = document.createElement('div');
  box.className = 'also-read-box';
  box.innerHTML = '<p class="also-read-label"><i class="fas fa-book-open"></i> Also Read</p>' + cards;

  var tipContent = document.querySelector('.tip-content');
  if (!tipContent) return;
  var firstH2 = tipContent.querySelector('h2');
  if (firstH2) firstH2.insertAdjacentElement('afterend', box);
  else tipContent.prepend(box);
}
