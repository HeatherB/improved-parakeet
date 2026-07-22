const templateAboutContent = document.createElement("template");
templateAboutContent.innerHTML = `
	<style>
	#about-section {
    background: var(--theme-background-color);
    color: var(--theme-text-color);
    font-family: var(--theme-font-family);
    font-size: 1rem;
    padding: 2rem;
    section {
      padding: 2rem;
    }
		.section_header {
			font-family: var(--theme-font-sans);
			margin-top: 0;
			margin-bottom: 1rem;
		}
		div {
			margin-bottom: 2rem;
		}
    p {
      margin: 0 0 1rem 0;
			&.sub, & a {
				font-family: var(--theme-font-subhead);
			}
    }
		small {
			display: block;
			margin-bottom: 2rem;
		}
  }

  @media all and (min-width: 1024px) {
  	#about-section {
	    width:100%;
	    height: 100%;
		}
  }
	</style>
	<div id="about-section" class="about">
    <section>
		<h2 class="section_header">About</h2>
			<div>
	      <p class="lead">At Deloitte, I work in frontend engineering and UI architecture, supporting enterprise digital product delivery across e-commerce, platform modernization, and AI-enabled experiences.</p><p class="sub">I have led frontend delivery, improved automated testing practices, and built complex, high-performance user interface systems for AI-enabled applications.</p><p class="sub">I specialize in turning complex, ambiguous concepts into production-ready, scalable systems while partnering closely with product, design, quality assurance, and engineering teams.</p>
      </div>
			<div>
      	<p class="lead">Before Deloitte, I built digital products across web, gaming, media, e-commerce, and content platform environments.</p><p class="sub">My work spanned full-stack engineering, frontend architecture, content management system (CMS) modernization, accessibility, performance optimization, commerce integrations, and localization experiences.</p><p class="sub">I developed custom WordPress tooling, built scalable frontend and backend features, integrated third-party payment and commerce platforms, and partnered closely with product, design, engineering, and quality assurance teams.</p><p class="sub">This experience gave me a strong end-to-end delivery perspective and a practical foundation for building reliable, user-centered digital products.</p>
    	</div>
			<div>
				<p>I also contribute to public repositories and maintain selected personal projects on GitHub. This work demonstrates my approach to frontend architecture, React, TypeScript, accessibility, automated testing, and applied AI engineering patterns.<small>My public repositories are separate from client-confidential or proprietary work.</small></p>
			</div>
    </section>
  </div>
`;

class AboutContent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [window.resetSheet]
    
    shadow.appendChild(templateAboutContent.content.cloneNode(true));
  }
}

customElements.define("about-content", AboutContent);