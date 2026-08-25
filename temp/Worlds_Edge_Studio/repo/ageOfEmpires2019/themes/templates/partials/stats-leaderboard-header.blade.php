@php

@endphp

<div class="row stats-leaderboard-header">
    <div class="column small-12 medium-4 medium-push-8">
        <div class="frame-box">
            <div class="frame-box__inner frame-box__inner--dark">
                <div class="my-stats">
                    <div class="my-stats__top">
                        <div class="my-stats__avatar">
                            {!! $avatar !!}
                        </div>
                        <div class="my-stats__gamertag">
                            <h4>{{ $gamertag }}</h4>
                            <span>Clan Wraith</span>
                        </div>
                    </div>
                    <div class="my-stats__bottom">
                        <a href="{{get_home_url()}}/stats/multiplayer" class="button">My Statistics</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="column small-12 medium-8 medium-pull-4">
        <div class="frame-box">
            <div class="frame-box__inner frame-box__inner--light">
                <div class="leader-header">
                    <div class="leader-header__inner">
                        <div class="leader-header__top">
                            <h3 class="leader-header__title">Leaderboard</h3>
                            <div class="leader-header__search">
                                <div class="search-field" id="gamertagSearchBox">
                                    <input type="search" id="q" name="q" placeholder="Search Gamertags" data-input-field="">
                                    <button type="button" class="clear-search" data-clear-button="">
                                        <i class="fa fa-times" aria-hidden="true"></i>
                                    </button>
                                </div>
                                <button type="submit" class="btn-aoe btn--search gamertag-search">
                                    <i class="fa fa-search" aria-hidden="true"></i>
                                    <span class="show-for-sr">Search Members</span>
                                </button>
                            </div>
                        </div>
                        <div class="leader-header__bottom">
                            <div class="leader-header__regions">
                                <label class="show-for-sr" for="regions">Regions</label>
                                <select id="regions" name="regions">
                                    <option value="">Regions</option>

                                    <option value="Daily">Daily</option>

                                    <option value="Weekly">Weekly</option>

                                    <option value="Monthly">Monthly</option>

                                </select>
                            </div>
                            <div class="leader-header__maps">
                                <label class="show-for-sr" for="maps">Map Type</label>
                                <select id="maps" name="maps">
                                    <option value="">Map Type</option>

                                    <option value="Daily">Daily</option>

                                    <option value="Weekly">Weekly</option>

                                    <option value="Monthly">Monthly</option>

                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>