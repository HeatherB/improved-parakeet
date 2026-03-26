class SiteHeader extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });
		shadow.innerHTML = `
			<meta charset="utf-8" />

	    	<!-- Standard desktop and mobile favicons -->
	        <link rel="icon" type="image/ico" href="/assets/img/favicon.png">
	        <link rel="shortcut icon" href="/assets/img/favicon.png">

			<title>Heather Sullivan Portfolio</title>

			<link rel="stylesheet" href="/assets/styles/styles.css?ver=now" />

			<meta name="viewport" content="initial-scale=1.0, user-scalable=yes, width=device-width"/>
  			<meta name="description" content="Heather Sullivan Software Engineer - React, Next.js & GenAI. Building things that actually work for users.">
		`;
	}
}

customElements.define("site-header", SiteHeader)