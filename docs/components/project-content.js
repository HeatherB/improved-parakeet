const templateProjectContent = document.createElement("template");
templateProjectContent.innerHTML = `
    <style>
    /* Modal Backdrop */
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1000;
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modal-backdrop.active {
        display: block;
        opacity: 1;
    }
    
    /* Modal Panel */
    .modal-panel {
        position: fixed;
        width: 100%;
        height: 85vh;
        left: 0;
        right: 0;
        margin: auto;
        top: 3rem;
        background: var(--theme-background-color);
        color: var(--theme-text-color);
        font-family: var(--theme-font-sans);
        z-index: 1001;
        overflow-y: auto;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }
    
    .modal-backdrop.active .modal-panel {
        transform: translateX(0);
    }
    
    @media (min-width: 768px) {
        .modal-panel {
            width: 85%;
            max-width: 1000px;
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
        }
    }
    
    /* Modal Header */
    .modal-header {
        position: sticky;
        top: 0;
        background: var( --theme-secondary-color);
        color: var(--theme-color-white);
        padding: 0.5rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 10;
    }
    
    .close-btn {
        background: rgba(255,255,255,0.2);
        border: 1px solid transparent;
        border-radius: 50%;
        color: inherit;
        padding: 0.5rem 0.75rem;
        font-family: var(--theme-font-sans);
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s ease;
    }
    
    .close-btn:hover {
        background: rgba(255,255,255,0.7);
    }
    
    .close-btn:focus-visible {
        outline: 3px solid var(--theme-color-white);
        outline-offset: 2px;
    }
    
    .modal-title {
        font-family: var(--theme-font-subhead);
        font-size: 1rem;
        margin: 0;
    }
    
    /* Modal Content */
    .modal-content {
        padding: 2rem;
        max-width: 900px;
        margin: 0 auto;
        line-height: 1.7;
    }
    
    .modal-content h1 { font-size: 2.25rem; margin-bottom: 0.5rem; color: var(--theme-primary-darker-color); }
    .modal-content h2 { font-family: var(--theme-font-sans); font-size: 1.6rem; margin-top: 2.5rem; margin-bottom: 1rem; padding-bottom: 0.5rem; }
    .modal-content h3 { font-family: var(--theme-font-subhead); font-size: 1.25rem; margin-top: 2rem; margin-bottom: 0.75rem; }
    .modal-content p { margin-bottom: 1rem; }
    .modal-content code { font-family: var(--theme-font-subhead); background: rgba(0,0,0,0.08); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.9em; }
    .modal-content pre { background: #1e1e1e; color: #d4d4d4; padding: 1.5rem; border-radius: 8px; overflow-x: auto; margin: 1.5rem 0; }
    .modal-content pre code { background: none; padding: 0; color: inherit; }
    .modal-content blockquote { border-left: 4px solid var(--theme-primary-darker-color); margin: 1.5rem 0; padding: 0.5rem 0 0.5rem 1.5rem; font-style: italic; background: rgba(0,0,0,0.03); }
    .modal-content ul, .modal-content ol { margin: 1rem 0; padding-left: 2rem; }
    .modal-content li { margin-bottom: 0.5rem; }
    .modal-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
    .modal-content th, .modal-content td { border: 1px solid rgba(0,0,0,0.15); padding: 0.75rem; text-align: left; }
    .modal-content th { background: var(---theme-primary-darker-color); color: var(--theme-primary-darker-color); }
    .modal-content a { color: var(--theme-primary-darker-color); text-decoration: underline; }
    .modal-content hr { border: none; border-top: 1px solid rgba(0,0,0,0.15); margin: 2rem 0; }
    .loading { text-align: center; padding: 3rem; font-family: var(--theme-font-sans); }
    .error { background: #fee; border: 1px solid #c00; padding: 1.5rem; border-radius: 8px; color: #900; }
    </style>
    
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-panel">
            <header class="modal-header">
                <span class="modal-title" id="modal-title">Case Study</span>
                <button class="close-btn" id="close-modal" aria-label="Close case study">✕</button>
            </header>
            <article class="modal-content" id="modal-content" tabindex="-1">
                <p class="loading">Loading...</p>
            </article>
        </div>
    </div>
`;

const PROJECT_ROUTES = {
    'helpdesk-agents': 'case-studies/it-helpdesk-agents.md',
    'jira-chat': 'case-studies/jira-chat-rag.md',
    'ecoplanner': 'case-studies/seattle-ecoplanner.md',
    'learn-to-play': 'case-studies/microsoft-learn-to-play.md',
    'translation-platform': 'case-studies/microsoft-translation-platform.md',
    'design-system': 'case-studies/design-system-theme-registry.md',
    'enmasse-gaming': 'case-studies/enmasse-gaming-ecommerce.md',
    'plexipixel-pokemon': 'case-studies/plexipixel-pokemon-launch.md'
};

class ProjectContent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        this.shadowRoot.adoptedStyleSheets = [window.resetSheet];
        shadow.appendChild(templateProjectContent.content.cloneNode(true));
        
        this.backdrop = shadow.querySelector('.modal-backdrop');
        this.panel = shadow.querySelector('.modal-panel');
        this.content = shadow.getElementById('modal-content');
        this.closeBtn = shadow.getElementById('close-modal');
        
        this.handleHashChange = this.handleHashChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleBackdropClick = this.handleBackdropClick.bind(this);
    }
    
    connectedCallback() {
        window.addEventListener('hashchange', this.handleHashChange);
        this.handleHashChange();
        this.closeBtn.addEventListener('click', this.handleClose);
        this.backdrop.addEventListener('click', this.handleBackdropClick);
        document.addEventListener('keydown', this.handleKeydown);
    }
    
    disconnectedCallback() {
        window.removeEventListener('hashchange', this.handleHashChange);
        document.removeEventListener('keydown', this.handleKeydown);
    }
    
    handleKeydown(e) {
        if (e.key === 'Escape' && this.backdrop.classList.contains('active')) {
            this.handleClose();
        }
    }
    
    handleBackdropClick(e) {
        // Close only if clicking the backdrop, not the panel
        if (e.target === this.backdrop) {
            this.handleClose();
        }
    }
    
    handleHashChange() {
        const hash = window.location.hash;
        if (hash.startsWith('#project/')) {
            this.showProject(hash.replace('#project/', ''));
        } else {
            this.hideProject();
        }
    }
    
    handleClose() {
        history.pushState(null, '', window.location.pathname + '#work');
        this.hideProject();
    }
    
    async showProject(slug) {
        const mdPath = PROJECT_ROUTES[slug];
        if (!mdPath) {
            this.content.innerHTML = `<div class="error"><h2>Project Not Found</h2></div>`;
            this.backdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
            return;
        }
        
        this.backdrop.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
        this.content.innerHTML = '<p class="loading">Loading project...</p>';
        
        try {
            const response = await fetch(mdPath);
            if (!response.ok) throw new Error('Failed to load');
            const markdown = await response.text();
            
            if (typeof marked === 'undefined') await this.loadMarkedJS();
            this.content.innerHTML = marked.parse(markdown);
            this.content.focus();
        } catch (error) {
            this.content.innerHTML = `<div class="error"><h2>Error Loading Project</h2></div>`;
        }
    }
    
    hideProject() {
        this.backdrop.classList.remove('active');
        document.body.style.overflow = ''; // Restore body scroll
        this.content.innerHTML = '';
    }
    
    loadMarkedJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}

customElements.define("project-content", ProjectContent);