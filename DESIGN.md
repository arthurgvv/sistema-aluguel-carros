# Design System: High-End Editorial Experience

## 1. Overview & Creative North Star

### The Creative North Star: "The Curated Precision"
This design system is not just a UI kit; it is a digital showroom. Our goal is to move beyond the generic "SaaS" template and embrace a high-end, editorial aesthetic that mirrors the experience of luxury automotive craftsmanship. We achieve this through **Curated Precision**: a philosophy that prioritizes intentional negative space, high-contrast typography, and a rejection of traditional UI boundaries.

By utilizing **intentional asymmetry**—such as overlapping high-resolution car imagery with bold, overlapping typographic elements—we break the rigid 12-column grid. The interface should feel like a premium print magazine: spacious, authoritative, and sophisticated.

---

## 2. Colors

The palette is rooted in a monochromatic foundation to allow the product (the vehicles) to be the primary source of color and "soul."

### Palette Strategy
- **Primary (`#000000`) & Surface (`#f9f9f9`):** Our core contrast. We use absolute blacks against soft, off-white surfaces to reduce eye strain while maintaining a high-fashion look.
- **Tonal Neutrals:** We use `secondary` (`#5e5e5e`) and `outline-variant` (`#c6c6c6`) to provide subtle hints of structure without the aggression of pure black lines.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section off content. 
Structure must be defined by:
- **Tonal Shifts:** Placing a `surface-container-low` (`#f3f3f3`) section against the main `surface` (`#f9f9f9`).
- **Negative Space:** Using expansive margins to imply a change in context.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of premium materials. 
- Use `surface-container-lowest` (`#ffffff`) for elevated cards to make them "pop" against a `surface` (`#f9f9f9`) background.
- Nesting should follow a logical light source: inner containers should be slightly brighter or more recessed using the `surface-container` tiers to imply depth through tone, not lines.

### Glass & Gradients
For floating elements, such as navigation bars or mobile app previews, use **Glassmorphism**. Apply a semi-transparent `surface` color with a `backdrop-filter: blur(20px)`. Main CTAs may use a subtle linear gradient from `primary` (`#000000`) to `primary-container` (`#3b3b3b`) at a 150-degree angle to add a metallic, car-paint-like sheen.

---

## 3. Typography

We use **Manrope** across the board, relying on drastic scale shifts rather than multiple typefaces to convey luxury.

| Token | Size | Weight | Intent |
| :--- | :--- | :--- | :--- |
| **display-lg** | 3.5rem | Bold (700) | Hero headlines. Use tight letter-spacing (-0.02em). |
| **headline-lg** | 2rem | Bold (700) | Section headers. High impact. |
| **title-md** | 1.125rem | Medium (500) | Sub-headers and card titles. |
| **body-lg** | 1rem | Regular (400) | Primary narrative text. Increased line-height (1.6). |
| **label-md** | 0.75rem | Bold (700) | All-caps "Eye-brow" text above headlines. |

**The Editorial Rhythm:** Always pair a `label-md` (uppercase, tracked out) with a `display-lg` headline to create a "Signature Look" that feels designed, not typed.

---

## 4. Elevation & Depth

We reject the "drop shadow" of the early web. Depth in this system is achieved through **Tonal Layering**.

- **The Layering Principle:** Place a `surface-container-lowest` (`#ffffff`) card on a `surface-container-low` (`#f3f3f3`) background. The 2-unit hex difference creates a sophisticated "lift" that looks natural under gallery lighting.
- **Ambient Shadows:** If a shadow is required for a floating CTA, use the `on-surface` color at 4% opacity with a 40px blur and 10px Y-offset. It should feel like a soft glow, not a dark stain.
- **The "Ghost Border":** For interactive elements like input fields, use `outline-variant` (`#c6c6c6`) at 20% opacity. If you can clearly see the border from a distance, it is too heavy.
- **Glassmorphism:** Use for floating headers. Combine `surface` at 80% opacity with a heavy blur to allow the car imagery to bleed through elegantly.

---

## 5. Components

### Buttons
- **Primary:** `primary` (`#000000`) background, `on-primary` text. Use `rounded-full` (9999px) for a modern, sleek feel. 
- **Secondary:** `surface-container-highest` background. No border.
- **Tertiary:** Text-only with an icon (e.g., "Show All models →"). Use `title-sm` typography.

### Cards & Lists
- **The "No-Divider" Rule:** Forbid the use of horizontal lines. Use vertical white space (3rem+) to separate car listings or features. 
- **Vehicle Cards:** Large images with `rounded-lg` (2rem) corners. Titles should be `title-lg`. Pricing should be `title-md` but in a `secondary` (`#5e5e5e`) color to maintain hierarchy.

### Input Fields
- Use `surface-container-highest` (`#e2e2e2`) for the background. 
- **Ghost Border:** 1px `outline-variant` at 10% opacity. 
- **State:** On focus, transition the background to `surface-container-lowest` (`#ffffff`) to "activate" the field.

### Feature Chips
- Small, `rounded-full` pills using `primary` for the active state and `surface-container-high` for inactive. These should be grouped with generous 1rem gaps.

---

## 6. Do's and Don'ts

### Do
- **Do** use asymmetrical layouts where imagery bleeds off the edge of the screen.
- **Do** use "Eye-brow" labels (small, bold, all-caps) to categorize sections.
- **Do** leverage the `rounded-lg` (2rem) and `rounded-xl` (3rem) tokens for main containers to mimic the aerodynamic curves of a luxury car.
- **Do** use high-contrast imagery with deep blacks and bright highlights.

### Don't
- **Don't** use 1px solid black borders. Ever.
- **Don't** use standard 400ms easing. Use custom "slow-in, fast-out" transitions (e.g., `cubic-bezier(0.2, 0, 0, 1)`) to make the UI feel heavy and expensive.
- **Don't** crowd the interface. If you think there is enough white space, add 24px more. 
- **Don't** use pure grey shadows; always tint them with a hint of the background tone to maintain "color air."