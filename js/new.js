const getElement = (selector) => document.querySelector(selector);
const getElements = (selector) => document.querySelectorAll(selector);

// Hamburger menu toggle
function setupHamburgerMenu() {
    const links = getElement('.nav-links');
    const navBtn = getElement('.hambgr-btn');

    if (links && navBtn) {
        navBtn.addEventListener('click', () => {
        links.classList.toggle('show-links');
        });
    }
}

// Learn more button on home page
function setupLearnMoreBut() {
    const learnMoreBtn = getElement('#learnMore');

    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }
}

// Back to top button
function setupBackToTop() {
    const backToTopBtn = getElement('#backToTop');

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Buzzing animation for project cards that are private / in-complete
function setupProjectBuzz() {
    const projectCards = getElements('.project-card');

    projectCards.forEach(card => {

        // Check for each card the tags
        const hasInProgress = card.querySelector('.tag.in-progress');
        const hasPrivate = card.querySelector('.tag.private');

        // If it's private / in-complete then add buzzing
        if (hasInProgress || hasPrivate) {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                card.classList.add('buzzing');
                setTimeout(() => card.classList.remove('buzzing'), 400);
            });
        }
    });
}

// Project filtering dropdown
function setupFilterDropdown() {
    const filterDropdown = getElement('#filterDropdown');
    const projectCards = getElements('.project-card');

    if (filterDropdown) {
            filterDropdown.addEventListener('change', () => {
            const selected = filterDropdown.value.toLowerCase();

            projectCards.forEach(card => {
                const tags = card.dataset.tags.toLowerCase();
                card.style.display = (selected === 'all projects' || tags.includes(selected)) ? 'block' : 'none';
            });
        });
    }
}

// Smooth scrolling for nav links
function setupCVNavigation() {
    const navLinks = getElements('nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const navbarHeight = getElement('nav').offsetHeight + 10;
                const offsetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
}

// Aside content navigation for about's page
function setupScrollSpy() {
    const breakpoints = [
        { id: 'work', offset: 0 },
        { id: 'education', offset: 1100 },
        { id: 'volunteer', offset: 1350 },
        { id: 'awards', offset: 1950 },
        { id: 'certificates', offset: 2900 },
        { id: 'skills', offset: 3200 },
        { id: 'languages', offset: 3500 },
        { id: 'interests', offset: 3500 }
    ];

    const navLinks = getElements('nav a[href^="#"]');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        let currentSection = '';

        breakpoints.forEach(bp => {
            if (scrollPosition >= bp.offset) {
                    currentSection = bp.id;
            }
        });

        navLinks.forEach(link => {
            const isActive = link.getAttribute('href').substring(1) === currentSection;
            link.classList.toggle('active', isActive);
            link.parentElement.classList.toggle('active', isActive);
        });
    });
}


//
// USED TO CHECK CORRECT INPUT FOR CONTACT FORM
//
function containsNumber(input) {
    return /\d/.test(input);
}

function checkName(input) {
    if (containsNumber(input)) {
        return 'Name must not contain numbers.';
    }
    return '';
}

const commonDomains = ['.com', '.org', '.net', '.edu', '.gov', '.io', '.co', '.me'];

function checkEmail(input) {
    const email = input.value || input;

    if (!email.includes('@') || !email.includes('.')) {
        return 'Please enter a valid email address.';
    } else if (email.length < 4) {
        return 'Please enter a valid email address.';
    } else if (!commonDomains.some(tld => email.endsWith(tld))) {
        return 'Email domain is not commonly used.';
    }

    return '';
}

function checkMessage(value) {
    value = value.trim()

    if (value === '') {
        return 'Message cannot be empty.';
    }

    const htmlTagPattern = /<[^>]*>/;
    if (htmlTagPattern.test(value)) {
        return 'HTML tags are not allowed in the message.';
    }

    const codePattern = /[\{\}\(\)\=\>]/;
    if (codePattern.test(value)) {
        return 'Please do not include code in the message.';
    }

    return '';
}

// Contact form submission
function setupContactForm() {
    const contactForm = getElement('#contactForm');

    const fields = {
        firstName: getElement('#first-name'),
        lastName: getElement('#last-name'),
        email: getElement('#email'),
        message: getElement('#message')
    };
  
    const errors = {
        firstName: getElement('#first-name-error'),
        lastName: getElement('#last-name-error'),
        email: getElement('#email-error'),
        message: getElement('#message-error')
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check the validity of all fields
            let valid = true;

            const firstNameError = checkName(fields.firstName.value.trim());
            if (firstNameError) {
                valid = false;
                showError(fields.firstName, errors.firstName, firstNameError);
            } else {
                clearError(fields.firstName, errors.firstName);
            }

            const lastNameError = checkName(fields.lastName.value.trim());
            if (lastNameError) {
                valid = false;
                showError(fields.lastName, errors.lastName, lastNameError);
            } else {
                clearError(fields.lastName, errors.lastName);
            }

            const emailError = checkEmail(fields.email);
            if (emailError) {
                valid = false;
                showError(fields.email, errors.email, emailError);
            } else {
                clearError(fields.email, errors.email);
            }

            const messageError = checkMessage(fields.message.value);
            if (messageError) {
                valid = false;
                showError(fields.message, errors.message, messageError);
            } else {
                clearError(fields.message, errors.message);
            }

            // If any invalid don't process
            if (!valid) return;

            // Otherwise process
            const formData = new FormData(contactForm);

            fetch('https://formspree.io/f/xblolydk', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        alert('✅ Message sent successfully!');
                        contactForm.reset();
                    } else {
                        alert('⚠️ There was an error sending your message.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('❌ There was a problem submitting your form.');
                });
        });
    }

    function showError(input, errorEl, message) {
        input.classList.add('input-error');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
    
      function clearError(input, errorEl) {
        input.classList.remove('input-error');
        errorEl.textContent = '';
        errorEl.style.display = 'none';
    }
}

// Dark/light mode toggle
function setupDarkMode() {
    const darkModeToggle = getElement('.nav-link i.fa-moon');

    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle?.classList.replace('fa-moon', 'fa-sun');
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
            darkModeToggle.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
        });
    }
}

// Scroll progress bar
function setupScrollProgressBar() {
    window.addEventListener('scroll', () => {
        const scrollProgress = getElement('#scroll-progress');
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = `${scrollPercent}%`;
    });
}

// Disable transitions during initial load
function setupInitialLoadEffects() {
    window.addEventListener('load', () => {
        document.documentElement.classList.remove('no-transition');
    });
}


// ADD ALL EVENT LISTENERES
document.addEventListener('DOMContentLoaded', () => {
    setupHamburgerMenu();
    setupBackToTop();
    setupProjectBuzz();
    setupFilterDropdown();
    setupCVNavigation();
    setupScrollSpy();
    setupContactForm();
    setupDarkMode();
    setupScrollProgressBar();
    setupInitialLoadEffects();
    setupLearnMoreBut();
});