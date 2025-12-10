// ============================================
// MAIN SCRIPT FOR VILLE PROPRE WEBSITE
// ============================================

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser toutes les fonctionnalités
    initMobileMenu();
    initStatsAnimation();
    initNewsletterForm();
    initSmoothScroll();
    initFAQAccordion();
    initEventFilters();
    
    // Afficher l'année en cours dans le footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// ============================================
// MENU MOBILE
// ============================================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Fermer le menu en cliquant sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// ============================================
// ANIMATION DES STATISTIQUES
// ============================================
function initStatsAnimation() {
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;
    
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Valeurs initiales (toutes à 0)
    const finalValues = [0, 0, 0, 0]; // kg, bénévoles, actions, quartiers
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach((element, index) => {
                    animateCounter(element, finalValues[index]);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
}

function animateCounter(element, finalValue, duration = 2000) {
    if (!element) return;
    
    let start = 0;
    const increment = finalValue / (duration / 16); // 60fps
    const timer = setInterval(() => {
        start += increment;
        if (start >= finalValue) {
            element.textContent = finalValue.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}

// ============================================
// NEWSLETTER FORM
// ============================================
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Validation basique
        if (!validateEmail(email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        // Simulation d'envoi
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification(`Merci pour votre inscription ! Un email de confirmation a été envoyé à ${email}.`, 'success');
            newsletterForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorer les liens vides ou vers le haut
            if (href === '#' || href === '#top') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
