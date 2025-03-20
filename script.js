// Import the Web3Forms access key from config.js
import { WEB3FORMS_ACCESS_KEY } from './config.js';

// Initialize Feather icons
feather.replace();

// Theme switching functionality
document.addEventListener('DOMContentLoaded', () => {
  // Set default theme (dark)
  document.body.classList.add('dark-theme');
  document.querySelector('[data-theme="dark"]').setAttribute('aria-pressed', 'true');
  
  // Theme switcher
  const themeButtons = document.querySelectorAll('.theme-button');
  themeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const theme = button.getAttribute('data-theme');
      
      // Remove all theme classes
      document.body.classList.remove('light-theme', 'dark-theme', 'colorful-theme');
      
      // Add selected theme class
      document.body.classList.add(`${theme}-theme`);
      
      // Update aria-pressed state
      themeButtons.forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
      });
      button.setAttribute('aria-pressed', 'true');
      
      // Add special animation when changing themes
      document.querySelectorAll('section').forEach(section => {
        section.classList.add('theme-transition');
        setTimeout(() => {
          section.classList.remove('theme-transition');
        }, 1000);
      });
    });
  });
  
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active'); // Add this line to animate the hamburger icon
    
    // Add animation to each menu item with staggered delay
    const menuItems = navMenu.querySelectorAll('li');
    if (navMenu.classList.contains('active')) {
      menuItems.forEach((item, index) => {
        // Reset the animation by removing and adding the class
        item.style.transitionDelay = `${0.05 * (index + 1)}s`;
      });
    } else {
      menuItems.forEach(item => {
        item.style.transitionDelay = '0s';
      });
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
    }
  });

  // Close menu when a link is clicked
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close mobile menu if open
      navMenu.classList.remove('active');
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Account for fixed header
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Intersection Observer for animations
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-top');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
  // Typing effect for hero section
  const heroText = document.querySelector('.hero h1');
  if (heroText) {
    const text = heroText.textContent;
    heroText.innerHTML = '';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroText.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
  }
  
  // Matrix code rain effect (tech theme)
  const addMatrixEffect = () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const matrixBg = document.createElement('div');
      matrixBg.classList.add('matrix-bg');
      section.appendChild(matrixBg);
    });
  };
  
  // Circuit board pattern effect (tech theme)
  const addCircuitPattern = () => {
    const sections = document.querySelectorAll('section:nth-child(even)');
    sections.forEach(section => {
      const circuitPattern = document.createElement('div');
      circuitPattern.classList.add('circuit-pattern');
      section.appendChild(circuitPattern);
    });
  };
  
  // Add tech-themed backgrounds
  addMatrixEffect();
  addCircuitPattern();
  
  // Form submission handling with Web3Forms
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      
      // Add the access key to the form data
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      
      // Update UI to show loading state
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
      
      try {
        // Send the form data to Web3Forms
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Create success message
          const formGroups = this.querySelectorAll('.form-group');
          const lastFormGroup = formGroups[formGroups.length - 1];
          
          const successMessage = document.createElement('div');
          successMessage.classList.add('success-message');
          successMessage.innerHTML = `
            <div style="color: var(--success); background: rgba(6, 214, 160, 0.1); padding: var(--space-md); border-radius: var(--border-radius-md); margin-top: var(--space-md);">
              <p style="margin: 0;"><i data-feather="check-circle"></i> Message sent successfully! I'll get back to you soon.</p>
            </div>
          `;
          
          lastFormGroup.after(successMessage);
          feather.replace();
          
          // Reset form
          contactForm.reset();
        } else {
          // Handle error
          throw new Error(data.message || 'Something went wrong!');
        }
      } catch (error) {
        // Show error message
        const formGroups = this.querySelectorAll('.form-group');
        const lastFormGroup = formGroups[formGroups.length - 1];
        
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        errorMessage.innerHTML = `
          <div style="color: var(--danger); background: rgba(239, 71, 111, 0.1); padding: var(--space-md); border-radius: var(--border-radius-md); margin-top: var(--space-md);">
            <p style="margin: 0;"><i data-feather="alert-circle"></i> ${error.message || 'Failed to send message. Please try again.'}</p>
          </div>
        `;
        
        lastFormGroup.after(errorMessage);
        feather.replace();
        
        console.error('Form submission error:', error);
      } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Remove messages after 5 seconds
        setTimeout(() => {
          document.querySelectorAll('.success-message, .error-message').forEach(el => el.remove());
        }, 5000);
      }
    });
  }
  
  // Add tech-themed code effect to skills section
  const addCodeEffect = () => {
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      const codeEffect = document.createElement('div');
      codeEffect.classList.add('code-effect');
      codeEffect.textContent = 'console.log("Hello, welcome to my portfolio!");';
      
      const container = skillsSection.querySelector('.container');
      container.insertBefore(codeEffect, container.querySelector('h4'));
    }
  };
  
  addCodeEffect();
  
  // Set up left-aligned vertical timeline for experience section
  const setupTimeline = () => {
    const experienceSection = document.getElementById('experience');
    if (!experienceSection) return;
    
    // Get all timeline content elements
    const timelineContents = experienceSection.querySelectorAll('.timeline-content');
    if (timelineContents.length === 0) return;
    
    // Create the timeline structure
    const timeline = document.createElement('div');
    timeline.classList.add('timeline');
    
    const timelineEntries = document.createElement('div');
    timelineEntries.classList.add('timeline-entries');
    
    // Group entries by year to add year markers
    const years = new Set();
    timelineContents.forEach(content => {
      const dateText = content.querySelector('.entry-date').textContent;
      const year = dateText.match(/\d{4}/); // Extract year from date text
      if (year) {
        years.add(year[0]);
      }
    });
    
    // Sort years in descending order
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    
    // Create a map to track which entries belong to which year
    const yearEntries = {};
    sortedYears.forEach(year => {
      yearEntries[year] = [];
    });
    
    // Assign entries to years
    timelineContents.forEach(content => {
      const dateText = content.querySelector('.entry-date').textContent;
      const year = dateText.match(/\d{4}/);
      if (year && yearEntries[year[0]]) {
        // Create a new timeline entry
        const entry = document.createElement('div');
        entry.classList.add('timeline-entry', 'fade-in');
        
        // Clone the content
        const clonedContent = content.cloneNode(true);
        entry.appendChild(clonedContent);
        
        // Add to the appropriate year group
        yearEntries[year[0]].push(entry);
        
        // Hide the original content
        content.style.display = 'none';
      }
    });
    
    // Add year markers and entries to the timeline
    sortedYears.forEach((year, yearIndex) => {
      // Add year marker
      const yearMarker = document.createElement('div');
      yearMarker.classList.add('timeline-year', 'fade-in');
      yearMarker.textContent = year;
      timelineEntries.appendChild(yearMarker);
      
      // Add entries for this year
      yearEntries[year].forEach((entry, entryIndex) => {
        // Set animation delay index for staggered animations
        entry.style.setProperty('--index', yearIndex + entryIndex);
        timelineEntries.appendChild(entry);
      });
    });
    
    timeline.appendChild(timelineEntries);
    
    // Insert the timeline after the heading and subheading
    const container = experienceSection.querySelector('.container');
    const heading = container.querySelector('h2');
    const subheading = container.querySelector('h4');
    
    // Insert the timeline after the heading and subheading
    if (subheading) {
      subheading.insertAdjacentElement('afterend', timeline);
    } else if (heading) {
      heading.insertAdjacentElement('afterend', timeline);
    } else {
      container.appendChild(timeline);
    }
    
    // Set up intersection observer for timeline entries
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all timeline entries and year markers
    document.querySelectorAll('.timeline-entry, .timeline-year').forEach(element => {
      observer.observe(element);
    });
    
    // Add interactive effects to timeline entries
    document.querySelectorAll('.timeline-entry').forEach(entry => {
      entry.addEventListener('mouseenter', () => {
        // Add a tech-themed glow effect
        entry.style.zIndex = '10';
      });
      
      entry.addEventListener('mouseleave', () => {
        // Reset z-index
        entry.style.zIndex = '1';
      });
    });
  };
  
  // Call the timeline setup function
  setupTimeline();
  
  // Add hover effects to various elements
  const addHoverEffects = () => {
    // Add floating effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
      // Stagger the animation for each card
      card.style.animationDelay = `${index * 0.2}s`;
      card.classList.add('tech-float');
      
      // Add interactive hover effect for project images
      const img = card.querySelector('img');
      if (img) {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left; // x position within the element
          const y = e.clientY - rect.top;  // y position within the element
          
          // Calculate rotation based on mouse position
          const rotateX = (y / rect.height - 0.5) * 10; // -5 to 5 degrees
          const rotateY = (x / rect.width - 0.5) * -10; // -5 to 5 degrees
          
          img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
          img.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
      }
    });
    
    // Add pulse effect to skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
      if (index % 3 === 0) { // Apply to every third card for variety
        card.classList.add('tech-pulse');
      }
    });
    
    // Add interactive effect to timeline content
    const timelineContents = document.querySelectorAll('.timeline-content');
    timelineContents.forEach(content => {
      content.addEventListener('mouseenter', () => {
        content.style.transform = 'translateX(8px)';
        content.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        content.style.borderLeftColor = 'var(--accent)';
      });
      
      content.addEventListener('mouseleave', () => {
        content.style.transform = '';
        content.style.boxShadow = '';
        content.style.borderLeftColor = '';
      });
    });
    
    // Add interactive effect to section headings
    const sectionHeadings = document.querySelectorAll('section h2');
    sectionHeadings.forEach(heading => {
      heading.addEventListener('mouseenter', () => {
        heading.classList.add('text-gradient');
      });
      
      heading.addEventListener('mouseleave', () => {
        setTimeout(() => {
          heading.classList.remove('text-gradient');
        }, 500);
      });
    });
    
    // Add tech-themed cursor effect
    document.addEventListener('mousemove', (e) => {
      const cursor = document.querySelector('.tech-cursor') || (() => {
        const el = document.createElement('div');
        el.classList.add('tech-cursor');
        document.body.appendChild(el);
        return el;
      })();
      
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
  };
  
  // Add the new hover effects
  addHoverEffects();
  
  // Add tech-themed cursor styles
  const addTechCursorStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .tech-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: transparent;
        border: 2px solid var(--primary);
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
        opacity: 0.6;
        transition: width 0.3s, height 0.3s, opacity 0.3s;
      }
      
      a:hover ~ .tech-cursor,
      button:hover ~ .tech-cursor {
        width: 40px;
        height: 40px;
        opacity: 0.8;
        border-color: var(--accent);
      }
      
      /* Timeline hover effect */
      .timeline-entry:hover ~ .tech-cursor {
        width: 30px;
        height: 30px;
        opacity: 0.7;
        border-color: var(--accent);
        mix-blend-mode: difference;
      }
    `;
    document.head.appendChild(style);
  };
  
  addTechCursorStyles();
  
  // Add tech-themed particles effect
  const addParticlesEffect = () => {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    const canvas = document.createElement('canvas');
    canvas.classList.add('particles-canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    
    heroSection.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = Math.random() > 0.5 ? 'rgba(0, 180, 216, 0.5)' : 'rgba(255, 184, 28, 0.5)';
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particles
    const particles = [];
    const particleCount = Math.min(100, Math.floor(canvas.width * canvas.height / 10000));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Connect particles with lines
    const connectParticles = () => {
      const maxDistance = 100;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.strokeStyle = `rgba(0, 180, 216, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      connectParticles();
      requestAnimationFrame(animate);
    };
    
    animate();
  };
  
  // Add particles effect to hero section
  addParticlesEffect();
  
  // Add digital clock to the header
  const addDigitalClock = () => {
    const header = document.querySelector('header');
    if (!header) return;
    
    const clockContainer = document.createElement('div');
    clockContainer.classList.add('digital-clock');
    clockContainer.style.marginLeft = 'auto';
    clockContainer.style.marginRight = '20px';
    clockContainer.style.fontFamily = 'var(--font-code)';
    clockContainer.style.color = 'var(--primary)';
    clockContainer.style.fontSize = '0.9rem';
    
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      
      clockContainer.textContent = `${hours}:${minutes}:${seconds}`;
    };
    
    updateClock();
    setInterval(updateClock, 1000);
    
    // Insert before the theme buttons
    const themeButtons = header.querySelector('.theme-buttons');
    if (themeButtons) {
      header.querySelector('.container').insertBefore(clockContainer, themeButtons);
    }
  };
  
  // Add digital clock
  addDigitalClock();
  
  // Add typing animation to code blocks
  const addTypingAnimationToCode = () => {
    const codeEffects = document.querySelectorAll('.code-effect');
    
    codeEffects.forEach(codeEffect => {
      const originalText = codeEffect.textContent;
      codeEffect.textContent = '';
      
      let i = 0;
      const typeCode = () => {
        if (i < originalText.length) {
          codeEffect.textContent += originalText.charAt(i);
          i++;
          setTimeout(typeCode, Math.random() * 50 + 30); // Random typing speed for realistic effect
        }
      };
      
      // Start typing when the element is in view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(typeCode, 500);
            observer.unobserve(codeEffect);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(codeEffect);
    });
  };
  
  // Add typing animation to code blocks
  addTypingAnimationToCode();
  
  // Add tech-themed scrollbar
  const addTechScrollbar = () => {
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }
      
      ::-webkit-scrollbar-track {
        background: var(--bg-secondary);
      }
      
      ::-webkit-scrollbar-thumb {
        background: var(--primary);
        border-radius: 6px;
        border: 3px solid var(--bg-secondary);
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: var(--accent);
      }
    `;
    document.head.appendChild(style);
  };
  
  // Add tech-themed scrollbar
  addTechScrollbar();
  
  // Add mouse-following pop-out effect to skill cards
  const addSkillCardMouseEffect = () => {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        // Get position of mouse relative to the card
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element
        
        // Calculate rotation based on mouse position
        // Reduce the effect strength by dividing by larger numbers for subtler movement
        const rotateY = ((x / rect.width) - 0.5) * 10; // -5 to 5 degrees
        const rotateX = (((y / rect.height) - 0.5) * -10); // -5 to 5 degrees
        
        // Apply the transform
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        
        // Add a subtle shadow effect that follows the tilt
        const shadowX = rotateY * 0.5;
        const shadowY = rotateX * -0.5;
        card.style.boxShadow = `${shadowX}px ${shadowY}px 20px rgba(0, 0, 0, 0.2)`;
        
        // Optional: Add a subtle glow effect on hover
        card.style.border = '1px solid var(--primary)';
      });
      
      // Reset the card when mouse leaves
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        card.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
        card.style.border = '1px solid var(--border-color)';
      });
      
      // Add a transition for smoother effect
      card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease, border 0.3s ease';
    });
  };
  
  // Call the new skill card mouse effect function
  addSkillCardMouseEffect();
});