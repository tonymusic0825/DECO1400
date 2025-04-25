document.addEventListener('DOMContentLoaded', () => {
    const getElement = (selector) => document.querySelector(selector);
  
    const links = getElement('.nav-links');
    const navBtn = getElement('.hambgr-btn');
  
    if (links && navBtn) {
      navBtn.addEventListener('click', () => {
        links.classList.toggle('show-links');
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