<?php
$gamerTag = $_GET['gamertag'] ?? $gamertag;
$game = $_GET['game'] ?? 'age';
$player = $_GET['player'] ?? 0;
$gameType = $_GET['gameType'] ?? 'mp';
$gameId = $_GET['gameId'] ?? 0;
$profileId = $_GET['profileId'];

$spLink = '/stats/?gameType=sp&profileId=' . $profileId . '&game=' . $game;
$mpLink = '/stats/?gameType=mp&profileId=' . $profileId . '&game=' . $game;
$cLink = '/stats/?gameType=c&profileId=' . $profileId . '&game=' . $game;


?>
<div class="row stats-mystats-header">
    <div class="column small-12">
        <div class="js-myStatsNav-mount js-header-loader" style="position: relative">
            <div class="frame-box">
                <div class="frame-box__inner frame-box__inner--light">
                    <div class="my-stats-nav">
                        <div class="my-stats-nav__inner">
                            <div class="my-stats-nav__top">
                                <div class="my-stats-nav__avatar">
                                    @if($avatar)
                                        {!! $avatar !!}
                                    @endif
                                </div>
                                <div class="my-stats-nav__gamertag">
                                </div>
                            </div>

                            <div class="my-stats-nav__filters">
                                <select id="game_select">
                                    <option value="age">Age of Empires: DE</option>
                                    <option value="age2" <?php  if ($game == 'age2') { echo  'selected';  } ?> >Age of Empires II: DE</option>
                                </select>
                            </div><!-- end my-stats-nav__filters -->
                            <div class="my-stats-nav__bottom">
                                <div class="frame-box frame-box--button">
                                    <div class="frame-box__inner frame-box__inner--button">
                                        <a href="{{ get_home_url() }}{{$cLink}}" class="section-nav__link <?php echo ($gameType == 'c') ? 'is-current' : ''; ?>">Campaign</a>
                                    </div>
                                </div>
                                <div class="frame-box frame-box--button">
                                    <div class="frame-box__inner frame-box__inner--button">
                                        <a href="{{ get_home_url() }}{{$mpLink}}" class="section-nav__link <?php echo ($gameType == 'mp' || $gameType == '') ? 'is-current' : ''; ?>">
                                            <?php  if ($game == 'age2') { ?>
                                                Career
                                            <?php } else { ?>
                                                Multiplayer
                                            <?php } ?>
                                        </a>
                                    </div>
                                </div>
                                 <?php  if ($game != 'age2') { ?>
                                <div class="frame-box frame-box--button">
                                    <div class="frame-box__inner frame-box__inner--button">
                                        <a href="{{ get_home_url() }}{{$spLink}}" class="section-nav__link <?php echo ($gameType == 'sp') ? 'is-current' : ''; ?>">Single Player</a>
                                    </div>
                                </div>
                                <?php } ?>
                                <!--<div class="frame-box frame-box--button">
                                    <div class="frame-box__inner frame-box__inner--button">
                                        <a href="{{ get_home_url() }}/stats/ageiide" class="section-nav__link">Leaderboard</a>
                                    </div>
                                </div>-->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
