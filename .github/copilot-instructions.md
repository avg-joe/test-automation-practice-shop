# Copilot Instructions — Test Automation Practice Shop

This file captures the site design system and coding principles for the **Test Automation Practice Shop** — an Astro-based e-commerce site built for test automation workshops.

---

## Project Purpose

This site is a **practice target** for automation testing workshops. Its primary goal is to be highly testable and to teach real-world skills:

- Locating elements via stable `data-testid` attributes
- Handling network delays and async operations (via MSW)
- Recognising and debugging flaky tests (10% random failure on `/api/checkout`)
- Detecting regression scenarios triggered by the "Breaking Change" mode

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | [Astro 5](https://astro.build) — SSG (`output: 'static'`) |
| UI Components | React 19 (interactive islands only) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| State Management | Nano Stores (`nanostores` + `@nanostores/react`) |
| Network Mocking | Mock Service Worker 2 (browser `setupWorker`) |
| Hosting | Cloudflare Pages (`wrangler.toml`) |
| Language | TypeScript (strict mode) |

---

## Design System

### Color Palette

```css
--navy:  #1a1a2e   /* primary backgrounds, nav, footer, buttons */
--coral: #e94560   /* accent, CTAs, badges, prices, links */
--light: #f8f8f8   /* section backgrounds, product image placeholders */
--gray:  #666      /* secondary text, meta info */
--border:#e0e0e0   /* card borders, dividers */
--white: #ffffff   /* page background, card backgrounds */
```

### Typography

- **Font family**: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`
- **Headings**: `font-weight: 700–800`
- **Body**: `font-size: 0.9–1rem`, `line-height: 1.6–1.7`
- **Small/meta**: `0.75–0.85rem`, `color: var(--gray)`

### Spacing & Layout

- Page horizontal padding: `2rem`
- Section vertical padding: `4rem 2rem`
- Card border-radius: `12px`
- Button border-radius: `6px`
- Grid gaps: `1rem` (categories) / `1.5rem` (products/testimonials)

### Component Patterns

- **Primary button**: `background: #e94560; color: #fff; border: none`
- **Outline button**: `background: transparent; border: 2px solid currentColor`
- **Cards**: `border: 1px solid #e0e0e0; border-radius: 12px; background: #fff`
- **Hover effects**: `box-shadow: 0 8px 24px rgba(0,0,0,0.1); transform: translateY(-4px)`
- **Badges**: `background: #e94560; color: #fff; border-radius: 4px; font-size: 0.7rem; font-weight: 700`
- **Nav**: `height: 64px; sticky; border-bottom: 1px solid #e0e0e0; z-index: 100`

---

## Coding Principles

### 1. Always use `getTestId` on interactive elements

Every interactive element (buttons, inputs, links, product cards, sections) **must** use `getTestId()` for its `data-testid` attribute. Never hard-code test IDs directly.

```ts
// src/utils/testId.ts
import { getTestId } from '../utils/testId';

<button data-testid={getTestId('login-submit')}>Sign In</button>
```

The utility checks `PUBLIC_BREAKING_CHANGE`:

- `'false'` (default) → returns the stable ID as-is
- `'true'` → returns a deterministic but unrecognisable ID, or `undefined` (simulates a missing locator)

### 2. React islands — hydration directives

| Directive | When to use |
|---|---|
| `client:load` | Components needed immediately (NavBar widgets, modals) |
| `client:visible` | Components below the fold (Add to Cart buttons) |
| `client:only="react"` | Full-page React forms (Checkout page) |

### 3. Astro component vs React component

- **Use `.astro`** for static structure — layout, nav shell, page sections, footer.
- **Use `.tsx`** for anything that needs browser state, event handlers, or Nano Stores.

### 4. MSW handlers live in `src/mocks/`

- `handlers.ts` — defines all `http.*` intercepts. All handlers must include realistic delays.
- `browser.ts` — exports `worker = setupWorker(...handlers)`.
- The worker is started in `Layout.astro` via a `type="module"` script so `await worker.start()` completes before any React island makes a network call.
- Never use a Node.js MSW server (`setupServer`). All mocking is browser-only.

### 5. Nano Stores for shared state

- `src/stores/cart.ts` exports `cartItems` (atom), `cartCount` / `cartTotal` (computed), and the `addToCart()` helper.
- Read stores in React with `useStore()` from `@nanostores/react`.
- Read stores in `.astro` files server-side if needed (they return the initial value during SSG).

### 6. Environment variables

- Prefix client-visible variables with `PUBLIC_` (Astro convention).
- `PUBLIC_BREAKING_CHANGE=true|false` is the only variable used today.
- Never commit real secrets. All MSW responses use dummy/fake data.

### 7. Naming conventions

| Type | Convention | Example |
|---|---|---|
| `data-testid` values | `kebab-case` | `add-to-cart-1`, `nav-login-btn` |
| Component files | `PascalCase.tsx` / `PascalCase.astro` | `LoginModal.tsx` |
| Store files | `camelCase.ts` | `cart.ts` |
| Utility files | `camelCase.ts` | `testId.ts` |
| Mock files | `camelCase.ts` | `handlers.ts`, `browser.ts` |

### 8. No nested interactive elements

Never nest a `<button>` inside an `<a>` (or vice versa). This is invalid HTML5 and can cause unpredictable browser behaviour that breaks test locators. Use a single `<a>` styled as a button, or a single `<button>` with programmatic navigation.

```tsx
// ✅ correct
<a href="/shop" style="...button styles...">Shop Now</a>

// ❌ invalid HTML
<a href="/shop"><button>Shop Now</button></a>
```

### 9. Cart badge visibility

The cart count badge must only be rendered when `count > 0`. Rendering a "0" badge is confusing for end users and can cause false assertions in automation tests.

### 10. Always check `fetch` response status

Before updating client state after a `fetch` call, verify `res.ok`. A non-2xx response does not throw by default — failing to check it can create a desynchronized state between MSW's in-memory data and the client-side Nano Store.

```ts
const res = await fetch('/api/cart/add', { ... });
if (!res.ok) throw new Error(`Cart add failed: ${res.status}`);
addToCart(item); // only called on success
```

---

## MSW API Contract

### `POST /api/login`
- **Delay**: 1 000 ms (teaches `waitFor` / async patterns)
- **Success**: `{ username: 'student' }` → `200` + `{ success: true, token, user }`
- **Failure**: any other username → `401` + `{ success: false, message }`

### `POST /api/cart/add`
- **Delay**: 500 ms
- **Payload**: `{ id, name, price, emoji }`
- **Response**: `200` + `{ success: true, cart, itemCount }`

### `POST /api/checkout`
- **Delay**: 800 ms
- **Random failure**: 10% chance of `500` (teaches flaky test handling)
- **Deterministic failure**: send header `X-Force-Failure: true` → always `500`
- **Success**: `200` + `{ success: true, orderId, message }`, clears in-memory cart

---

## File Structure

```
src/
  components/       # Astro + React components
  layouts/          # Base Layout.astro (MSW init, NavBar, LoginModal)
  mocks/            # MSW handlers.ts and browser.ts
  pages/            # Astro pages (index.astro, future: shop, cart, checkout, contact)
  stores/           # Nano Stores (cart.ts)
  styles/           # global.css (Tailwind import + CSS variables)
  utils/            # testId.ts (getTestId utility)
public/
  mockServiceWorker.js   # MSW service worker (generated, do not edit)
  favicon.svg
```

---

## Adding New Pages

When adding a new page:

1. Create `src/pages/<name>.astro` and wrap content in `<Layout>`.
2. Add a nav link in `src/components/NavBar.astro` with `data-testid={getTestId('nav-<name>')}`.
3. Apply `getTestId()` to every interactive element on the page.
4. Add any new MSW intercepts to `src/mocks/handlers.ts` with appropriate delays.
5. Match the design system (colors, spacing, border-radius) defined above.
