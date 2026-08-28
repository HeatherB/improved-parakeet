const templatePortfolioContent = document.createElement("template");
templatePortfolioContent.innerHTML = `
	<style>
	#portfolio-section {
    background: var(--theme-primary-darker-color);
    color: var(--theme-color-white);
    font-family: var(--theme-font-sans);
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
				line-height: 1.5;
			}
			.project_type {
				font-family: var(--theme-font-family);
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
      margin: 1rem 0 0;
			&.sub, & a {
				font-family: var(--theme-font-subhead);
			}
			& a {
				margin-top: 0.5rem;
				display: inline-block;
			}
    }
		small {
			display: block;
		}
		/* Accessible focus styles for links */
		a:focus-visible {
			outline: 3px solid #4A90D9;
			outline-offset: 2px;
			border-radius: 2px;
		}
		a:focus:not(:focus-visible) {
			outline: none;
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
	<div id="portfolio-section" class="portfolio" role="region" aria-labelledby="work-heading">
    <section>
			            <h2 id="work-heading" class="section_header">Work</h2>
              <div id="project-grid" role="list" aria-label="Portfolio projects">
                <article class="project-tile" role="listitem">
                    <h3>RAG knowledge assistant</h3>
					<span class="project_type">GenAI Case Studies</span>
                    <p>Designed a retrieval-augmented generation assistant that allowed users to ask natural language questions against structured and unstructured operational data. The case study focuses on embeddings, vector search, context retrieval, response generation, and the trade-offs involved in building trustworthy AI-assisted search.
                        <br />
                    <a href="#project/helpdesk-agents" aria-label="View Multi-Agent Helpdesk case study">Multi-Agent Helpdesk</a>
                    </p>
                </article>
                <article class="project-tile" role="listitem">
                    <h3>Multi-agent workflow assistant</h3>
					<span class="project_type">GenAI Case Studies</span>
                    <p>Explored agent-based architecture for routing and prioritization workflows. The case study focuses on orchestration, escalation logic, explainability, latency, maintainability, and when a multi-agent approach is—or is not—worth the added complexity.
                        <br />
                    <a href="#project/jira-chat" aria-label="View JIRA Chat case study">JIRA Chat</a>
                    </p>
                </article>
                <article class="project-tile" role="listitem">
                    <h3>AI-enabled planning assistant</h3>
					<span class="project_type">GenAI Case Studies</span>
                    <p>Architected a GenAI assistant for scenario exploration and decision support. The case study focuses on knowledge retrieval, hybrid search, spatial context, scoring logic, and the challenge of presenting AI-generated recommendations in a way users can understand and evaluate.<br />
                    <a href="#project/ecoplanner" aria-label="View EcoPlanner case study">EcoPlanner</a>
                    </p>
                </article>
                <article class="project-tile" role="listitem">
                    <h3>Interactive Tutorial Platform</h3>
					<span class="project_type">Xbox Game Studios</span>
                    <p>Built an interactive "Learn to Play" multimedia application for Age of Empires featuring dynamic canvas hotspots with X/Y positioning, native video delivery with timestamp synchronization, and persistent user progress tracking. The case study focuses on interactive UX engineering, responsive design, and CMS-driven content architecture.<br />
                    <a href="https://www.ageofempires.com/learn-to-play/getting-started-aoe2/" target="_blank" rel="noopener noreferrer" aria-label="View Learn to Play live demo on Age of Empires website">Live Demo</a> |
                    <a href="#project/learn-to-play" aria-label="View Learn to Play case study">Case Study</a>
                    </p>
                </article>
                <article class="project-tile" role="listitem">
                    <h3>Automated Localization Platform</h3>
					<span class="project_type">Xbox Game Studios</span>
                    <p>Architected a WordPress plugin that integrated Azure Translator API to automate multi-language content generation, eliminating manual translation workflows for editorial teams. Features include batch translation of complex ACF structures, translation locking to protect manual edits, and Polylang integration for 6+ languages.<br />
                    <a href="#project/translation-platform" aria-label="View Translation Platform case study">Case Study</a>
                    </p>
                </article>
                <article class="project-tile" role="listitem">
                    <h3>Gaming E-Commerce Platform</h3>
					<span class="project_type">En Masse Entertainment</span>
                    <p>Built multi-game web storefronts, secure checkout flows, virtual currency systems, and console launchers for TERA, Closers, and Kritika Online. Features include 4-step purchase flow with international payment providers, seasonal gifting with tiered rewards, and Xbox/PS4 launcher UI.<br />
                    <a href="#project/enmasse-gaming" aria-label="View En Masse Gaming E-Commerce case study">Case Study</a>
                    </p>
                </article>
                <article class="project-tile" role="listitem">
                    <h3>Pokémon Launch Sites — 14-Language Localization</h3>
					<span class="project_type">Plexipixel / Nintendo</span>
                    <p>Developed promotional websites for Pokémon Rumble World and Pokémon Shuffle with simultaneous global launch across 14 languages. Built themeable CSS architecture enabling rapid reskinning, plus Microsoft Build Tour email templates for 23 cities.<br />
                    <a href="#project/plexipixel-pokemon" aria-label="View Plexipixel Pokémon case study">Case Study</a>
                    </p>
                </article>
                <article class="project-tile" role="listitem">
                    <h3>Personal Portfolio Site — Vanilla JS Architecture with Web Components & Dynamic Theming</h3>
                    <span class="project_type">GitHub</span>
					<p>This repo for this site! A lightweight, framework-free portfolio site built entirely with native Web Components and modern browser APIs. This project demonstrates how far vanilla JavaScript can go when paired with thoughtful architecture.<br />
                    <a href="https://github.com/HeatherB/improved-parakeet" target="_blank" rel="noopener noreferrer" aria-label="View portfolio site source code on GitHub">Source Code</a> |
                    <a href="#project/design-system" aria-label="View design system documentation">Design System Spec</a>
                    </p>
                </article>
				<article class="project-tile" role="listitem">
                    <h3>Open Source Contributions</h3>
					<span class="project_type">GitHub</span>
                    <p>Selected repos I contribute to<br />
                    <a href="https://github.com/HeatherB" target="_blank" rel="noopener noreferrer" aria-label="View Heather's GitHub profile">github.com/HeatherB</a>
                    </p>
                </article>
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