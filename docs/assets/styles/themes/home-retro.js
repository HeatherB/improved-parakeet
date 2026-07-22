window.registerTheme('retro', `
  #content_wrapper {
    font-family: var(--theme-font-family);
    &.home {
      position: relative;
      height: calc(100% - 26px);
      width: 100%;
      background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #2d1a4a 100%);
      overflow: hidden;
      &::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background-image: 
          linear-gradient(rgba(255, 102, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 102, 255, 0.1) 1px, transparent 1px);
        background-size: 50px 50px;
        pointer-events: none;
      }
      section {
        padding: 2rem;
        position: absolute;
        bottom: 10%;
        right: 5%;
        text-align: right;
        max-width: 500px;
      }
      h2 {
        text-align: right;
        padding: 0;
        font-size: 60px;
        width: 100%;
        position: relative;
        z-index: 2;
        .hey {
          color: #00ffff;
          font-family: var(--theme-font-family);
          font-weight: 700;
          display: block;
          font-size: 24px;
          text-transform: uppercase;
          letter-spacing: 8px;
          text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
          margin-bottom: 0.5rem;
        }
        .proper {
          color: #ff66ff;
          font-style: italic;
          font-size: 72px;
          display: block;
          text-shadow: 0 0 10px #ff66ff, 0 0 20px #ff66ff, 0 0 40px #ff66ff, 4px 4px 0 #00ffff;
          letter-spacing: -2px;
        }
        .detail {
          font-family: var(--theme-font-subhead);
          font-weight: 400;
          display: block;
          font-size: 14px;
          line-height: 2;
          text-align: right;
          margin-top: 0.5rem;
          color: #00ffff;
          text-transform: uppercase;
          letter-spacing: 6px;
          text-shadow: 0 0 5px #00ffff;
        }
      }
      p {
        color: #ffffff;
        position: relative;
        z-index: 3;
        background: rgba(15, 15, 26, 0.8);
        border: 1px solid #ff66ff;
        box-shadow: 0 0 15px rgba(255, 102, 255, 0.3);
        padding: 1.5rem;
        font-size: 14px;
        line-height: 1.7;
        margin-top: 2rem;
      }
    }
  }
  @media all and (min-width: 768px) {
    #content_wrapper {
      &.home {
        h2 {
          .hey { font-size: 28px; letter-spacing: 12px; }
          .proper { font-size: 96px; }
          .detail { font-size: 16px; letter-spacing: 8px; }
        }
        section {
          padding: 3rem;
          max-width: 600px;
          bottom: 15%;
          right: 8%;
          p { font-size: 16px; line-height: 1.8; }
        }
      }
    }
  }
  @media all and (min-width: 1024px) {
    #content_wrapper {
      &.home {
        section { max-width: 650px; right: 10%; }
        h2 { .proper { font-size: 110px; } }
      }
    }
  }
  @media (min-aspect-ratio: 16/9) {
    #content_wrapper { &.home { section { bottom: 20%; } } }
  }
`);
