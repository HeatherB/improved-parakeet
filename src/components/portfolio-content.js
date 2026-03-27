const templatePortfolioContent = document.createElement("template");
templatePortfolioContent.innerHTML = `
	<style>
		#portfolio-section {
			background: var(--theme-background-color);
			color: var(--theme-text-color);
			font-family: var(--theme-font-family);
			font-size: 1rem;
			width:100%;
			height: 100%;
			padding: 2rem;
			p {
				margin: 0;
				padding: 0;
			}
		}
	</style>
	<div id="portfolio-section" class="home">
    <section>
      <p>area for portfolio / projects grid</p>
      <p>explain idea for site. Show off a prototype, and then explain the type of work I do and show some smaple projects in versious tech stacks. Include common things you need to build like testing.</p>
      <div id="project-grid">
      	<div class="project-tile">
      		<h3>React / Next Stuff</h3>
      		<p>explain it</p>
      	</div>

      	<div class="project-tile">
      		<h3>PHP / Wordpress Stuff</h3>
      		<p>explain it</p>
      	</div>

      	<div class="project-tile">
      		<h3>Ruby Stuff</h3>
      		<p>explain it</p>
      	</div>

      	<div class="project-tile">
      		<h3>Svelte / Vue Stuff</h3>
      		<p>explain it</p>
      	</div>

      	<div class="project-tile">
      		<h3>Python / Recommendation engine</h3>
      		<p>explain it</p>
      	</div>

      	<div class="project-tile">
      		<h3>GenAI Stuff</h3>
      		<p>explain it</p>
      	</div>
      </div>
    </section>
  </div>
`;

class PortfolioContent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [window.resetSheet]
    
    shadow.appendChild(templatePortfolioContent.content.cloneNode(true));
  }
}

customElements.define("portfolio-content", PortfolioContent);