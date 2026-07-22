# improved-parakeet

**Personal Portfolio Site — Vanilla JS Architecture with Web Components & Dynamic Theming**

A lightweight, framework-free portfolio site built entirely with native Web Components and modern browser APIs. This project demonstrates how far vanilla JavaScript can go when paired with thoughtful architecture.

**Technical Highlights:**

- **Custom Elements & Shadow DOM** — Each section (home, about, portfolio, footer) is a self-contained web component with encapsulated styles and markup, enabling clean separation of concerns without build tooling.
- **Dynamic Theme System** — Themes are registered via a global registry pattern using Constructable Stylesheets (`CSSStyleSheet`). Components apply themes through `adoptedStyleSheets`, allowing instant theme switching without page reloads or CSS specificity conflicts.
- **Cross-Component Communication** — Theme changes propagate via Custom Events with `composed: true` to cross Shadow DOM boundaries, demonstrating native event-driven architecture.
- **Adaptive Scroll Behavior** — Desktop uses scroll-snap for a page-by-page experience; mobile/tablet flows naturally with content-driven heights. JavaScript dynamically adjusts snap behavior based on viewport and scroll position.
- **Zero Dependencies** — No React, no build step, no bundler. Just HTML, CSS, and vanilla JavaScript leveraging native browser capabilities.

This project served as a rapid prototyping environment for exploring modern CSS and Web Component patterns before applying them to larger production systems.

---

