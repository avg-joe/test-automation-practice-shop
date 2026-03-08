# CSS Stylesheet Best Practices — Test Automation Practice Shop

This document defines the best practices for creating CSS stylesheets and applying classes to HTML elements in the **Test Automation Practice Shop** project.

---

## Core Principles

### 1. No Inline Styles

**Never use inline `style` attributes** on HTML elements in Astro files (`.astro`) or React components (`.tsx`). All styling must be done via CSS classes defined in external stylesheets.

```tsx
// ❌ Bad: Inline styles
<button style={{ padding: '0.5rem', background: '#e94560' }}>Click</button>

// ✅ Good: CSS classes
<button className="btn-primary">Click</button>
```

```astro
<!-- ❌ Bad: Inline styles -->
<div style="padding:2rem;background:#fff;">Content</div>

<!-- ✅ Good: CSS classes -->
<div class="card-container">Content</div>
```

### 2. CSS File Organization

Stylesheets are organized in the `src/styles/` directory:

```
src/styles/
  global.css            # Global styles, CSS variables, base reset
  components/           # Component-specific styles
    navbar.css
    cart-icon.css
    add-to-cart.css
    login-modal.css
    contact-form.css
  pages/                # Page-specific styles
    index.css
    contact.css
```

### 3. CSS File Naming

| File Type | Convention | Example |
|---|---|---|
| Component CSS | `kebab-case.css` | `login-modal.css`, `cart-icon.css` |
| Page CSS | `kebab-case.css` | `index.css`, `contact.css` |
| Utility CSS | `kebab-case.css` | `utilities.css` |

---

## Class Naming Convention

### BEM-Inspired Naming

Use a simplified BEM (Block Element Modifier) approach for class names:

```
.block {}
.block__element {}
.block--modifier {}
```

#### Examples:

```css
/* Block */
.navbar {}

/* Element */
.navbar__logo {}
.navbar__link {}
.navbar__actions {}

/* Modifier */
.navbar__link--active {}
.btn--primary {}
.btn--outline {}
```

### Naming Guidelines

1. **Use `kebab-case`** for all class names
2. **Be descriptive** — class names should describe purpose, not appearance
3. **Avoid generic names** — use specific, contextual names

```css
/* ❌ Bad: Generic, appearance-based */
.red-text {}
.big-padding {}
.centered {}

/* ✅ Good: Descriptive, purpose-based */
.error-message {}
.section-hero {}
.form-actions {}
```

---

## Creating Component Stylesheets

### Structure

Each component stylesheet should follow this structure:

```css
/* ==========================================================================
   Component: ComponentName
   ========================================================================== */

/* Base styles for the component */
.component-name {
  /* Layout */
  display: flex;
  align-items: center;
  
  /* Spacing */
  padding: 1rem;
  margin: 0;
  
  /* Typography */
  font-size: 1rem;
  font-weight: 600;
  
  /* Colors */
  background: var(--white);
  color: var(--navy);
  
  /* Borders */
  border: 1px solid var(--border);
  border-radius: 8px;
  
  /* Effects */
  transition: background 0.2s ease;
}

/* Element styles */
.component-name__title {}
.component-name__content {}
.component-name__actions {}

/* Modifier styles */
.component-name--active {}
.component-name--disabled {}

/* State styles */
.component-name:hover {}
.component-name:focus {}
.component-name:disabled {}
```

### Use CSS Variables

Always use the CSS variables defined in `global.css`:

```css
/* ✅ Good: Use CSS variables */
.card {
  background: var(--white);
  color: var(--navy);
  border: 1px solid var(--border);
}

/* ❌ Bad: Hardcoded values */
.card {
  background: #ffffff;
  color: #1a1a2e;
  border: 1px solid #e0e0e0;
}
```

Available CSS variables:

```css
--navy: #1a1a2e     /* Primary backgrounds, nav, footer, buttons */
--coral: #e94560    /* Accent, CTAs, badges, prices, links */
--light: #f8f8f8    /* Section backgrounds, placeholders */
--gray: #666        /* Secondary text, meta info */
--border: #e0e0e0   /* Card borders, dividers */
--white: #ffffff    /* Page background, card backgrounds */
```

---

## Importing Stylesheets

### In Layout.astro

Import all stylesheets in `Layout.astro` to ensure they're available globally:

```astro
---
import '../styles/global.css';
import '../styles/components/navbar.css';
import '../styles/components/cart-icon.css';
import '../styles/components/add-to-cart.css';
import '../styles/components/login-modal.css';
import '../styles/components/contact-form.css';
import '../styles/pages/index.css';
import '../styles/pages/contact.css';
---
```

### In React Components

React components use `className` instead of `class`:

```tsx
// In React components
<button className="btn btn--primary">Submit</button>
```

### In Astro Components

Astro components use `class` attribute:

```astro
<!-- In Astro components -->
<button class="btn btn--primary">Submit</button>
```

---

## Common Patterns

### Buttons

```css
/* Base button */
.btn {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

/* Primary button (coral background) */
.btn--primary {
  background: var(--coral);
  color: var(--white);
  border: none;
}

/* Outline button */
.btn--outline {
  background: transparent;
  border: 2px solid currentColor;
}

/* Navy button */
.btn--navy {
  background: var(--navy);
  color: var(--white);
  border: none;
}

/* Disabled state */
.btn:disabled,
.btn--disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
```

### Cards

```css
.card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}
```

### Form Elements

```css
.form-group {
  margin-bottom: 1.2rem;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--navy);
}

.form-label__required {
  color: var(--coral);
  margin-left: 2px;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  border-color: var(--coral);
}
```

### Sections

```css
.section {
  padding: 4rem 2rem;
}

.section--light {
  background: var(--light);
}

.section--dark {
  background: var(--navy);
  color: var(--white);
}

.section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.section__title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}
```

---

## Dynamic Styles in React

For styles that change based on state (e.g., loading, active, error), use conditional class names:

```tsx
// Using template literals
<button 
  className={`btn ${isLoading ? 'btn--loading' : ''} ${isActive ? 'btn--active' : ''}`}
>
  {isLoading ? 'Loading...' : 'Submit'}
</button>

// Using array join
<button 
  className={[
    'btn',
    'btn--primary',
    isLoading && 'btn--loading',
    isDisabled && 'btn--disabled'
  ].filter(Boolean).join(' ')}
>
  Submit
</button>
```

For truly dynamic values (e.g., colors from props), CSS custom properties can be used:

```tsx
// Only when values come from data/props
<div 
  className="product-badge"
  style={{ '--badge-color': badgeColor } as React.CSSProperties}
>
  {badgeText}
</div>
```

```css
.product-badge {
  background: var(--badge-color, var(--coral));
}
```

---

## Don'ts

1. **Don't use inline styles** — always use CSS classes
2. **Don't create overly specific selectors** — keep specificity low
3. **Don't use `!important`** — fix specificity issues instead
4. **Don't duplicate styles** — create reusable classes
5. **Don't use IDs for styling** — use classes instead (IDs are for `data-testid` only)
6. **Don't mix CSS methodologies** — stick to the BEM-inspired approach

---

## Checklist for New Components

When creating a new component:

1. [ ] Create a new CSS file in `src/styles/components/`
2. [ ] Define classes using BEM-inspired naming
3. [ ] Use CSS variables for colors, spacing where applicable
4. [ ] Import the CSS file in `Layout.astro`
5. [ ] Apply classes using `className` (React) or `class` (Astro)
6. [ ] Ensure no inline `style` attributes are used
7. [ ] Test hover, focus, and disabled states
8. [ ] Verify responsive behavior if applicable
