# 🎨 KeycodeHelp Color System

## Overview

This document defines the unified color system used throughout the KeycodeHelp application. All colors are defined as CSS custom properties (variables) in `global-theme.css` and should be used consistently across all components.

## 🎯 Brand Colors

### Primary Blue

- **Primary**: `#0b41e4` - Main brand color, used for primary actions and highlights
- **Primary Light**: `#3d6bff` - Hover states and secondary highlights
- **Primary Dark**: `#0729a3` - Active states and pressed elements

### Secondary Slate

- **Secondary**: `#213341` - Secondary brand color, used for backgrounds and borders
- **Secondary Light**: `#3a4f5f` - Hover states for secondary elements
- **Secondary Dark**: `#1a2a35` - Active states for secondary elements

### Accent Yellow

- **Accent**: `#ffce20` - Call-to-action color, used for important buttons
- **Accent Light**: `#ffd84d` - Hover states for accent elements
- **Accent Dark**: `#e6b800` - Active states for accent elements

## ✅ Status Colors

### Success

- **Success**: `#4ae66c` - Success states, confirmations, positive feedback
- **Success Light**: `#6bff8a` - Hover states for success elements
- **Success Dark**: `#3bc55a` - Active states for success elements

### Warning

- **Warning**: `#ffa726` - Warning states, caution messages
- **Warning Light**: `#ffb74d` - Hover states for warning elements
- **Warning Dark**: `#f57c00` - Active states for warning elements

### Error

- **Error**: `#f44336` - Error states, validation failures, destructive actions
- **Error Light**: `#ef5350` - Hover states for error elements
- **Error Dark**: `#d32f2f` - Active states for error elements

### Info

- **Info**: `#2196f3` - Information states, neutral feedback
- **Info Light**: `#42a5f5` - Hover states for info elements
- **Info Dark**: `#1976d2` - Active states for info elements

## 🌑 Neutral Colors

### Text Colors

- **Text**: `#ffffff` - Primary text color
- **Text Dim**: `rgba(255, 255, 255, 0.7)` - Secondary text, less important content
- **Text Muted**: `rgba(255, 255, 255, 0.5)` - Muted text, disabled content

### Background Colors

- **Background**: `#000000` - Main application background
- **Surface**: `#0a0a0a` - Surface backgrounds (cards, panels)
- **Surface Light**: `#1a1a1a` - Light surface backgrounds
- **Surface Dark**: `#050505` - Dark surface backgrounds

### Border Colors

- **Border**: `rgba(255, 255, 255, 0.1)` - Standard borders
- **Border Light**: `rgba(255, 255, 255, 0.05)` - Subtle borders
- **Border Dark**: `rgba(255, 255, 255, 0.2)` - Prominent borders

### Shadow Colors

- **Shadow**: `rgba(0, 0, 0, 0.3)` - Standard shadows
- **Shadow Light**: `rgba(0, 0, 0, 0.1)` - Subtle shadows
- **Shadow Dark**: `rgba(0, 0, 0, 0.5)` - Prominent shadows

## 🔧 Usage Guidelines

### When to Use Each Color

#### Primary Blue (`--primary`)

- Main navigation elements
- Primary action buttons
- Links and interactive elements
- Brand highlights and logos

#### Secondary Slate (`--secondary`)

- Secondary navigation
- Background surfaces
- Borders and dividers
- Secondary action buttons

#### Accent Yellow (`--accent`)

- Call-to-action buttons
- Important highlights
- Promotional elements
- Special features

#### Status Colors

- **Success**: Confirmation messages, completed actions, positive feedback
- **Warning**: Caution messages, pending actions, attention needed
- **Error**: Error messages, validation failures, destructive actions
- **Info**: Neutral information, help text, general feedback

### Button Variants

```css
/* Primary Button */
.btn-primary {
  background-color: var(--primary);
  color: var(--primaryFg);
}

/* Secondary Button */
.btn-secondary {
  background-color: var(--secondary);
  color: var(--secondaryFg);
}

/* Accent Button */
.btn-accent {
  background-color: var(--accent);
  color: var(--accentFg);
}

/* Status Buttons */
.btn-success {
  background-color: var(--success);
}
.btn-warning {
  background-color: var(--warning);
}
.btn-error {
  background-color: var(--error);
}
.btn-info {
  background-color: var(--info);
}
```

### Text Colors

```css
/* Primary Text */
.text-primary {
  color: var(--primary);
}
.text-secondary {
  color: var(--secondaryFg);
}
.text-accent {
  color: var(--accent);
}

/* Status Text */
.text-success {
  color: var(--success);
}
.text-warning {
  color: var(--warning);
}
.text-error {
  color: var(--error);
}
.text-info {
  color: var(--info);
}

/* Neutral Text */
.text-dim {
  color: var(--textDim);
}
.text-muted {
  color: var(--textMuted);
}
```

## 🎨 Color Combinations

### High Contrast (Accessibility)

- Primary text on dark backgrounds
- Success/Error colors on dark backgrounds
- White text on primary colors

### Medium Contrast

- Secondary text on surface backgrounds
- Border colors on surface backgrounds
- Accent colors on dark backgrounds

### Low Contrast (Subtle)

- Muted text on surface backgrounds
- Light borders on surface backgrounds
- Shadow effects

## 📱 Responsive Considerations

### Dark Mode

- All colors are designed for dark mode by default
- Light text on dark backgrounds
- Subtle borders and shadows for depth

### Accessibility

- High contrast ratios for text readability
- Color-blind friendly combinations
- Sufficient contrast for all text sizes

## 🚫 What NOT to Do

1. **Don't hardcode colors** - Always use CSS variables
2. **Don't mix color systems** - Stick to the unified palette
3. **Don't use colors for meaning alone** - Include text or icons
4. **Don't create new colors** - Use existing palette variations

## 🔄 Adding New Colors

If you need a new color:

1. **Check existing palette** - Use light/dark variations of existing colors
2. **Follow naming convention** - Use descriptive names with light/dark variants
3. **Update documentation** - Add to this file
4. **Test accessibility** - Ensure sufficient contrast ratios

## 📚 Resources

- **CSS Variables**: Defined in `src/styles/global-theme.css`
- **Tailwind Config**: Extended in `tailwind.config.js`
- **Component Examples**: See existing components for usage patterns
- **Design System**: Follow established patterns for consistency

---

_Last updated: [Current Date]_
_Maintained by: Development Team_
