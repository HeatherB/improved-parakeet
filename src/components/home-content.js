const template = document.createElement("template");
template.innerHTML = `
  <style>
    #content_wrapper {
     font-family: var(--theme-font-family);
      &.home {
        position: relative;
        //height: auto;
        height: calc(100% - 26px);
        width:100%;
        background: url(./assets/images/bg/boatMobile.jpg) 0 0 no-repeat;
        background-size: cover;
        section {
          padding: 2rem;
          position: relative;
        }
        h2 {
          text-align: left;
          padding-top:0;
          padding-bottom: 3%;
          font-size: 85px;
          max-width: 380px;
          width: 100%;
          position: relative;
          z-index:2;
          text-shadow: 1px 1px 1px var(--theme-shadow-color);
          .hey {
            color: var(--theme-secondary-color);
            font-family: var(--theme-font-decorative);
            font-weight: 400;
            font-style: normal;
            display: inline-block;
            vertical-align: middle;
            margin-bottom: -1rem;
          }
          .proper {
            color: var(--theme-primary-color);
            font-style: normal;
            font-size:63px;
            margin-left: 0px;
            display: inline-block;
            vertical-align: middle;
          }
          .detail {
            font-family: var(--theme-font-subhead);
            font-weight: 700;
            font-style: normal;
            display:block;
            font-size: 21px;
            line-height:2;
            text-align: right;
            margin-top: -10px;
          }

        }
        p {
          color: var(--theme-text-color);
          position: relative;
          z-index:3;
          background: var(--theme-intro-bg);
        }
      }
    }

    @media all and (min-width: 768px) {
      #content_wrapper {
        &.home {
          background: url(./assets/images/bg/boatTab.jpg) 0 0 no-repeat;
          background-size: cover;
          width:100%;
          padding: 0;
          h2 {
            &.proper {
              margin-top: -60px;
            }
          }
          section {
            padding:2rem;
            position: sticky;
            bottom: 17%;
            left: 50%;
            transform: translateX(-92%);
            width: 55vw;
            p {
              font-size: 18px;
              line-height: 24px;
            }
          }
        }
      }
    }

    @media all and (min-width: 850px) {
      #content_wrapper {
        section {
          bottom: 5%;
        }
      }
    }
    

    @media all and (min-width: 1024px) {
      #content_wrapper {
        &.home {
          background: url(./assets/images/bg/boat.jpg) 50% 75% no-repeat;
          background-size: cover;
          section {
            bottom: 5%;
            left: 50%;
            transform: translateX(-110%);
            width:40vw;
          }
        }
      }
    }

    @media (min-aspect-ratio: 16/9) {
      #content_wrapper {
        &.home {
          section {
            width: 40vw;
          }
        }
      }
    }

    @media (min-aspect-ratio: 21/9) {
      #content_wrapper {
        &.home {
          section {
            width: 40vw;
          }
        }
      }
    }
  </style>
  <div id="content_wrapper" class="home">
    <section>
      <h2>
        <span class="hey">hey, </span>
        <span class="proper">I'm Heather</span>
        <span class="detail">software engineer</span>
      </h2>
      <p>Full-stack Engineer with 15+ years in web development — strong on the frontend (React, Next.js, accessible and high-performance UIs) with proven experience in Wordpress, Ruby on Rails, and Symfony (PHP). I build SPAs, dashboards, and enterprise portals that integrate cleanly with REST and GraphQL APIs and scale within modern CMS platforms. Currently expanding into Generative AI engineering with credentials in machine learning, data engineering, and GenAI frameworks. I care about code quality, close collaboration with design and product, and building things that actually work for users.</p>
    </section>
  </div>
`;

class HomeContent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [window.resetSheet]
    
    shadow.appendChild(template.content.cloneNode(true));
  }
}

// 4. Register the component
customElements.define("home-content", HomeContent);
