/**
 * Mobile Responsiveness Test Utility
 * This utility helps identify and fix mobile responsiveness issues
 */

export class MobileResponsivenessTest {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.suggestions = [];
  }

  /**
   * Run comprehensive mobile responsiveness tests
   */
  runTests() {
    this.testViewport();
    this.testTouchTargets();
    this.testTypography();
    this.testSpacing();
    this.testImages();
    this.testForms();
    this.testNavigation();
    this.testPerformance();

    return {
      issues: this.issues,
      warnings: this.warnings,
      suggestions: this.suggestions,
      score: this.calculateScore(),
    };
  }

  /**
   * Test viewport configuration
   */
  testViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');

    if (!viewport) {
      this.issues.push("Missing viewport meta tag");
    } else {
      const content = viewport.getAttribute("content");
      if (!content.includes("width=device-width")) {
        this.issues.push("Viewport meta tag missing width=device-width");
      }
      if (!content.includes("initial-scale=1.0")) {
        this.issues.push("Viewport meta tag missing initial-scale=1.0");
      }
    }
  }

  /**
   * Test touch target sizes
   */
  testTouchTargets() {
    const buttons = document.querySelectorAll('button, .btn, a[role="button"]');
    const minSize = 44; // Minimum touch target size in pixels

    buttons.forEach((button, index) => {
      const rect = button.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width < minSize || height < minSize) {
        this.warnings.push(
          `Button ${
            index + 1
          } is too small for touch: ${width}x${height}px (min: ${minSize}x${minSize}px)`
        );
      }
    });
  }

  /**
   * Test typography scaling
   */
  testTypography() {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const paragraphs = document.querySelectorAll("p");

    // Check for very small text on mobile
    const computedStyles = window.getComputedStyle(document.body);
    const fontSize = parseFloat(computedStyles.fontSize);

    if (fontSize < 14) {
      this.warnings.push("Base font size is too small for mobile readability");
    }

    // Check heading hierarchy
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        this.warnings.push(
          `Heading hierarchy skip: h${previousLevel} to h${level}`
        );
      }
      previousLevel = level;
    });
  }

  /**
   * Test spacing and layout
   */
  testSpacing() {
    const containers = document.querySelectorAll(
      ".container, .section, main, article"
    );

    containers.forEach((container, index) => {
      const rect = container.getBoundingClientRect();
      const padding =
        parseFloat(window.getComputedStyle(container).paddingLeft) +
        parseFloat(window.getComputedStyle(container).paddingRight);

      if (padding < 16) {
        this.suggestions.push(
          `Container ${index + 1} could use more horizontal padding for mobile`
        );
      }
    });
  }

  /**
   * Test image responsiveness
   */
  testImages() {
    const images = document.querySelectorAll("img");

    images.forEach((img, index) => {
      const src = img.src;
      const alt = img.alt;

      if (!alt) {
        this.warnings.push(
          `Image ${index + 1} missing alt text for accessibility`
        );
      }

      if (!img.classList.contains("responsive-img") && !img.style.maxWidth) {
        this.suggestions.push(
          `Image ${index + 1} could benefit from responsive image classes`
        );
      }
    });
  }

  /**
   * Test form elements
   */
  testForms() {
    const inputs = document.querySelectorAll("input, textarea, select");

    inputs.forEach((input, index) => {
      const type = input.type;
      const placeholder = input.placeholder;

      if (type === "text" && !placeholder) {
        this.suggestions.push(
          `Text input ${index + 1} could use a placeholder for better UX`
        );
      }

      if (type === "email" && !input.pattern) {
        this.suggestions.push(
          `Email input ${index + 1} could benefit from input validation pattern`
        );
      }
    });
  }

  /**
   * Test navigation
   */
  testNavigation() {
    const nav = document.querySelector("nav");
    const mobileNav = document.querySelector(".mobile-nav");

    if (!mobileNav) {
      this.suggestions.push("Consider adding a mobile navigation component");
    }

    if (nav) {
      const navLinks = nav.querySelectorAll("a");
      if (navLinks.length > 5) {
        this.warnings.push(
          "Navigation has many links - consider mobile-friendly organization"
        );
      }
    }
  }

  /**
   * Test performance
   */
  testPerformance() {
    const images = document.querySelectorAll("img");
    const videos = document.querySelectorAll("video");

    if (images.length > 10) {
      this.suggestions.push(
        "Consider lazy loading for images to improve mobile performance"
      );
    }

    if (videos.length > 0) {
      videos.forEach((video, index) => {
        if (!video.hasAttribute("preload")) {
          this.suggestions.push(
            `Video ${index + 1} should have preload attribute for mobile`
          );
        }
      });
    }
  }

  /**
   * Calculate overall mobile responsiveness score
   */
  calculateScore() {
    const totalChecks =
      this.issues.length + this.warnings.length + this.suggestions.length;
    if (totalChecks === 0) return 100;

    const issueWeight = 3;
    const warningWeight = 2;
    const suggestionWeight = 1;

    const weightedScore =
      this.issues.length * issueWeight +
      this.warnings.length * warningWeight +
      this.suggestions.length * suggestionWeight;

    const maxScore = totalChecks * 3;
    const score = Math.max(0, 100 - (weightedScore / maxScore) * 100);

    return Math.round(score);
  }

  /**
   * Generate detailed report
   */
  generateReport() {
    const result = this.runTests();

    return {
      summary: {
        score: result.score,
        totalIssues: result.issues.length,
        totalWarnings: result.warnings.length,
        totalSuggestions: result.suggestions.length,
      },
      details: {
        critical: result.issues,
        warnings: result.warnings,
        suggestions: result.suggestions,
      },
      recommendations: this.generateRecommendations(result),
    };
  }

  /**
   * Generate actionable recommendations
   */
  generateRecommendations(result) {
    const recommendations = [];

    if (result.issues.length > 0) {
      recommendations.push(
        "Fix critical issues first to ensure basic mobile functionality"
      );
    }

    if (result.warnings.length > 0) {
      recommendations.push(
        "Address warnings to improve mobile user experience"
      );
    }

    if (result.suggestions.length > 0) {
      recommendations.push(
        "Consider implementing suggestions for enhanced mobile experience"
      );
    }

    if (result.score < 70) {
      recommendations.push(
        "Mobile responsiveness needs significant improvement"
      );
    } else if (result.score < 90) {
      recommendations.push(
        "Mobile responsiveness is good but could be improved"
      );
    } else {
      recommendations.push("Excellent mobile responsiveness!");
    }

    return recommendations;
  }
}

/**
 * Quick mobile responsiveness check
 */
export function quickMobileCheck() {
  const test = new MobileResponsivenessTest();
  return test.generateReport();
}

/**
 * Check if current device is mobile
 */
export function isMobileDevice() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768
  );
}

/**
 * Get current viewport dimensions
 */
export function getViewportDimensions() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio || 1,
  };
}

/**
 * Check if element is visible on mobile
 */
export function isElementVisibleOnMobile(element) {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const viewport = getViewportDimensions();

  return (
    rect.top < viewport.height &&
    rect.bottom > 0 &&
    rect.left < viewport.width &&
    rect.right > 0
  );
}

/**
 * Add mobile-specific CSS classes
 */
export function addMobileClasses() {
  if (isMobileDevice()) {
    document.body.classList.add("mobile-device");

    // Add orientation class
    if (window.innerHeight > window.innerWidth) {
      document.body.classList.add("portrait");
      document.body.classList.remove("landscape");
    } else {
      document.body.classList.add("landscape");
      document.body.classList.remove("portrait");
    }
  }
}

/**
 * Initialize mobile responsiveness
 */
export function initMobileResponsiveness() {
  // Add mobile classes
  addMobileClasses();

  // Handle orientation change
  window.addEventListener("orientationchange", () => {
    setTimeout(addMobileClasses, 100);
  });

  // Handle resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(addMobileClasses, 250);
  });

  // Run initial tests
  if (process.env.NODE_ENV === "development") {
    setTimeout(() => {
      const report = quickMobileCheck();
      console.log("Mobile Responsiveness Report:", report);
    }, 1000);
  }
}

export default MobileResponsivenessTest;
