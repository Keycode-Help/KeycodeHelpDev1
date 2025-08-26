/**
 * Z Fold Device Detection and Optimization Utility
 * Handles Samsung Z Fold specific layout and interaction optimizations
 */

export class ZFoldDetector {
  constructor() {
    this.isZFold = false;
    this.isZFoldClosed = false;
    this.isZFoldOpen = false;
    this.screenRatio = 0;
    this.init();
  }

  /**
   * Initialize Z Fold detection
   */
  init() {
    this.detectDevice();
    this.addDeviceClasses();
    this.setupEventListeners();
  }

  /**
   * Detect if device is Z Fold
   */
  detectDevice() {
    const userAgent = navigator.userAgent;
    const screen = window.screen;
    
    // Check for Samsung Z Fold devices
    const isSamsung = /Samsung/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);
    
    // Z Fold specific detection
    const isZFold = isSamsung && isAndroid && (
      /SM-F9\d{3}/i.test(userAgent) || // Z Fold 3, 4, 5
      /SM-F7\d{3}/i.test(userAgent) || // Z Fold 2
      /SM-F9\d{2}/i.test(userAgent)    // Z Fold 1
    );
    
    if (isZFold) {
      this.isZFold = true;
      this.detectFoldState();
    }
  }

  /**
   * Detect if Z Fold is closed or open
   */
  detectFoldState() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.screenRatio = width / height;
    
    // Z Fold closed: very wide, short (around 23:9 ratio)
    if (this.screenRatio > 2.0) {
      this.isZFoldClosed = true;
      this.isZFoldOpen = false;
    }
    // Z Fold open: more square, tablet-like (around 4:3 ratio)
    else if (this.screenRatio < 1.5) {
      this.isZFoldClosed = false;
      this.isZFoldOpen = true;
    }
    // In between states or landscape
    else {
      this.isZFoldClosed = false;
      this.isZFoldOpen = false;
    }
  }

  /**
   * Add device-specific CSS classes
   */
  addDeviceClasses() {
    if (this.isZFold) {
      document.body.classList.add('z-fold-device');
      
      if (this.isZFoldClosed) {
        document.body.classList.add('z-fold-closed');
        document.body.classList.remove('z-fold-open');
      } else if (this.isZFoldOpen) {
        document.body.classList.add('z-fold-open');
        document.body.classList.remove('z-fold-closed');
      }
    }
  }

  /**
   * Setup event listeners for fold state changes
   */
  setupEventListeners() {
    if (!this.isZFold) return;
    
    // Listen for resize events (fold state changes)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.detectFoldState();
        this.addDeviceClasses();
        this.optimizeLayout();
      }, 100);
    });
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.detectFoldState();
        this.addDeviceClasses();
        this.optimizeLayout();
      }, 200);
    });
  }

  /**
   * Optimize layout for current fold state
   */
  optimizeLayout() {
    if (!this.isZFold) return;
    
    if (this.isZFoldClosed) {
      this.optimizeForClosedState();
    } else if (this.isZFoldOpen) {
      this.optimizeForOpenState();
    }
  }

  /**
   * Optimize layout for Z Fold closed state
   */
  optimizeForClosedState() {
    // Ensure mobile navigation is visible
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav) {
      mobileNav.style.display = 'block';
      mobileNav.style.position = 'fixed';
      mobileNav.style.top = '0';
      mobileNav.style.left = '0';
      mobileNav.style.right = '0';
      mobileNav.style.zIndex = '1000';
    }
    
    // Hide desktop navigation
    const desktopNav = document.querySelector('.navbar');
    if (desktopNav) {
      desktopNav.style.display = 'none';
    }
    
    // Ensure footer is visible
    const footer = document.querySelector('.footer');
    if (footer) {
      footer.style.position = 'relative';
      footer.style.bottom = 'auto';
      footer.style.marginTop = '2rem';
      footer.style.padding = '1.5rem 1rem';
      footer.style.background = 'var(--surface)';
      footer.style.borderTop = '1px solid var(--border)';
    }
    
    // Adjust main content spacing
    const main = document.querySelector('main');
    if (main) {
      main.style.paddingBottom = '4rem';
    }
    
    // Optimize buttons for ultra-wide layout
    const buttons = document.querySelectorAll('.hero-buttons, .cta-buttons');
    buttons.forEach(buttonGroup => {
      buttonGroup.style.flexDirection = 'column';
      buttonGroup.style.gap = '0.75rem';
      buttonGroup.style.alignItems = 'center';
      
      const buttons = buttonGroup.querySelectorAll('.btn');
      buttons.forEach(btn => {
        btn.style.width = '100%';
        btn.style.maxWidth = '280px';
      });
    });
  }

  /**
   * Optimize layout for Z Fold open state
   */
  optimizeForOpenState() {
    // Show desktop navigation for tablet mode
    const desktopNav = document.querySelector('.navbar');
    if (desktopNav) {
      desktopNav.style.display = 'block';
    }
    
    // Hide mobile navigation
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav) {
      mobileNav.style.display = 'none';
    }
    
    // Optimize for tablet layout
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.style.padding = '2rem 1.5rem';
      heroSection.style.minHeight = '70vh';
    }
    
    // Enable two-column layouts
    const grids = document.querySelectorAll('.grid-cols-2, .grid-cols-3');
    grids.forEach(grid => {
      if (grid.classList.contains('grid-cols-2')) {
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
      } else if (grid.classList.contains('grid-cols-3')) {
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
      }
    });
  }

  /**
   * Get current device information
   */
  getDeviceInfo() {
    return {
      isZFold: this.isZFold,
      isZFoldClosed: this.isZFoldClosed,
      isZFoldOpen: this.isZFoldOpen,
      screenRatio: this.screenRatio,
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
    };
  }

  /**
   * Check if element should be visible on current fold state
   */
  shouldShowElement(element) {
    if (!this.isZFold) return true;
    
    const elementType = element.dataset.zfoldBehavior;
    
    if (elementType === 'closed-only' && !this.isZFoldClosed) return false;
    if (elementType === 'open-only' && !this.isZFoldOpen) return false;
    if (elementType === 'both' || !elementType) return true;
    
    return true;
  }
}

/**
 * Quick Z Fold detection
 */
export function isZFoldDevice() {
  const userAgent = navigator.userAgent;
  const isSamsung = /Samsung/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  
  return isSamsung && isAndroid && (
    /SM-F9\d{3}/i.test(userAgent) || // Z Fold 3, 4, 5
    /SM-F7\d{3}/i.test(userAgent) || // Z Fold 2
    /SM-F9\d{2}/i.test(userAgent)    // Z Fold 1
  );
}

/**
 * Get Z Fold state
 */
export function getZFoldState() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = width / height;
  
  if (ratio > 2.0) return 'closed';
  if (ratio < 1.5) return 'open';
  return 'intermediate';
}

/**
 * Initialize Z Fold optimizations
 */
export function initZFoldOptimizations() {
  const detector = new ZFoldDetector();
  
  // Log device info in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Z Fold Detection:', detector.getDeviceInfo());
  }
  
  return detector;
}

/**
 * Add Z Fold specific CSS variables
 */
export function addZFoldCSSVariables() {
  if (typeof document === 'undefined') return;
  
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --z-fold-closed-ratio: 2.0;
      --z-fold-open-ratio: 1.5;
      --z-fold-transition-duration: 0.3s;
    }
    
    .z-fold-device {
      --mobile-nav-height: 56px;
      --mobile-nav-padding: 0.75rem;
      --footer-margin-top: 2rem;
      --content-padding-bottom: 4rem;
    }
    
    .z-fold-closed {
      --hero-title-size: 1.75rem;
      --hero-subtitle-size: 1rem;
      --button-width: 100%;
      --button-max-width: 280px;
      --container-padding: 0.75rem;
    }
    
    .z-fold-open {
      --hero-title-size: 2.25rem;
      --hero-subtitle-size: 1.125rem;
      --button-width: auto;
      --button-max-width: none;
      --container-padding: 1.5rem;
    }
  `;
  
  document.head.appendChild(style);
}

export default ZFoldDetector;
