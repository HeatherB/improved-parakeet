<div class="frame-box">
    <div class="frame-box__inner frame-box--bg-alt frame-box--visible">
        <div class="stats-header row">
            <div class="stats-header__avatar column small-2">
                <?php
                $user_ID = get_current_user_id();
                $user_info = get_userdata($user_ID);
                ?>
                {!! get_avatar( $user_ID, 160 ) !!}
            </div>
            <div class="stats-header__middle column small-8">
                <div class="stats-header__middle-top">
                    <div class="stats-header__username">
                        <?php
                        $gamertag = get_user_meta($user_ID, 'msa_gt')[0];
                        ?>
                        <span class="stats-header__stat stats-header__stat--sm stats-header--block">
                        <?php if($gamertag) { ?>
                            {!! $gamertag !!}
                            <?php } else{ ?>
                            {!! $user_info->user_nicename !!}
                            <?php } ?></span>
                            <label class="stats-header__label stats-header__label--lg">Clan RingWraiths - Espectros del Anillo</label>
                    </div>
                    <div class="stats-header__stat-right">
                        <div class="stats-header__stat-1">
                            <div class="stats-header__stat stats-header__stat--lg js-stat">
                                <span>----</span>
                            </div>
                            <div class="stats-header__label stats-header__label-sm js-stat-label">
                                <label>Current League Rank</label>
                            </div>
                        </div>
                        <div class="stats-header__stat-2">
                            <div class="stats-header__stat stats-header__stat--md js-stat">
                                <span>----</span>
                            </div>
                            <div class="stats-header__label stats-header__label--sm js-stat-label">
                                <label>Highest Leauge Rank</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="stats-header__middle-bottom">
                    <div class="stats-header__middle-inner">

                        <div class="frame-box frame-box--button">
                            <div class="frame-box__inner frame-box__inner--button">
                                <a href="{{ get_home_url() }}/stats/" class="section-nav__link">Campaign Stats</a>
                            </div>
                        </div>
                        <div class="frame-box frame-box--button">
                            <div class="frame-box__inner frame-box__inner--button">
                                <a href="{{ get_home_url() }}/stats/multiplayer/" class="section-nav__link">Multiplayer Stats</a>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            <div class="stats-header__progress-graph-2 column small-2">
                <div class="stats-header__radial js-campaignProgressFloatLoader">
                    <div class="progress-circle__box progress-circle__box--campaignprogress">
                        <div class="chart-circle" id="chart-campaignprogress"></div>
                        <div class="progress-circle__inset chart-inset chart-inset--campaignprogress">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>