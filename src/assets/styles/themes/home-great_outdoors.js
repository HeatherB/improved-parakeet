window.registerTheme('great_outdoors', `
  #content_wrapper {
    font-family: var(--theme-font-family);
    position: relative;
    z-index: 5; /* Above coloring canvas */
    &.home {
      position: relative;
      height: calc(100% - 26px);
      width: 100%;
      background: transparent; /* Transparent to show coloring page */
      display: flex;
      align-items: center;
      justify-content: center;
      section {
        padding: 3rem;
        position: relative;
        text-align: center;
        background: rgba(255, 255, 255, 0.95); /* Solid white card for readability */
        backdrop-filter: blur(10px);
        border-radius: 20px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        margin: 2rem;
      }
      h2 {
        text-align: center;
        padding: 0;
        font-size: 48px;
        width: 100%;
        position: relative;
        z-index: 2;
        text-shadow: none;
        .hey {
          color: #2d5a27;
          font-family: var(--theme-font-decorative);
          font-weight: 400;
          display: block;
          font-size: 36px;
          margin-bottom: 0.5rem;
        }
        .proper {
          color: #1a5f7a; /* Ocean blue for contrast on white card */
          font-style: normal;
          font-size: 52px;
          display: block;
          letter-spacing: 2px;
        }
        .detail {
          font-family: var(--theme-font-subhead);
          font-weight: 400;
          display: block;
          font-size: 16px;
          line-height: 2;
          text-align: center;
          margin-top: 1rem;
          color: #2d5a27;
          text-transform: uppercase;
          letter-spacing: 4px;
        }
      }
      p {
        color: #333; /* Dark text for readability on white card */
        position: relative;
        z-index: 3;
        background: transparent;
        font-size: 16px;
        line-height: 1.8;
        margin-top: 1.5rem;
      }
    }
  }
  @media all and (min-width: 768px) {
    #content_wrapper {
      &.home {
        h2 {
          font-size: 64px;
          .hey { font-size: 48px; }
          .proper { font-size: 72px; }
          .detail { font-size: 18px; }
        }
        section {
          padding: 4rem;
          max-width: 700px;
          p { font-size: 18px; }
        }
      }
    }
  }
  @media all and (min-width: 1024px) {
    #content_wrapper { &.home { section { max-width: 800px; } } }
  }
`);
