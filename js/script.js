// import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

document.addEventListener('DOMContentLoaded', () => {
    const getElement = (selector) => document.querySelector(selector);
    const getElements = (selector) => document.querySelectorAll(selector);
  
    const links = getElement('.nav-links');
    const navBtn = getElement('.hambgr-btn');
    const backToTopBtn = getElement('#backToTop');

    // Hamburger menu button for mobile
    if (links && navBtn) {
      navBtn.addEventListener('click', () => {
        links.classList.toggle('show-links');
      });
    }

    // Back to top button on footer
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
    }

    // Buzzing for incomplete and private projects
    const projectCards = getElements('.project-card');
    projectCards.forEach(card => {
      const hasInProgress = card.querySelector('.tag.in-progress');
      const hasPrivate = card.querySelector('.tag.private');
      if (hasInProgress || hasPrivate) {
        card.addEventListener('click', (e) => {
          e.preventDefault(); // Optional: Prevent link if needed
          card.classList.add('buzzing');
          setTimeout(() => card.classList.remove('buzzing'), 400); // match animation duration
        });
      }
    });

    // Projects filtering
    const filterDropdown = getElement('#filterDropdown');
    if (filterDropdown) {
      filterDropdown.addEventListener('change', () => {
        const selected = filterDropdown.value.toLowerCase();

        projectCards.forEach(card => {
          const tags = card.dataset.tags.toLowerCase();
          if (selected === 'all projects' || tags.includes(selected)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }

    // CV Navigation Aside
    const navLinks = getElements('nav a[href^="#"]');
    if (navLinks.length > 0) {
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();

          const targetId = link.getAttribute('href').substring(1); // remove #
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            const navbarHeight = getElement('nav').offsetHeight + 10; // adjust if needed
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - navbarHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }

    // Scroll Spy to highlight active nav link based on scroll position
    const manualBreakpoints = [
      { id: 'work', offset: 0 },
      { id: 'education', offset: 1100 },
      { id: 'volunteer', offset: 1350 },
      { id: 'awards', offset: 1950 },
      { id: 'certificates', offset: 2900 },
      { id: 'skills', offset: 3200 },
      { id: 'languages', offset: 3500 },
      { id: 'interests', offset: 3500 }
    ];

    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY + 100; 
      let currentSection = '';

      manualBreakpoints.forEach(bp => {
        if (scrollPosition >= bp.offset) {
          currentSection = bp.id;
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        link.parentElement.classList.remove('active');

        if (link.getAttribute('href').substring(1) === currentSection) {
          link.classList.add('active');
          link.parentElement.classList.add('active');
        }
      });
    });


    const contactForm = getElement('#contactForm'); 

    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop browser default

        const formData = new FormData(contactForm);

        fetch('https://formspree.io/f/xblolydk', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
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

    // Light/Dark mode!
    const darkModeToggle = document.querySelector('.nav-link i.fa-moon');

    // 1. Check on page load if dark mode was previously enabled
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark-mode');
      if (darkModeToggle) {
        darkModeToggle.classList.remove('fa-moon');
        darkModeToggle.classList.add('fa-sun');
      }
    }

    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    
        // Update localStorage based on new mode
        if (document.body.classList.contains('dark-mode')) {
          localStorage.setItem('darkMode', 'enabled');
          darkModeToggle.classList.remove('fa-moon');
          darkModeToggle.classList.add('fa-sun');
        } else {
          localStorage.setItem('darkMode', 'disabled');
          darkModeToggle.classList.remove('fa-sun');
          darkModeToggle.classList.add('fa-moon');
        }
      });
    }
});

window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = `${scrollPercent}%`;
});

window.addEventListener('load', () => {
    document.documentElement.classList.remove('no-transition');
});