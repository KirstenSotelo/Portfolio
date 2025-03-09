import { WEB3FORMS_ACCESS_KEY } from './config.js';

document.addEventListener('DOMContentLoaded', function () {
  // Theme switching functionality
  const themeButtons = document.querySelectorAll('.theme-button');
  const body = document.body;

  const setActiveTheme = (theme) => {
    body.classList.add('theme-transition', 'theme-transition-fade');

    setTimeout(() => {
      body.className = theme === 'light' ? '' : `${theme}-theme`;
      body.classList.add('theme-transition');

      themeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
        btn.setAttribute('aria-pressed', btn.dataset.theme === theme);
      });

      feather.replace();
      localStorage.setItem('activeTheme', theme);

      setTimeout(() => {
        body.classList.remove('theme-transition-fade');
        setTimeout(() => {
          body.classList.remove('theme-transition');
        }, 2000);
      }, 10);
    }, 300);
  };

  themeButtons.forEach(button => {
    button.addEventListener('click', function () {
      setActiveTheme(this.dataset.theme);
    });
  });

  setActiveTheme(localStorage.getItem('activeTheme') || 'light');

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Smooth scrolling for logo
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('nav ul');

  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', navList.classList.contains('show'));
    });
  }

  // Contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        if (response.ok) {
          alert("Thank you for your message! I'll get back to you soon.");
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Form submission failed.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Oops! Something went wrong. Please try again later.');
      }
    });
  }

  // Load Feather icons
  feather.replace();

  // Position timeline entries
  const positionTimelineEntries = () => {
    const timelineEntries = document.querySelectorAll('.timeline-entry');
    const timelineLine = document.querySelector('.timeline-line');
    const timelineEntriesContainer = document.querySelector('.timeline-entries');
    const experienceSection = document.querySelector('.experience');

    if (!timelineEntries.length || !timelineLine) return;

    let earliestDate = new Date('9999-12-31');
    let latestDate = new Date('0000-01-01');

    timelineEntries.forEach(entry => {
      const startDate = new Date(entry.dataset.start);
      const endDate = new Date(entry.dataset.end);

      if (startDate < earliestDate) earliestDate = startDate;
      if (endDate > latestDate) latestDate = endDate;
    });

    earliestDate = new Date(earliestDate.getFullYear(), earliestDate.getMonth() - 2, 1);
    latestDate = new Date(latestDate.getFullYear(), latestDate.getMonth() + 2, 0);

    const timelineDuration = latestDate - earliestDate;

    if (window.innerWidth > 768) {
      let rows = [];
      let maxRowHeight = 0;

      timelineEntries.forEach((entry, index) => {
        const startDate = new Date(entry.dataset.start);
        const endDate = new Date(entry.dataset.end);

        const startPosition = ((startDate - earliestDate) / timelineDuration) * 100;
        const endPosition = ((endDate - earliestDate) / timelineDuration) * 100;
        const width = endPosition - startPosition;

        entry.style.left = `${startPosition}%`;
        entry.style.width = `${width}%`;

        let rowIndex = rows.findIndex(row => row <= startPosition);
        if (rowIndex === -1) {
          rowIndex = rows.length;
          rows.push(0);
        }

        const topPosition = rowIndex * (maxRowHeight + 20);
        entry.style.top = `${topPosition}px`;
        rows[rowIndex] = endPosition;

        const entryHeight = entry.offsetHeight;
        if (entryHeight > maxRowHeight) {
          maxRowHeight = entryHeight;
          timelineEntries.forEach((prevEntry, prevIndex) => {
            if (prevIndex < index) {
              const prevRowIndex = Math.floor(parseInt(prevEntry.style.top) / (maxRowHeight + 20));
              prevEntry.style.top = `${prevRowIndex * (maxRowHeight + 20)}px`;
            }
          });
        }
      });

      const totalHeight = rows.length * (maxRowHeight + 20) - 20;
      timelineEntriesContainer.style.height = `${totalHeight}px`;
      experienceSection.style.minHeight = `${totalHeight + 150}px`;
    } else {
      timelineEntries.forEach(entry => {
        entry.style.left = '';
        entry.style.width = '';
        entry.style.top = '';
      });
      timelineEntriesContainer.style.height = '';
      experienceSection.style.minHeight = '';
    }

    timelineLine.innerHTML = '';
    for (let year = earliestDate.getFullYear(); year <= latestDate.getFullYear(); year++) {
      const dateElement = document.createElement('div');
      dateElement.classList.add('timeline-date');
      dateElement.textContent = year;
      dateElement.style.left = `${((new Date(year, 0, 1) - earliestDate) / timelineDuration) * 100}%`;
      timelineLine.appendChild(dateElement);
    }

    const dateLabels = timelineLine.querySelectorAll('.timeline-date');
    if (dateLabels.length > 0) {
      dateLabels[0].style.left = '0%';
      dateLabels[dateLabels.length - 1].style.left = '100%';
      dateLabels[dateLabels.length - 1].style.transform = 'translateX(-100%)';
    }
  };

  window.addEventListener('resize', positionTimelineEntries);
  window.addEventListener('load', positionTimelineEntries);
  positionTimelineEntries();

  // Scroll-triggered animations
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-top, .slide-in-bottom, .scale-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(element => observer.observe(element));

  if (contactForm) observer.observe(contactForm);
});

document.addEventListener("DOMContentLoaded", function () {
  const timelineEntries = document.querySelectorAll(".timeline-entry");

  let lastBottom = 0; // Track the last entry's bottom position

  timelineEntries.forEach((entry, index) => {
      const startDate = entry.getAttribute("data-start");
      const endDate = entry.getAttribute("data-end");

      if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const durationMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

          // Define base height and scaling factor
          const baseHeight = 100; // Minimum height in pixels
          const scaleFactor = 5; // Adjust scaling factor for proper spacing
          const calculatedHeight = baseHeight + durationMonths * scaleFactor;

          // Set the height of the entry
          entry.style.height = `${calculatedHeight}px`;

          // Ensure proper spacing between entries
          const margin = 40; // Space between entries
          const entryTop = lastBottom + margin; 
          entry.style.position = "relative";
          entry.style.top = `${entryTop}px`;

          // Update last bottom position
          lastBottom = entryTop + calculatedHeight;
      }
  });
});
