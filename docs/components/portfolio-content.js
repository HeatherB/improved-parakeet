const templatePortfolioContent = document.createElement("template");
templatePortfolioContent.innerHTML = `
	<style>
	#portfolio-section {
    background: var(--theme-primary-color);
    color: var(--theme-color-white);
    font-family: var(--theme-font-family);
    font-size: 1rem;
    padding: 2rem;
    section {
      padding: 2rem;
    }
		#project-grid {
			margin-bottom: 4rem;
			display: flex;
			flex-wrap: wrap;
			gap: 1.5rem;
		}
		.project-tile {
			flex: 0 0 100%;
			box-sizing: border-box;
			h3 {
				font-family: var(--theme-font-sans);
			}
		}
		.section_header {
			font-family: var(--theme-font-sans);
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
		}
  }

  @media all and (min-width: 1024px) {
  	#portfolio-section {
	    width:100%;
	    min-height: 100%;
		  .project-tile {
			  flex: 0 0 calc(33.333% - 1rem);
		  }
		}
  }
	</style>
	<div id="portfolio-section" class="portfolio">
    <section>
			<h2 class="section_header">Work</h2>
      		<div id="project-grid">
				<div class="project-tile">
					<h3>GenAI Case Studies | RAG knowledge assistant</h3>
					<p>Designed a retrieval-augmented generation assistant that allowed users to ask natural language questions against structured and unstructured operational data. The case study focuses on embeddings, vector search, context retrieval, response generation, and the trade-offs involved in building trustworthy AI-assisted search.
						<br />
					<a href="https://github.com/HeatherB/version_genai/blob/main/it-helpdesk-agents.md" target="_blank">Mulit-Agent Helpdesk</a>
					</p>
				</div>
				<div class="project-tile">
					<h3>GenAI Case Studies | Multi-agent workflow assistant</h3>
					<p>Explored agent-based architecture for routing and prioritization workflows. The case study focuses on orchestration, escalation logic, explainability, latency, maintainability, and when a multi-agent approach is—or is not—worth the added complexity.
						<br />
					<a href="https://github.com/HeatherB/version_genai/blob/main/jira-chat-rag.md" target="_blank">JIRA Chat</a>
					</p>
				</div>
				<div class="project-tile">
					<h3>GenAI Case Studies | AI-enabled planning assistant</h3>
					<p>Architected a GenAI assistant for scenario exploration and decision support. The case study focuses on knowledge retrieval, hybrid search, spatial context, scoring logic, and the challenge of presenting AI-generated recommendations in a way users can understand and evaluate.<br />
					<a href="https://github.com/HeatherB/version_genai/blob/main/seattle-ecoplanner.md" target="_blank">EcoPlanner</a>
					</p>
				</div>
				<div class="project-tile">
					<h3>GitHub</h3>
					<p>Selected repos I contribute to<br />
					<a href="https://github.com/HeatherB" target="_blank">github.com/HeatherB</a>
					</p>
				</div>
				<div class="project-tile">
					<h3>GitHub | Personal Portfolio Site — Vanilla JS Architecture with Web Components & Dynamic Theming</h3>
					<p>This repo for this site! A lightweight, framework-free portfolio site built entirely with native Web Components and modern browser APIs. This project demonstrates how far vanilla JavaScript can go when paired with thoughtful architecture.<br />
					<a href="https://github.com/HeatherB/improved-parakeet" target="_blank">github.com/HeatherB/improved-parakeet</a>
					</p>
				</div>
      	<!--<div class="project-tile">
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
      	</div>-->
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