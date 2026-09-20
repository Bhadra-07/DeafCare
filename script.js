document.addEventListener('DOMContentLoaded', () => {
  // Initialize accessibility settings and components
  initThemeToggle();
  initFontSizeAdjuster();
  initMobileNav();
  initLiveCaptioning();
  initDictionaryFilter();
  initEmergencyModal();
  initBookingModal();
  initBackToTop();
});

function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const contrastBtn = document.getElementById('contrast-toggle-btn');
  
  // Load saved preferences
  const savedTheme = localStorage.getItem('deafcare_theme') || 'light';
  const savedContrast = localStorage.getItem('deafcare_contrast') === 'true';

  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  if (savedContrast) {
    document.documentElement.setAttribute('data-contrast', 'high');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('deafcare_theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  if (contrastBtn) {
    contrastBtn.addEventListener('click', () => {
      const isHigh = document.documentElement.getAttribute('data-contrast') === 'high';
      if (isHigh) {
        document.documentElement.removeAttribute('data-contrast');
        localStorage.setItem('deafcare_contrast', 'false');
        showToast('Standard contrast enabled');
      } else {
        document.documentElement.setAttribute('data-contrast', 'high');
        localStorage.setItem('deafcare_contrast', 'true');
        showToast('High contrast mode enabled');
      }
    });
  }
}

function initFontSizeAdjuster() {
  let fontScale = parseFloat(localStorage.getItem('deafcare_font_scale')) || 1.0;
  
  const applyScale = (scale) => {
    fontScale = Math.min(Math.max(scale, 0.85), 1.4);
    document.documentElement.style.setProperty('--font-scale', fontScale);
    localStorage.setItem('deafcare_font_scale', fontScale);
  };

  applyScale(fontScale);

  const increaseBtn = document.getElementById('font-increase-btn');
  const decreaseBtn = document.getElementById('font-decrease-btn');
  const resetBtn = document.getElementById('font-reset-btn');

  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
      applyScale(fontScale + 0.1);
      showToast('Font size increased');
    });
  }

  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      applyScale(fontScale - 0.1);
      showToast('Font size decreased');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      applyScale(1.0);
      showToast('Font size reset');
    });
  }
}

function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

function initLiveCaptioning() {
  const micBtn = document.getElementById('start-caption-btn');
  const captionBox = document.getElementById('caption-output');
  const statusIndicator = document.getElementById('caption-status-text');

  if (!micBtn || !captionBox) return;

  let recognition = null;
  let isListening = false;
  let simulatedTimer = null;

  // Check Web Speech API availability
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      captionBox.textContent = transcript;
    };

    recognition.onerror = (e) => {
      if (statusIndicator) statusIndicator.textContent = 'Speech recognition error occurred.';
      stopListening();
    };

    recognition.onend = () => {
      if (isListening) recognition.start();
    };
  }

  const startListening = () => {
    isListening = true;
    micBtn.classList.add('listening');
    micBtn.innerHTML = '<span>Stop Listening</span>';
    if (statusIndicator) statusIndicator.textContent = 'Live Listening...';

    if (recognition) {
      try {
        recognition.start();
      } catch (err) {
        // Recognition already started or error
      }
    } else {
      // Fallback simulated captioning
      const phrases = [
        "Welcome to DeafCare interactive platform.",
        " Real-time visual transcript is active.",
        " Connecting doctors with instant sign interpreters.",
        " Clear communication for everyone."
      ];
      let index = 0;
      captionBox.textContent = "";
      simulatedTimer = setInterval(() => {
        captionBox.textContent += phrases[index % phrases.length];
        index++;
      }, 2000);
    }
  };

  const stopListening = () => {
    isListening = false;
    micBtn.classList.remove('listening');
    micBtn.innerHTML = '<span>Start Live Captions</span>';
    if (statusIndicator) statusIndicator.textContent = 'Microphone Idle';

    if (recognition) {
      try { recognition.stop(); } catch (e) {}
    }
    if (simulatedTimer) {
      clearInterval(simulatedTimer);
      simulatedTimer = null;
    }
  };

  micBtn.addEventListener('click', () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  });
}

function initDictionaryFilter() {
  const searchInput = document.getElementById('dict-search-input');
  const tagBtns = document.querySelectorAll('.category-tags .tag-btn');
  const cards = document.querySelectorAll('.dictionary-grid .dict-card');

  if (!cards.length) return;

  let activeCategory = 'all';
  let searchQuery = '';

  const filterCards = () => {
    cards.forEach(card => {
      const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
      const category = card.getAttribute('data-category') || 'all';

      const matchesSearch = title.includes(searchQuery);
      const matchesCategory = activeCategory === 'all' || category === activeCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterCards();
    });
  }

  tagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tagBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category') || 'all';
      filterCards();
    });
  });
}

function initEmergencyModal() {
  const emergencyBtns = document.querySelectorAll('.trigger-emergency-modal');
  const modal = document.getElementById('emergency-modal');
  const closeBtn = document.getElementById('close-emergency-modal');
  const cancelBtn = document.getElementById('cancel-alert-btn');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    
    // Trigger device vibration if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([300, 100, 300, 100, 500]);
    }
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  emergencyBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', () => {
    closeModal();
    showToast('Emergency SOS cancelled');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function initBookingModal() {
  const bookBtns = document.querySelectorAll('.trigger-booking-modal');
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.getElementById('close-booking-modal');
  const bookingForm = document.getElementById('interpreter-booking-form');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  bookBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      showToast('Interpreter request submitted successfully!');
      bookingForm.reset();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');

  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>ℹ️</span> <span>${message}</span>`;
  
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-100%)';
    toast.style.transition = 'all 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}