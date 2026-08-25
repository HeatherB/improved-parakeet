@forelse($featured[0]['posts'] as $post)
    <?php 
        $anchor_create = str_replace(':','',$post['headline']);
        $anchor_identifier = str_replace(' ','_',$anchor_create);
    ?>
    <span id="{{$anchor_identifier}}" class="jump_nav"></span>
    <div class="section--divider-aztec-mid section--padding">
        <div class="row">
            {{--
            If "Featured Image Size" radio btn selected as "Large Size"
            on desktops image on left side will be larger.
            --}}
            <div class="buy-now--first buy-now--featured frame-box" data-gamename="{{$anchor_identifier}}">
                <div class="buy-now--no-exp frame-box__inner frame-box__inner--dark">
                    <div class="buy-now__title-wrapper">
                        <div class="buy-now__game-title<?php echo ($post['featured_img_size'] === 'lg_size') ? ' buy-now__game-title-feat-img-lg-size' : ''; ?>">
                            <h3 class="buy-now--h3">{{$post['headline']}}</h3>
                        </div>
                    </div>
                    <div class="buy-now__white-bg clearfix">
                        <div class="buy-now__white-bg-inner<?php echo ($post['featured_img_size'] === 'lg_size') ? ' buy-now__white-bg-inner-img-lg-size' : ''; ?>">
                            <div class="buy-now__game-img<?php echo ($post['featured_img_size'] === 'lg_size') ? ' buy-now__game-img-lg-size' : ''; ?>">
                                <div class="buy-now__feat-img<?php echo ($post['featured_img_size'] === 'lg_size') ? ' buy-now__feat-img-wrapper-lg-size' : ''; ?>">
                                    <div class="frame-box">
                                        <img src="{{$post['featured_image_url']}}" class="<?php echo ($post['featured_img_size'] === 'lg_size') ? ' buy-now__feat-img-lg-size' : ''; ?>">
                                    </div>
                                </div>
                                <div class="buy-now__mobile-buttons">
                                    <div class="buy-now__buttons-wrap">
                                        @if($post['pre_order'])
                                            <a href="{{$post['pre_order']}}" class="btn-aoe btn-aoe--small btn-aoe--dark btn-aoe--image">Pre-order Now</a>
                                        @endif
                                        @if($post['amazon'])
                                            <a href="{{$post['amazon']}}" class="btn-aoe btn-aoe--small btn-aoe--dark btn-aoe--image">
                                                <img src="@asset('images/amazon.svg')" alt="Get {{$post['headline']}} on Amazon" />
                                            </a>
                                        @endif
                                        @if($post['gamestop'])
                                            <a href="{{$post['gamestop']}}" class="btn-aoe btn-aoe--small btn-aoe--dark btn-aoe--image">
                                                <img src="@asset('images/gamestop.svg')" alt="Get {{$post['headline']}} at GameStop" />
                                            </a>
                                        @endif
                                        @if($post['windows'])

                                            @if($post['include_xbox_game_pass_btn'])
                                                <a data-product-id="{{$post['windows_product_id']}}" data-product-url="{{$post['windows']}}" href="javascript:void(0)" class="btn-aoe btn-aoe--dark btn-aoe--image btn-context-store btn-microsoft">
                                                    <img src="@asset('images/button-gamepass-white-buynow.svg')" alt="{{$post['headline']}} on Xbox Game Pass" />
                                                </a>
                                            @endif

                                            <a data-product-id="{{$post['windows_product_id']}}" data-product-url="{{$post['windows']}}" href="javascript:void(0)" class="btn-aoe btn-aoe--dark btn-aoe--image btn-context-store btn-microsoft">
                                                <img src="@asset('images/button-microsoft-store.png')" alt="Get {{$post['headline']}} on Windows" />
                                            </a>
                                        @endif
                                        @if($post['steam'])
                                            <a href="{{$post['steam']}}" class="btn-aoe btn-aoe--small btn-aoe--dark btn-aoe--image">
                                                <img src="@asset('images/steam.svg')" alt="Get {{$post['headline']}} on Steam" />
                                            </a>
                                        @endif
                                    </div>
                                </div>
                            </div>
                            <div class="buy-now__content<?php echo ($post['featured_img_size'] === 'lg_size') ? ' buy-now__content-feat-img-lg-size' : ''; ?>">
                                <div class="buy-now__inner<?php echo ($post['featured_img_size'] === 'lg_size') ? ' buy-now__inner-feat-img-lg-size' : ''; ?>">
                                    <div class="buy-now__desc">
                                         {!! $post['description'] !!}
                                        @if($post['lg_featured_img_gear_shop_btn'])
                                            <p class="buy-now__buttons-wrap buy-now__buttons-wrap-feat-btns-img-lg-size">
                                                <a href="{{ $post['lg_featured_img_gear_shop_btn'] }}" target="_blank" class="btn-aoe btn-aoe btn-aoe--small btn-aoe--dark btn-aoe--image">

                                                    <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="{{$post['headline']}}" />

                                                </a>        
                                            </p>    
                                        @endif
                                        @if($post['minimum_system_requirements'])
                                            <hr />
                                            <h4>Minimum System Requirements</h4>
                                            {!! $post['minimum_system_requirements'] !!}
                                        @endif
                                    </div>
                                </div>
                            </div>
                            <div class="buy-now__buttons">
                                <div class="buy-now__buttons-wrap">
                                    @if($post['pre_order'])
                                        <a href="{{$post['pre_order']}}" class="btn-aoe btn-aoe--dark btn-aoe--image">Pre-order Now</a>
                                    @endif
                                    @if($post['amazon'])
                                        <a href="{{$post['amazon']}}" class="btn-aoe btn-aoe--dark btn-aoe--image">
                                            <img src="@asset('images/amazon.svg')" alt="Get {{$post['headline']}} on Amazon" />
                                        </a>
                                    @endif
                                    @if($post['gamestop'])
                                        <a href="{{$post['gamestop']}}" class="btn-aoe btn-aoe--dark btn-aoe--image">
                                            <img src="@asset('images/gamestop.svg')" alt="Get {{$post['headline']}} at GameStop" />
                                        </a>
                                    @endif
                                    @if($post['windows'])

                                        @if($post['include_xbox_game_pass_btn'])
                                            <a data-product-id="{{$post['windows_product_id']}}" data-product-url="{{$post['windows']}}" href="javascript:void(0)" class="btn-aoe btn-aoe--dark btn-aoe--image btn-context-store btn-microsoft">
                                                <img src="@asset('images/button-gamepass-white-buynow.svg')" alt="{{$post['headline']}} on Xbox Game Pass" />
                                            </a>
                                        @endif

                                        <a data-product-id="{{$post['windows_product_id']}}" data-product-url="{{$post['windows']}}" href="javascript:void(0)" class="btn-aoe btn-aoe--dark btn-aoe--image btn-context-store btn-microsoft">
                                            <img src="@asset('images/button-microsoft-store.png')" alt="Get {{$post['headline']}} on Windows" />
                                        </a>
                                    @endif
                                    @if($post['steam'])
                                        <a href="{{$post['steam']}}" class="btn-aoe btn-aoe--dark btn-aoe--image">
                                            <img src="@asset('images/steam.svg')" alt="Get {{$post['headline']}} on Steam" />
                                        </a>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="buy-now__footer clearfix">
                        @if($post['expansions']['posts'])
                        <div class="buy-now__exp-header">
                            <h3 class="buy-now--h3">Expansions</h3>
                        </div>
                        <div class="buy-now__game-expansions">
                                @forelse($post['expansions']['posts'] as $expansion)
                                    <div class="buy-now__exp">
                                        <div class="buy-now__exp-img">
                                            <div class="frame-box">
                                                <img src="{{$expansion['featured_image_url']}}">
                                            </div>
                                        </div>
                                        <div class="buy-now__exp-content buy-now__desc">
                                            <p><strong>{{$expansion['headline']}}</strong></p>
                                            <p>{{$expansion['description']}}</p>
                                        </div>
                                    </div>
                                @empty
                                @endforelse
                        </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@empty
@endforelse