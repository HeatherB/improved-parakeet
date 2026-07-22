const templateFooter = document.createElement("template");
templateFooter.innerHTML = `
	<style>
		#footer {
			background: var(--theme-footer-bg);
			color: var(--theme-footer-color);
			font-family: var(--theme-font-subhead);
			font-size: .75rem;
			width:100%;
			padding: 0.25rem 2rem 0.25rem 0.25rem;
			text-align: right;
			display: block;
			position: absolute;
			bottom: 0;
			z-index: 10;
			p {
				margin: 0;
				padding: 0;
			}
		}
	</style>
	<div id="footer">
		<p>&copy; Heather Sullivan 2026</p>
	</div>
`;

class SiteFooter extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [window.resetSheet]
    
    shadow.appendChild(templateFooter.content.cloneNode(true));
  }
}

customElements.define("site-footer", SiteFooter);