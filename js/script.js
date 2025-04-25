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

    // Buzzing for incomplete projects
    const projectCards = getElements('.project-card');
    projectCards.forEach(card => {
      const hasInProgress = card.querySelector('.tag.in-progress');
      if (hasInProgress) {
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
});

window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = `${scrollPercent}%`;
});