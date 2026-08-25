<div class="frame-box stats-frame">
    <div class="frame-box__inner frame-box--bg-alt frame-box--visible">
        <div class="stats-header row">
            <div class="stats-header__avatar">
                @php
                    echo $avatar;
                @endphp
            </div>
            <div class="stats-header__middle">
                <div class="stats-header__middle-top">
                    <div class="stats-header__username">
                        <span class="stats-header__stat stats-header__stat--sm stats-header--block">
                            @if($gamertag)
                                {{ $gamertag }}
                            @else
                        </span>
                        <label class="stats-header__label stats-header__label--lg">
                        </label>
                    </div>
                </div>
            </div>
            <div class="stats-header__middle-bottom hide-for-small-only">
                <div class="stats-header__middle-inner">
                    <div class="stats-header__placeholder"></div>

                    <div class="frame-box frame-box--button">
                        <div class="frame-box__inner frame-box__inner--button">
                            <a href="{{ get_home_url() }}/stats/campaign" class="section-nav__link <?php echo ($page_template_slug == 'templates/page-stats-campaign.blade.php') ? 'is-current' : ''; ?>">Campaign Stats</a>
                        </div>
                    </div>
                    <div class="frame-box frame-box--button">
                        <div class="frame-box__inner frame-box__inner--button">
                            <a href="{{ get_home_url() }}/stats/multiplayer/" class="section-nav__link <?php echo ($page_template_slug == 'templates/page-stats-multiplayer.blade.php') ? 'is-current' : ''; ?>">Multiplayer Stats</a>
                        </div>
                    </div>
                    <div class="frame-box frame-box--button">
                        <div class="frame-box__inner frame-box__inner--button">
                            <a href="{{ get_home_url() }}/stats/single-player/" class="section-nav__link <?php echo ($page_template_slug == 'templates/page-stats-single-player.blade.php') ? 'is-current' : ''; ?>">Single Player Stats</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="stats-header__nav-mobile show-for-small-only">
    <div class="stats-header__middle-inner">
        <div class="stats-header__placeholder"></div>

        <div class="frame-box frame-box--button">
            <div class="frame-box__inner frame-box__inner--button">
                <a href="{{ get_home_url() }}/stats/" class="section-nav__link @php echo ($page_template_slug == 'templates/page-stats-campaign.blade.php') ? 'is-current' : ''; @endphp">Campaign</a>
            </div>
        </div>
        <div class="frame-box frame-box--button">
            <div class="frame-box__inner frame-box__inner--button">
                <a href="{{ get_home_url() }}/stats/multiplayer/" class="section-nav__link @php echo ($page_template_slug == 'templates/page-stats-multiplayer.blade.php') ? 'is-current' : ''; @endphp">Multiplayer</a>
            </div>
        </div>
        <div class="frame-box frame-box--button">
            <div class="frame-box__inner frame-box__inner--button">
                <a href="{{ get_home_url() }}/stats/single-player/" class="section-nav__link <?php echo ($page_template_slug == 'templates/page-stats-single-player.blade.php') ? 'is-current' : ''; ?>">Single Player</a>
            </div>
        </div>
    </div>
</div>