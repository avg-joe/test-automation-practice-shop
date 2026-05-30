# Exhaustive `data-testid` Reference

All IDs listed here are the **stable** values returned by `getTestId()` when `PUBLIC_BREAKING_CHANGE=false` (the default).

When `PUBLIC_BREAKING_CHANGE=true` these IDs are scrambled or set to `undefined` — locators will break by design.

> This file is maintained alongside the source code. When you add a new `getTestId(...)` call, add a row here too.

---

## Global / Shared Elements

These elements appear on every page (via `Layout.astro`, `NavBar.astro`, `Footer.astro`, `LoginModal.tsx`).

| `data-testid` | Component | Element description |
|---|---|---|
| `navbar` | `NavBar.astro` | Top navigation `<nav>` |
| `nav-logo` | `NavBar.astro` | Site logo `<a>` |
| `nav-home` | `NavBar.astro` | Home nav `<a>` |
| `nav-shop` | `NavBar.astro` | Shop nav `<a>` |
| `nav-contact` | `NavBar.astro` | Contact nav `<a>` |
| `nav-login-btn` | `NavBar.astro` | Login `<button>` |
| `nav-signup-btn` | `NavBar.astro` | Sign-up `<a>` |
| `nav-cart` | `CartIcon.tsx` | Cart icon `<a>` |
| `cart-count` | `CartIcon.tsx` | Cart count badge `<span>` (hidden when 0) |
| `login-modal` | `LoginModal.tsx` | Modal overlay `<div>` |
| `login-form` | `LoginModal.tsx` | Login `<form>` |
| `login-email` | `LoginModal.tsx` | Username / email `<input>` |
| `login-password` | `LoginModal.tsx` | Password `<input>` |
| `login-submit` | `LoginModal.tsx` | Submit `<button>` |
| `forgot-password` | `LoginModal.tsx` | "Forgot password?" `<a>` |
| `remember-me` | `LoginModal.tsx` | Remember me `<input type="checkbox">` |
| `google-login-btn` | `LoginModal.tsx` | Google SSO `<button>` |
| `facebook-login-btn` | `LoginModal.tsx` | Facebook SSO `<button>` |
| `signup-link` | `LoginModal.tsx` | Sign-up `<a>` |
| `modal-close` | `LoginModal.tsx` | Close modal `<button>` |
| `footer` | `Footer.astro` | Page `<footer>` |
| `footer-shop-all-products` | `Footer.astro` | "All Products" footer link |
| `footer-shop-electronics` | `Footer.astro` | "Electronics" footer link |
| `footer-shop-fashion` | `Footer.astro` | "Fashion" footer link |
| `footer-shop-sale` | `Footer.astro` | "Sale" footer link |
| `footer-support-contact-us` | `Footer.astro` | "Contact Us" footer link |
| `footer-support-faq` | `Footer.astro` | "FAQ" footer link |
| `footer-support-returns` | `Footer.astro` | "Returns" footer link |
| `footer-support-shipping` | `Footer.astro` | "Shipping" footer link |
| `footer-account-login` | `Footer.astro` | "Login" footer link |
| `footer-account-register` | `Footer.astro` | "Register" footer link |
| `footer-account-my-orders` | `Footer.astro` | "My Orders" footer link |
| `footer-account-wishlist` | `Footer.astro` | "Wishlist" footer link |
| `page-header` | Multiple pages | Page header block `<div>` |
| `checkout-steps` | `CheckoutSteps.astro` | Checkout progress bar |

---

## Home Page (`/`)

File: `src/pages/index.astro`

| `data-testid` | Element description |
|---|---|
| `hero-section` | Hero banner `<section>` |
| `hero-badge` | "New Season 2026" badge `<span>` |
| `hero-title` | Main `<h1>` heading |
| `hero-subtitle` | Subtitle `<p>` |
| `hero-shop-btn` | "Shop Now" CTA `<a>` |
| `hero-explore-btn` | "Explore Deals" CTA `<a>` |
| `hero-image` | Hero emoji image `<div>` |
| `features-bar` | Features bar `<div>` |
| `feature-shipping` | "Free Shipping" feature tile |
| `feature-returns` | "Easy Returns" feature tile |
| `feature-support` | "24/7 Support" feature tile |
| `featured-products` | Featured products `<section>` |
| `view-all-products` | "View All →" `<a>` |
| `product-grid` | Product cards grid `<div>` |
| `product-card-1` | Air Runner Pro card |
| `product-card-2` | SoundMax Headphones card |
| `product-card-3` | Urban Tote Bag card |
| `product-card-4` | SmartWatch Series 5 card |
| `product-price-1` | Air Runner Pro price `<span>` |
| `product-price-2` | SoundMax Headphones price `<span>` |
| `product-price-3` | Urban Tote Bag price `<span>` |
| `product-price-4` | SmartWatch Series 5 price `<span>` |
| `add-to-cart-1` | Add Air Runner Pro button |
| `add-to-cart-2` | Add SoundMax Headphones button |
| `add-to-cart-3` | Add Urban Tote Bag button |
| `add-to-cart-4` | Add SmartWatch Series 5 button |
| `categories-section` | "Shop by Category" `<section>` |
| `view-all-categories` | "Browse All →" `<a>` |
| `category-grid` | Category cards grid `<div>` |
| `category-electronics` | Electronics category card |
| `category-fashion` | Fashion category card |
| `category-home` | Home & Living category card |
| `category-sports` | Sports category card |
| `promo-banner` | Promotional banner `<div>` |
| `banner-shop-btn` | "Shop the Sale" `<a>` |
| `testimonials-section` | Testimonials `<section>` |
| `testimonial-grid` | Testimonials grid `<div>` |
| `testimonial-1` | First testimonial card |
| `testimonial-2` | Second testimonial card |
| `testimonial-3` | Third testimonial card |

---

## Shop Page (`/shop`)

File: `src/pages/shop.astro` + `src/components/ShopGrid.tsx`

| `data-testid` | Component | Element description |
|---|---|---|
| `shop-page-header` | `shop.astro` | Page header `<div>` |
| `shop-breadcrumb` | `shop.astro` | Breadcrumb `<p>` |
| `shop-title` | `shop.astro` | Page `<h1>` |
| `shop-subtitle` | `shop.astro` | Subtitle `<p>` |
| `shop-toolbar` | `ShopGrid.tsx` | Toolbar bar (result count + sort) |
| `shop-result-count` | `ShopGrid.tsx` | Result count `<span>` |
| `shop-sort-select` | `ShopGrid.tsx` | Sort `<select>` |
| `shop-filter` | `ShopGrid.tsx` | Category filter sidebar `<aside>` |
| `shop-filter-all` | `ShopGrid.tsx` | "All Products" filter `<button>` |
| `shop-filter-electronics` | `ShopGrid.tsx` | Electronics filter `<button>` |
| `shop-filter-fashion` | `ShopGrid.tsx` | Fashion filter `<button>` |
| `shop-filter-home` | `ShopGrid.tsx` | Home & Living filter `<button>` |
| `shop-filter-sports` | `ShopGrid.tsx` | Sports filter `<button>` |
| `shop-grid` | `ShopGrid.tsx` | Product cards grid `<div>` |
| `shop-product-card-{id}` | `ShopGrid.tsx` | Product card (product id) |
| `shop-product-price-{id}` | `ShopGrid.tsx` | Product price `<span>` (product id) |
| `add-to-cart-shop-{id}` | `ShopGrid.tsx` | Add to cart `<button>` (product id) |
| `shop-empty` | `ShopGrid.tsx` | Empty state `<div>` (no filter results) |
| `shop-empty-clear-btn` | `ShopGrid.tsx` | "View All Products" `<button>` (empty state) |

---

## Cart Page (`/cart`)

File: `src/components/CartPage.tsx`

| `data-testid` | Element description |
|---|---|
| `cart-empty` | Empty cart message `<div>` |
| `cart-empty-shop-btn` | "Start Shopping" `<a>` (empty state) |
| `cart-items` | Cart items section |
| `cart-item-count` | Item count `<h2>` |
| `clear-cart-btn` | "Clear Cart" `<button>` |
| `cart-action-error` | Error banner for failed actions |
| `cart-item-{id}` | Individual cart item row (product id) |
| `item-name-{id}` | Item name `<h3>` (product id) |
| `item-price-{id}` | Item total `<span>` (product id) |
| `qty-decrease-{id}` | Decrease quantity `<button>` (product id) |
| `qty-input-{id}` | Quantity `<input>` (product id) |
| `qty-increase-{id}` | Increase quantity `<button>` (product id) |
| `remove-item-{id}` | "✕ Remove" `<button>` (product id) |
| `coupon-section` | Coupon section `<div>` |
| `coupon-input` | Coupon code `<input>` |
| `apply-coupon-btn` | "Apply" `<button>` |
| `coupon-success` | Applied coupon success `<p>` |
| `coupon-error` | Coupon error `<p>` |
| `recommended-section` | "You Might Also Like" section |
| `rec-product-1` | GamePad Pro recommended card |
| `rec-product-2` | Phone Case recommended card |
| `rec-product-3` | Power Bank recommended card |
| `rec-product-4` | BT Speaker recommended card |
| `rec-add-1` | Add GamePad Pro button |
| `rec-add-2` | Add Phone Case button |
| `rec-add-3` | Add Power Bank button |
| `rec-add-4` | Add BT Speaker button |
| `order-summary` | Order summary sidebar `<div>` |
| `summary-subtotal` | Subtotal row |
| `summary-discount` | Discount row (only visible when coupon applied) |
| `summary-shipping` | Shipping row |
| `summary-tax` | Tax row |
| `summary-total` | Total row |
| `checkout-btn` | "Proceed to Checkout →" `<a>` |
| `continue-shopping-btn` | "← Continue Shopping" `<a>` |

---

## Shipping Page (`/shipping`)

File: `src/components/ShippingForm.tsx`

| `data-testid` | Element description |
|---|---|
| `shipping-empty` | Empty cart message `<div>` |
| `shipping-empty-shop-btn` | "Start Shopping" `<a>` (empty state) |
| `shipping-form` | Shipping `<form>` |
| `shipping-first-name` | First name `<input>` |
| `shipping-first-name-error` | First name validation error |
| `shipping-last-name` | Last name `<input>` |
| `shipping-last-name-error` | Last name validation error |
| `shipping-email` | Email `<input>` |
| `shipping-email-error` | Email validation error |
| `shipping-phone` | Phone `<input>` |
| `shipping-address` | Street address `<input>` |
| `shipping-address-error` | Address validation error |
| `shipping-apartment` | Apartment / suite `<input>` |
| `shipping-city` | City `<input>` |
| `shipping-city-error` | City validation error |
| `shipping-state` | State / province `<input>` |
| `shipping-state-error` | State validation error |
| `shipping-zip` | ZIP / postcode `<input>` |
| `shipping-zip-error` | ZIP validation error |
| `shipping-country` | Country `<select>` |
| `shipping-country-error` | Country validation error |
| `shipping-methods` | Shipping method selector |
| `shipping-method-standard` | Standard shipping option `<label>` |
| `shipping-method-express` | Express shipping option `<label>` |
| `shipping-method-overnight` | Overnight shipping option `<label>` |
| `shipping-order-summary` | Order summary sidebar |
| `shipping-submit-btn` | "Continue to Payment" `<button>` |
| `shipping-back-btn` | "← Back to Cart" `<a>` |
| `shipping-server-error` | Server error message |

---

## Payment Page (`/payment`)

File: `src/components/PaymentForm.tsx`

| `data-testid` | Element description |
|---|---|
| `payment-empty` | Empty cart message `<div>` |
| `payment-empty-shop-btn` | "Start Shopping" `<a>` (empty state) |
| `payment-form` | Payment `<form>` |
| `payment-methods` | Payment method tab bar |
| `payment-method-credit-card` | "Credit Card" tab `<button>` |
| `payment-method-paypal` | "PayPal" tab `<button>` |
| `payment-method-afterpay` | "AfterPay" tab `<button>` |
| `payment-method-zip` | "Zip" tab `<button>` |
| `credit-card-form` | Credit card fields container |
| `card-name` | Cardholder name `<input>` |
| `card-name-error` | Cardholder name validation error |
| `card-number` | Card number `<input>` |
| `card-number-error` | Card number validation error |
| `card-expiry` | Expiry date `<input>` (MM/YY) |
| `card-expiry-error` | Expiry validation error |
| `card-cvv` | CVV `<input>` |
| `card-cvv-error` | CVV validation error |
| `paypal-panel` | PayPal info panel (visible when PayPal selected) |
| `afterpay-panel` | AfterPay info panel (visible when AfterPay selected) |
| `zip-panel` | Zip info panel (visible when Zip selected) |
| `payment-error` | Server / payment error banner |
| `payment-submit-btn` | "Place Order" `<button>` |
| `payment-back-btn` | "← Back to Shipping" `<a>` |
| `payment-order-summary` | Order summary sidebar |

---

## Order Confirmation Page (`/confirm`)

File: `src/components/OrderConfirm.tsx`

| `data-testid` | Element description |
|---|---|
| `confirm-no-order` | "No order found" message (shown when navigated directly) |
| `confirm-shop-btn` | "Go Shopping" `<a>` (no order state) |
| `confirm-banner` | Success banner `<div>` |
| `confirm-message` | Confirmation message text |
| `confirm-order-id` | Order ID value |
| `confirm-info` | Order details block |
| `confirm-total` | Total row label |
| `confirm-total-info` | Total amount value |
| `confirm-shipping-info` | Shipping address block |
| `confirm-actions` | Action buttons container |
| `confirm-continue-btn` | "Continue Shopping" `<a>` |
| `confirm-contact-btn` | "Contact Us" `<a>` |

---

## Contact Page (`/contact`)

File: `src/pages/contact.astro` + `src/components/ContactForm.tsx`

| `data-testid` | Component | Element description |
|---|---|---|
| `contact-cards` | `contact.astro` | Contact channel cards row |
| `contact-card-chat` | `contact.astro` | Live Chat card |
| `start-chat-btn` | `contact.astro` | "Start a Chat" `<a>` |
| `contact-card-email` | `contact.astro` | Email Support card |
| `email-link` | `contact.astro` | Email address `<a>` |
| `contact-card-phone` | `contact.astro` | Phone card |
| `phone-link` | `contact.astro` | Phone number `<a>` |
| `contact-form-section` | `ContactForm.tsx` | Contact form section wrapper |
| `contact-form` | `ContactForm.tsx` | Contact `<form>` |
| `contact-first-name` | `ContactForm.tsx` | First name `<input>` |
| `contact-first-name-error` | `ContactForm.tsx` | First name validation error |
| `contact-last-name` | `ContactForm.tsx` | Last name `<input>` |
| `contact-last-name-error` | `ContactForm.tsx` | Last name validation error |
| `contact-email` | `ContactForm.tsx` | Email `<input>` |
| `contact-email-error` | `ContactForm.tsx` | Email validation error |
| `contact-phone` | `ContactForm.tsx` | Phone `<input>` |
| `contact-subject` | `ContactForm.tsx` | Subject `<select>` |
| `contact-subject-error` | `ContactForm.tsx` | Subject validation error |
| `contact-message` | `ContactForm.tsx` | Message `<textarea>` |
| `contact-message-error` | `ContactForm.tsx` | Message validation error |
| `contact-consent` | `ContactForm.tsx` | Privacy consent `<input type="checkbox">` |
| `contact-consent-error` | `ContactForm.tsx` | Consent validation error |
| `contact-privacy-policy-link` | `ContactForm.tsx` | Privacy policy `<a>` |
| `contact-submit-btn` | `ContactForm.tsx` | "Send Message" `<button>` |
| `contact-success-msg` | `ContactForm.tsx` | Success message after submit |
| `contact-error-msg` | `ContactForm.tsx` | Error message after submit |
| `contact-info-section` | `contact.astro` | Contact info sidebar |
| `info-address` | `contact.astro` | Office address block |
| `info-hours` | `contact.astro` | Business hours block |
| `info-support` | `contact.astro` | Online support info |
| `map-placeholder` | `contact.astro` | Map preview `<div>` |
| `social-section` | `contact.astro` | Social media links |
| `social-instagram` | `contact.astro` | Instagram `<a>` |
| `social-twitter` | `contact.astro` | Twitter `<a>` |
| `social-facebook` | `contact.astro` | Facebook `<a>` |
| `social-youtube` | `contact.astro` | YouTube `<a>` |
| `faq-section` | `contact.astro` | FAQ section |
| `faq-grid` | `contact.astro` | FAQ items grid |
| `faq-1` | `contact.astro` | FAQ item 1 `<details>` |
| `faq-question-1` | `contact.astro` | FAQ question 1 `<summary>` |
| `faq-answer-1` | `contact.astro` | FAQ answer 1 `<div>` |
| `faq-2` | `contact.astro` | FAQ item 2 `<details>` |
| `faq-question-2` | `contact.astro` | FAQ question 2 `<summary>` |
| `faq-answer-2` | `contact.astro` | FAQ answer 2 `<div>` |
| `faq-3` | `contact.astro` | FAQ item 3 `<details>` |
| `faq-question-3` | `contact.astro` | FAQ question 3 `<summary>` |
| `faq-answer-3` | `contact.astro` | FAQ answer 3 `<div>` |
| `faq-4` | `contact.astro` | FAQ item 4 `<details>` |
| `faq-question-4` | `contact.astro` | FAQ question 4 `<summary>` |
| `faq-answer-4` | `contact.astro` | FAQ answer 4 `<div>` |
