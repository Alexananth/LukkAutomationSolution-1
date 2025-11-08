import './style.css';
import { createIcons, icons } from 'lucide';

const routes = {
  '/': 'src/pages/home.html',
  '/about': 'src/pages/about.html',
  '/products': 'src/pages/products.html',
  '/solutions': 'src/pages/solutions.html',
  '/industries': 'src/pages/industries.html',
  '/partners': 'src/pages/partners.html',
  '/careers': 'src/pages/careers.html',
  '/contact': 'src/pages/contact.html',
  404: 'src/pages/home.html' // Fallback to home
};

const app = document.getElementById('app');

const router = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];

  try {
    const [headerHtml, pageHtml, footerHtml] = await Promise.all([
      fetch('src/components/header.html').then(res => res.text()),
      fetch(route).then(res => res.text()),
      fetch('src/components/footer.html').then(res => res.text())
    ]);

    app.innerHTML = headerHtml + pageHtml + footerHtml;

    createIcons({ icons });
    addEventListeners();

  } catch (error) {
    console.error('Error loading page:', error);
    app.innerHTML = `<h1>Error loading page. Please try again.</h1>`;
  }
};

const navigate = (e) => {
  // Find the closest ancestor that is a link
  const link = e.target.closest('a[href]');

  if (link) {
    const href = link.getAttribute('href');
    if (href.startsWith('/')) {
      e.preventDefault();
      window.history.pushState({}, '', href);
      router();
    }
  }
};

const init3dCardEffect = () => {
  const cards = document.querySelectorAll('.card-3d');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { width, height } = rect;
      
      const rotateX = ((y / height) - 0.5) * -25; // Tilt effect
      const rotateY = ((x / width) - 0.5) * 25;  // Tilt effect

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
};

const addEventListeners = () => {
  // Mobile Menu Toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Accordion for Careers page
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const content = item.querySelector('.accordion-content');
      const icon = header.querySelector('i');
      content.classList.toggle('hidden');
      icon.classList.toggle('rotate-180');
    });
  });

  // Horizontal scroll for Industries page
  const scrollContainer = document.querySelector('.no-scrollbar');
  if (scrollContainer) {
    let isDown = false, startX, scrollLeft;
    scrollContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    });
    ['mouseleave', 'mouseup'].forEach(event => scrollContainer.addEventListener(event, () => isDown = false));
    scrollContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeft - walk;
    });
  }

  // Initialize 3D card effects for the current page
  init3dCardEffect();
};

const initCustomCursor = () => {
  if (document.getElementById('cursor-dot')) return;

  const cursorDot = document.createElement('div');
  cursorDot.id = 'cursor-dot';
  document.body.appendChild(cursorDot);

  const cursorFollower = document.createElement('div');
  cursorFollower.id = 'cursor-follower';
  document.body.appendChild(cursorFollower);

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  const speed = 0.1;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (e.target.closest('a, button, .card-3d, .accordion-header')) {
      cursorFollower.classList.add('cursor-grow');
    } else {
      cursorFollower.classList.remove('cursor-grow');
    }
  });

  const animateCursor = () => {
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;

    followerX += (mouseX - followerX) * speed;
    followerY += (mouseY - followerY) * speed;
    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;

    requestAnimationFrame(animateCursor);
  };
  animateCursor();
};

window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', navigate);
  if (window.matchMedia("(min-width: 769px)").matches) {
    initCustomCursor();
  }
  router();
});
