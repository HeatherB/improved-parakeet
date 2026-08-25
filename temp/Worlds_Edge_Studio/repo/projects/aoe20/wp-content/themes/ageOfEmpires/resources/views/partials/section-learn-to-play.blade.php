{{-- need some sort of variable to display content for a specific game or set of games --}}

<section class="learn-to-play-section">
    <div class="page-container">
        <div class="learn-to-play-section__content">
            <div class="learn-to-play-section__header">
                <h2 class="section__title">Learn to Play</h2>
                <a class="section__title__more">Read More {{icon('pointer-right', 'icon --pointer-right')}}</a>
            </div>

            <div class="learn-to-play-section__feature">
                <div class="learn-to-play-section__video">
                    <iframe src="https://www.youtube.com/embed/bQyu_5e0xgw" frameborder="0" allowfullscreen></iframe>

                    {{icon('play','play-icon')}}
                    <h4 class="learn-to-play-section__video__title">
                        {{-- span is needed to control max number of rows --}}
                        <span>Age of Empires II: Definitive Edition - Empire Wars Overview</span>
                    </h4>
                </div>
                <div class="learn-to-play-section__feature__info">
                    <h3 class="learn-to-play-section__feature__title">Empire Wars</h3>
                    <p class="learn-to-play-section__feature__description">Empire Wars is a new game mode, exclusively introduced into Age of Empires II: Definitive Edition! In Empire Wars, players start with a small town and economy. All players start in the Feudal Age, with 27 villagers already working farms, chopping trees and mining gold. Economic buildings and a Barracks are also provided to help you build up through the early stages of the game. Empire Wars is available on all maps included with Age of Empires II: Definitive Edition, although your starting town may depend on the map.</p>
                    <a class="learn-to-play-section__feature__cta">More about Empire Wars</a>
                </div>
            </div>

            {{-- !!temp!! --}}
            <?php 
                $l2p_thumbs = array(
                    array(
                        'title' => 'Task Queuing & Mixed Queue - Age of Empires II: Definitive Edition Quality of Life',
                        'url' => '#l2pThumb1',
                        'img' => 'https://images.gamewatcherstatic.com/screenshot/image/5/10/142195/43703801.jpg'
                    ),
                    array(
                        'title' => 'Automatic Scourint - Age of Empires II: Definitive Edition Quality of Life',
                        'url' => '#l2pThumb2',
                        'img' => 'https://images.gamewatcherstatic.com/screenshot/image/5/10/142195/43703801.jpg'
                    ),
                    array(
                        'title' => 'Automatic Farm Reseeding - Age of Empires II: Definitive Edition Quality of Life',
                        'url' => '#l2pThumb3',
                        'img' => 'https://images.gamewatcherstatic.com/screenshot/image/5/10/142195/43703801.jpg'
                    )
                );
            ?>

            <ul class="learn-to-play-section__thumbnails">
                @foreach ($l2p_thumbs as $thumb)
                    <li class="learn-to-play-section__video">
                        <a class="learn-to-play-section__link" href="{{$thumb['url']}}">
                            <img src="{{$thumb['img']}}" />
                            {{icon('play','play-icon')}}
                            <h4 class="learn-to-play-section__video__title">
                                {{-- span is needed to control max number of rows --}}
                                <span>{{$thumb['title']}}</span>
                            </h4>
                        </a>
                    </li>
                @endforeach
            </ul>
            
        </div>
    </div>
</section>


