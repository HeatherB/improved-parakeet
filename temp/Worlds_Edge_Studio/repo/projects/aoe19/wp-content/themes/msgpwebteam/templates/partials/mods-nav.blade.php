<nav class="section-nav mods-nav">
  <div class="row">
    <div class="columns small-6 medium-3">
      <div class="frame-box frame-box--button">
        <div class="frame-box__inner frame-box__inner--button">
          <a href="/mods/" class="section-nav__link<?php if(App\isActive('/mods/')) echo ' is-current' ?>">Browse Mods</a>
        </div>
      </div>
    </div>
    <div class="columns small-6 medium-3" id="mods-install-button">
      <div class="frame-box frame-box--button">
        <div class="frame-box__inner frame-box__inner--button">
          <a href="/mods/installed/" class="section-nav__link<?php if(App\isActive('/mods/installed/')) echo ' is-current' ?>">Installed Mods</a>
        </div>
      </div>
    </div>
    <div class="columns small-6 medium-3">
      <div class="frame-box frame-box--button">
        <div class="frame-box__inner frame-box__inner--button">
          <a href="/mods/mine/" class="section-nav__link<?php if(App\isActive('/mods/mine/')) echo ' is-current' ?>">My Mods</a>
        </div>
      </div>
    </div>
    <div class="columns small-6 medium-3">
      <div class="frame-box frame-box--button">
        <div class="frame-box__inner frame-box__inner--button">
          <a href="/mods/create/" class="section-nav__link<?php if(App\isActive('/mods/create/')) echo ' is-current' ?>">Submit a Mod</a>
        </div>
      </div>
    </div>
  </div>
</nav>
