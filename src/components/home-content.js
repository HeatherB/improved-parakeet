import { resetSheet } from 'assets/styles/reset-styles.js';

const template = document.createElement("template");
template.innerHTML = `
  <style>
    #content_wrapper {
      &.home {
        height: 100vh;
        padding: 30px 25px 25px 60px;
        box-sizing: border-box;
        background: url(./assets/images/bg/downtown30.jpg) 0 0 no-repeat #556B2F;
        /*background: url(./assets/images/bg/bg_storm20.jpg) center center repeat #556B2F;*/
        background-size: cover;
        section {
          box-sizing: border-box;
          padding: 2rem;
          position: relative;
          &:before {
            content:'';
            background: url(./assets/images/bg/hexagon.png) top center no-repeat;
            width: 570px;
            height: 570px;
            position: absolute;
            z-index: 0;
            bottom: calc(100% - 570px - 2rem);
            right: calc(100% - 450px);
          }
          p {
            text-shadow: 0px 0px 5px rgba(0,0,0,0.6);
          }
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
          .hey {
            color:$blue;
            font-family: "giddyup-std",sans-serif;
            display: inline-block;
            vertical-align: middle;
            transform: rotate(-14deg);
          }
          .proper {
            color:$orange;
            font-family: 'Playfair Display',Garamond,serif;
            font-size:63px;
            margin-left: 0px;
            //text-shadow: -3px 2px 0px $black;
            display: inline-block;
            vertical-align: middle;
          }
          .detail {
            font-family: 'Special Elite', cursive;
            display:block;
            font-size: 21px;
            line-height:2;
            text-align: right;
            margin-top: -10px;
            color:$blue;
          }
          sup {
            vertical-align: super;
            margin: 0 -9px;
          }
          .heart {
            fill: $pink;
            width: 20px;
            transform: rotate(5deg);
          }
        }
        p {
          position: relative;
          z-index:3;
          max-width: 380px;
          width: 100%;
        }
      }
    }

    @media all and (min-width: 768px) {
      #content_wrapper {
        &.home {
          width:100%;
          padding: 0;
          overflow:hidden;
          h2 {
            &.proper {
              margin-top: -60px;
            }
          }
          section {
            top: calc(100% - 715px);
            left: calc(100% - 550px);
            max-width:570px;
            padding:5rem 2rem 2rem 7rem;
            &:before {
              right: 3rem;
              bottom: 5rem;
            }
            p {
              font-size: 18px;
              line-height: 24px;
              max-width: 380px;
              width: 100%;
            }
          }
        }
      }
    }
  </style>
  <div id="content_wrapper" class="home">
    <section>
      <h2>
        <span class="proper">Hey, I'm Heather</span>
          <span class="detail">software engineer</span>
      </h2>
      <p>Full-stack Engineer with 15+ years in web development — strong on the frontend (React, Next.js, accessible and high-performance UIs) with proven experience in Wordpress, Ruby on Rails, and Symfony (PHP). I build SPAs, dashboards, and enterprise portals that integrate cleanly with REST and GraphQL APIs and scale within modern CMS platforms. Currently expanding into Generative AI engineering with credentials in machine learning, data engineering, and GenAI frameworks. I care about code quality, close collaboration with design and product, and building things that actually work for users.</p>
    </section>
  </div>
`;

class HomeContent extends HTMLElement {
  constructor() {
    super();
    // 2. Attach shadow DOM
    const shadow = this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [resetSheet]
    
    // 3. Append the cloned template content to the shadow DOM
    shadow.appendChild(template.content.cloneNode(true));
  }
}

// 4. Register the component
customElements.define("home-content", HomeContent);
