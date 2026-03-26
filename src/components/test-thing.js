// 1. Define the template (can be in HTML or a JS string)
const template = document.createElement("template");
template.innerHTML = `
  <style>
    .container {
      background-color: var(--theme-background-color, #fff);
      color: var(--theme-text-color, #000);
      font-family: var(--theme-font-family, sans-serif);
      border: 1px solid var(--theme-primary-color, #ccc);
      padding: 1em;
    }
    button {
      background-color: var(--theme-primary-color, blue);
      color: white;
      padding: 0.5em 1em;
      border: none;
      cursor: pointer;
    }
  </style>
  <div class="container">
    <p>Themed content.</p>
    <button>Themed Button</button>
  </div>
`;

class TestThing extends HTMLElement {
  constructor() {
    super();
    // 2. Attach shadow DOM
    const shadow = this.attachShadow({ mode: "open" });
    
    // 3. Append the cloned template content to the shadow DOM
    shadow.appendChild(template.content.cloneNode(true));
  }
}

// 4. Register the component
customElements.define("test-thing", TestThing);
