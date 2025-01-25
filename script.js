// Contact form submission
import { WEB3FORMS_ACCESS_KEY } from './config.js';

document.addEventListener('DOMContentLoaded', function() {
  // Theme switching functionality
  const themeButtons = document.querySelectorAll('.theme-button');
  
  // Replace the existing setActiveTheme function with this updated version
  const setActiveTheme = (theme) => {
    const body = document.body;
    body.classList.add('theme-transition');
    body.classList.add('theme-transition-fade');
    
    setTimeout(() => {
      body.className = theme === 'light' ? '' : `${theme}-theme`;
      body.classList.add('theme-transition');
      themeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
        btn.setAttribute('aria-pressed', btn.dataset.theme === theme);
      });
      // Re-run feather.replace() to update icons with new colors
      feather.replace();
      // Save the active theme to localStorage
      localStorage.setItem('activeTheme', theme);
      
      setTimeout(() => {
        body.classList.remove('theme-transition-fade');
        setTimeout(() => {
          body.classList.remove('theme-transition');
        }, 2000);
      }, 10);
    }, 300);
  };

  // Add this new function to handle theme button clicks
  const handleThemeButtonClick = (event) => {
    const theme = event.currentTarget.dataset.theme;
    setActiveTheme(theme);
  };

  // Update the theme button event listeners
  themeButtons.forEach(button => {
    button.removeEventListener('click', handleThemeButtonClick);
    button.addEventListener('click', handleThemeButtonClick);
  });

  // Set initial theme from localStorage or default to 'light'
  const savedTheme = localStorage.getItem('activeTheme') || 'light';
  setActiveTheme(savedTheme);

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Smooth scrolling for logo
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Mobile menu toggle with transition
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('nav ul');

  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('show');
      
      // Update aria-expanded attribute
      const isExpanded = navList.classList.contains('show');
      menuToggle.setAttribute('aria-expanded', isExpanded.toString());
    });
  }

  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (response.status === 200) {
        alert('Thank you for your message! I\'ll get back to you soon.');
        contactForm.reset();
      } else {
        alert('Oops! Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Oops! Something went wrong. Please try again later.');
    }
  });

  // Load Feather icons
  feather.replace();

  // Position timeline entries
  const positionTimelineEntries = () => {
    const timelineEntries = document.querySelectorAll('.timeline-entry');
    const timelineEntriesContainer = document.querySelector('.timeline-entries');
    const timelineLine = document.querySelector('.timeline-line');
    const experienceSection = document.querySelector('.experience');
    
    // Find the earliest and latest dates
    let earliestDate = new Date('9999-12-31');
    let latestDate = new Date('0000-01-01');
    
    timelineEntries.forEach(entry => {
      const startDate = new Date(entry.dataset.start);
      const endDate = new Date(entry.dataset.end);
      
      if (startDate < earliestDate) earliestDate = startDate;
      if (endDate > latestDate) latestDate = endDate;
    });
    
    // Add padding to the start and end dates (2 months before and after)
    earliestDate = new Date(earliestDate.getFullYear(), earliestDate.getMonth() - 2, 1);
    latestDate = new Date(latestDate.getFullYear(), latestDate.getMonth() + 2, 0); // End of the month, 2 months after

    const timelineDuration = latestDate.getTime() - earliestDate.getTime();

    if (window.innerWidth > 768) {
      let rows = []; // Array to keep track of the end of each row
      let maxRowHeight = 0; // Track the maximum height of any entry

      timelineEntries.forEach((entry, index) => {
        const startDate = new Date(entry.dataset.start);
        const endDate = new Date(entry.dataset.end);
        
        const startPosition = ((startDate.getTime() - earliestDate.getTime()) / timelineDuration) * 100;
        const endPosition = ((endDate.getTime() - earliestDate.getTime()) / timelineDuration) * 100;
        const width = endPosition - startPosition;

        entry.style.left = `${startPosition}%`;
        entry.style.width = `${width}%`;

        // Find the appropriate row for this entry
        let rowIndex = rows.findIndex(row => row <= startPosition);
        if (rowIndex === -1) {
          // If no suitable row found, create a new one
          rowIndex = rows.length;
          rows.push(0);
        }

        // Set the top position based on the row
        const topPosition = rowIndex * (maxRowHeight + 20);
        entry.style.top = `${topPosition}px`;

        // Update the end position of this row
        rows[rowIndex] = endPosition;

        // Update maxRowHeight if this entry is taller
        const entryHeight = entry.offsetHeight;
        if (entryHeight > maxRowHeight) {
          maxRowHeight = entryHeight;
          // Adjust all previous entries to the new row height
          timelineEntries.forEach((prevEntry, prevIndex) => {
            if (prevIndex < index) {
              const prevRowIndex = Math.floor(parseInt(prevEntry.style.top) / (maxRowHeight + 20));
              prevEntry.style.top = `${prevRowIndex * (maxRowHeight + 20)}px`;
            }
          });
        }
      });

      const totalHeight = rows.length * (maxRowHeight + 20) - 20; // Subtract the last margin
      timelineEntriesContainer.style.height = `${totalHeight}px`;
      experienceSection.style.minHeight = `${totalHeight + 150}px`; // Add extra space for padding and headers
    } else {
      timelineEntries.forEach(entry => {
        entry.style.left = '';
        entry.style.width = '';
        entry.style.top = '';
      });
      timelineEntriesContainer.style.height = '';
      experienceSection.style.minHeight = '';
    }

    // Update timeline dates
    timelineLine.innerHTML = '';
    const years = new Set();
    for (let year = earliestDate.getFullYear(); year <= latestDate.getFullYear(); year++) {
      years.add(year);
    }

    years.forEach(year => {
      const dateElement = document.createElement('div');
      dateElement.classList.add('timeline-date');
      dateElement.textContent = year;
      const position = ((new Date(year, 0, 1).getTime() - earliestDate.getTime()) / timelineDuration) * 100;
      dateElement.style.left = `${position}%`;
      timelineLine.appendChild(dateElement);
    });

    // Adjust the position of the first and last date labels
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

  // Scroll-triggered animations with sequence
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-top, .slide-in-bottom, .scale-in');
  
  const animateElement = (element, delay) => {
    setTimeout(() => {
      element.classList.add('appear');
    }, delay);
  };

  const animateSequence = (entries, observer) => {
    let delay = 0;
    const delayIncrement = 200; // Adjust this value to change the delay between animations

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.closest('.contact-form')) {
          // For contact form inputs, animate them in sequence
          const formGroups = entry.target.closest('.contact-form').querySelectorAll('.form-group');
          formGroups.forEach((group, index) => {
            animateElement(group, index * delayIncrement);
          });
        } else {
          animateElement(entry.target, delay);
          delay += delayIncrement;
        }
        observer.unobserve(entry.target);
      }
    });
  };

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(animateSequence, options);

  animatedElements.forEach(element => {
    observer.observe(element);
  });

  // Observe the contact form separately
  contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    observer.observe(contactForm);
  }
});

