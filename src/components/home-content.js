const template = document.createElement("template");
template.innerHTML = `
  <div id="content_wrapper" class="content_wrapper home">
    <section>
      <h2>
        <span class="hey">hey, </span>
        <span class="proper">I'm Heather</span>
        <span class="detail">software engineer</span>
      </h2>
      <p>Enterprise UI architect and lead engineer with 15+ years of experience designing, scaling, and delivering high-performing, accessible digital products.</p><p>Highly experienced in modern frontend architecture, including React, Next.js, and TypeScript, with deep full-stack and generative artificial intelligence (AI) capabilities.</p><p>Proven record leading cross-functional engineering teams, improving Core Web Vitals, and delivering large-scale digital platforms.</p>
    </section>
  </div>
`;

class HomeContent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
    
    // Apply initial theme from localStorage or default
    const initialTheme = localStorage.getItem('theme') || 'downtown';
    this.applyTheme(initialTheme);
    
    // Listen for theme changes (from theme-switcher)
    document.addEventListener('theme-change', (e) => {
      this.applyTheme(e.detail.theme);
    });
  }
  
  applyTheme(theme) {
    this.shadowRoot.adoptedStyleSheets = [window.resetSheet, window.getThemeSheet(theme)];
    const wrapper = this.shadowRoot.getElementById('content_wrapper');
    wrapper.className = `home ${theme}`;
  }
}

customElements.define("home-content", HomeContent);
