<nav class="section-nav stats-nav">
  <div class="row">
    <div class="columns small-12 medium-4">
      <div class="frame-box frame-box--button">
        <div class="frame-box__inner frame-box__inner--button">
          <a href="/stats/profile/" class="section-nav__link<?php if(App\isActive('/stats/profile/')) echo ' is-current' ?>">Player Profile</a>
        </div>
      </div>
    </div>
    <div class="columns small-6 medium-4">
      <div class="frame-box frame-box--button">
        <div class="frame-box__inner frame-box__inner--button">
          <a href="/stats/multiplayer/" class="section-nav__link<?php if(App\isActive('/stats/multiplayer/')) echo ' is-current' ?>">Multiplayer Stats</a>
        </div>
      </div>
    </div>
    <div class="columns small-6 medium-4">
      <div class="frame-box frame-box--button">
        <div class="frame-box__inner frame-box__inner--button">
          <a href="/stats/campaign/" class="section-nav__link<?php if(App\isActive('/stats/campaign/')) echo ' is-current' ?>">Campaign Stats</a>
        </div>
      </div>
    </div>
  </div>
</nav>
