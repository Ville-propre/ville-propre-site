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
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fermer le menu mobile si ouvert
                const navLinks = document.getElementById('navLinks');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
}

// ============================================
// FAQ ACCORDION
// ============================================
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Fermer les autres items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Ouvrir/fermer l'item courant
            item.classList.toggle('active');
        });
    });
}

// ============================================
// FILTRES ÉVÉNEMENTS
// ============================================
function initEventFilters() {
    const filterForm = document.getElementById('filterForm');
    if (!filterForm) return;
    
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les valeurs des filtres
        const type = document.getElementById('filter-type').value;
        const lieu = document.getElementById('filter-lieu').value;
        const date = document.getElementById('filter-date').value;
        
        // Simulation de filtrage
        const events = document.querySelectorAll('.evenement');
        let visibleCount = 0;
        
        events.forEach(event => {
            let showEvent = true;
            
            // Filtrage par type (simulé)
            if (type && type !== 'all') {
                const eventType = event.getAttribute('data-type');
                if (eventType !== type) showEvent = false;
            }
            
            // Afficher/masquer l'événement
            if (showEvent) {
                event.style.display = 'block';
                visibleCount++;
            } else {
                event.style.display = 'none';
            }
        });
        
        // Afficher un message si aucun résultat
        const noResults = document.getElementById('no-results');
        if (noResults) {
            if (visibleCount === 0) {
                noResults.style.display = 'block';
            } else {
                noResults.style.display = 'none';
            }
        }
    });
    
    // Réinitialiser les filtres
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            filterForm.reset();
            document.querySelectorAll('.evenement').forEach(event => {
                event.style.display = 'block';
            });
            const noResults = document.getElementById('no-results');
            if (noResults) noResults.style.display = 'none';
        });
    }
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message, type = 'info') {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <p>${message}</p>
        <button class="notification-close">&times;</button>
    `;
    
    // Ajouter le style
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'error' ? '#f8d7da' : type === 'success' ? '#d4edda' : '#d1ecf1'};
        color: ${type === 'error' ? '#721c24' : type === 'success' ? '#155724' : '#0c5460'};
        border: 1px solid ${type === 'error' ? '#f5c6cb' : type === 'success' ? '#c3e6cb' : '#bee5eb'};
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Bouton de fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 15px;
        color: inherit;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
    
    // Ajouter les animations CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// FORMULAIRE DE CONTACT
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les données du formulaire
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Validation
        let isValid = true;
        const requiredFields = ['nom', 'email', 'sujet', 'message'];
        
        requiredFields.forEach(field => {
            const input = this.querySelector(`[name="${field}"]`);
            if (!data[field] || data[field].trim() === '') {
                isValid = false;
                input.style.borderColor = '#dc3545';
            } else {
                input.style.borderColor = '#ddd';
            }
        });
        
        // Validation email
        if (data.email && !validateEmail(data.email)) {
            isValid = false;
            this.querySelector('[name="email"]').style.borderColor = '#dc3545';
            showNotification('Veuillez entrer une adresse email valide.', 'error');
        }
        
        if (!isValid) {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        
        // Simulation d'envoi
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// ============================================
// INITIALISATION DES FORMULAIRES DE PAGE
// ============================================
// Appeler initContactForm si on est sur la page contact
if (document.getElementById('contactForm')) {
    initContactForm();
}
