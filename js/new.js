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

    // Check the tags for each project card
    projectCards.forEach(card => {

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
            
            // Loop through each project card to determine if it should be shown
            projectCards.forEach(card => {
                const tags = card.dataset.tags.toLowerCase();
                card.style.display = (selected === 'all projects' || tags.includes(selected)) ? 'block' : 'none';
            });
        });
    }
}

// Smooth scrolling for aside nav links in About's Page
function setupCVNavigation() {
    const navLinks = getElements('nav a[href^="#"]');

    // Loop through each nav link to attach a click event handler
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {

                // Calculate vertical position of the element relative to top
                const navbarHeight = getElement('nav').offsetHeight + 10;
                const offsetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
}

// Highlight the active aside nav link on the About's Page
function setupScrollSpy() {

    // Manual breakpoints for each section IDs and their vertical scroll offsets
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
        // Add some padding to the scroll position for earlier triggering
        const scrollPosition = window.scrollY + 100;
        let currentSection = '';

        // Determine which section is currently in view based on scroll position
        breakpoints.forEach(bp => {
            if (scrollPosition >= bp.offset) {
                    currentSection = bp.id;
            }
        });

        // Loop through nav links and apply or remove 'active' class
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href').substring(1) === currentSection;
            link.classList.toggle('active', isActive);
            link.parentElement.classList.toggle('active', isActive);
        });
    });
}


// Check if given name contains a number
function containsNumber(input) {
    return /\d/.test(input);
}

// Checks if given name is valid
function checkName(input) {
    if (containsNumber(input)) {
        return 'Name must not contain numbers.';
    }
    return '';
}

// Checks if email is valid
const commonDomains = ['.com', '.org', '.net', '.edu', '.gov', '.io', '.co', '.me'];

function checkEmail(input) {
    const email = input.value || input;

    // Check that email contains '@' and also '.'
    if (!email.includes('@') || !email.includes('.')) {
        return 'Please enter a valid email address.';
    } else if (email.length < 5) { // Checks that email is at least length of 5
        return 'Please enter a valid email address.';
    } else if (!commonDomains.some(tld => email.endsWith(tld))) { // Check if email ends with common domain
        return 'Email domain is not commonly used.';
    }

    return '';
}

// Checks if message is non-empty and Valid
function checkMessage(value) {
    value = value.trim()

    // Check if message empty
    if (value === '') {
        return 'Message cannot be empty.';
    }

    // Check if user trying to inject code
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

    const themeToggle = document.querySelector('.theme-toggle');
    const icon = themeToggle?.querySelector('i');
    
    // Enable dark mode
    const enableDarkmode = () => {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkmode', 'active');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    };
    
    // Disable dark mode
    const disableDarkmode = () => {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkmode', null);
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    };
    
    // Check if dark mode active
    if (localStorage.getItem('darkmode') === 'active') enableDarkmode();
    
    themeToggle?.addEventListener('click', () => {
        localStorage.getItem('darkmode') === 'active' ? disableDarkmode() : enableDarkmode();
    });
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