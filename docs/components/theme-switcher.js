const templateThemeSwitcher = document.createElement("template");
templateThemeSwitcher.innerHTML = `
	<style>
		#themeSwitcher {
			position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 10;
		}
	</style>
	<div id="themeSwitcher">
		<select id="switch-theme" class="switch-theme">
			<option value="">-- Select a theme --</option>
			<option value="downtown">Downtown</option>
			<option value="great_outdoors">Great Outdoors</option>
      <option value="retro">Retro</option>
		</select>
	</div>
`;

class ThemeSwitcher extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [window.resetSheet]
    
    shadow.appendChild(templateThemeSwitcher.content.cloneNode(true));

    // add event handlers after template enters DOM
    shadow.querySelector('.switch-theme')?.addEventListener('change', (event) => {
      // 1. Create the custom event
      const themeEvent = new CustomEvent('theme-change', {
        bubbles: true, // Allows the event to bubble up through the DOM
        composed: true, // Allows the event to cross shadow DOM boundaries
        detail: {         // Payload for the event, can be any data type (object, string, etc.)
          message: 'Theme was selected',
          theme: event.target.value
        }
      });

      // 2. Dispatch the event on the component itself
      this.dispatchEvent(themeEvent);
    });
  }

}

customElements.define("theme-switcher", ThemeSwitcher);