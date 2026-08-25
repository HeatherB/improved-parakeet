@forelse($defaults[0]['posts'] as $post)
    @if($post['headline'] == 'Age of Empires III: Definitive Edition')
        <?php 
            $anchor_create = str_replace(':','',$post['headline']);
            $anchor_identifier = str_replace(' ','_',$anchor_create);
        ?>
    <span id="{{$anchor_identifier}}" class="jump_nav"></span>
    <div class="section--divider-aztec-mid section--padding">
        <div class="row">
            <div class="frame-box">
                <div class="buy-now__default frame-box__inner frame-box__inner--dark">
                    <div class="buy-now__game-title">
                        <h2 class="buy-now--h2">{{$post['headline']}}</h2>
                    </div>
                    <div class="buy-now__white-bg clearfix">
                        <div class="buy-now__white-bg-inner">
                            <div class="buy-now__game-img hide-for-small-only">
                                <div class="frame-box">
                                    <img src="{{$post['featured_image_url']}}">
                                </div>
                            </div>
                            <div class="buy-now__content">
                                <div class="buy-now__inner">
                                    <div class="buy-now__desc">
                                        <div class="show-for-small-only buy-now__mobile-img">
                                            <div class="frame-box">
                                                <img src="{{$post['featured_image_url']}}">
                                            </div>
                                        </div>
                                        <div class="buy-now__mobile-buttons">
                                            <div class="buy-now__buttons-wrap">          
                                                @if($post['lg_featured_img_gear_shop_btn'])
                                                    <a href="{{ $post['lg_featured_img_gear_shop_btn'] }}" target="_blank" class="btn-aoe btn-aoe--small btn-aoe--dark btn-aoe--image btn-aoe--image-lg">
                                                        <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="Xbox Gear Shop: Age of Empires" />
                                                    </a>        
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
                                        <div class="buy-now__desc buy-now__desc-small">
                                            {!! $post['description'] !!}
                                            <div>
                                                @if($post['minimum_system_requirements'])
                                                    <hr />
                                                    <h4>Minimum System Requirements</h4>
                                                    {!! $post['minimum_system_requirements'] !!}
                                                @endif
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="buy-now__buttons">
                                <div class="buy-now__buttons-wrap">
                                    @if($post['lg_featured_img_gear_shop_btn'])
                                        <a href="{{ $post['lg_featured_img_gear_shop_btn'] }}" target="_blank" class="btn-aoe btn-aoe--dark btn-aoe--image btn-aoe--image-lg">
                                            <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="Xbox Gear Shop: Age of Empires" />
                                        </a>        
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
                                <div class="buy-now__buttons-wrap-tablet">
                                    @if($post['lg_featured_img_gear_shop_btn'])
                                        <a href="{{ $post['lg_featured_img_gear_shop_btn'] }}" target="_blank" class="btn-aoe btn-aoe--dark btn-aoe--image btn-aoe--image-lg">
                                            <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="Xbox Gear Shop: Age of Empires" />
                                        </a>        
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

                    <!-- implanted piece goes here -->
                    @forelse($defaults[0]['posts'] as $post)
                     @if($post['headline'] == 'Age of Empires III: DE – United States Civilization')
                    


                    <span id="Age_of_Empires_III_DE__United_States_Civilization" class="jump_nav"></span>
                    <div class="frame-box inter_inter">
                        <div class="buy-now__default frame-box__inner frame-box__inner--dark">
                            <div class="buy-now__game-title">
                                <h2 class="buy-now--h2">{{$post['headline']}}</h2>
                            </div>
                            <div class="buy-now__white-bg clearfix">
                                <div class="buy-now__white-bg-inner">
                                    <div class="buy-now__game-img hide-for-small-only">
                                        <div class="frame-box">
                                            <img src="{{$post['featured_image_url']}}">
                                        </div>
                                    </div>
                                    <div class="buy-now__content">
                                        <div class="buy-now__inner">
                                            <div class="buy-now__desc">
                                                <div class="show-for-small-only buy-now__mobile-img">
                                                    <div class="frame-box">
                                                        <img src="{{$post['featured_image_url']}}">
                                                    </div>
                                                </div>
                                                <div class="buy-now__mobile-buttons">
                                                    <div class="buy-now__buttons-wrap">
                                                        @if($post['lg_featured_img_gear_shop_btn'])
                                                        <a href="{{ $post['lg_featured_img_gear_shop_btn'] }}" target="_blank" class="btn-aoe btn-aoe--small btn-aoe--dark btn-aoe--image btn-aoe--image-lg">
                                                            <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="Xbox Gear Shop: Age of Empires" />
                                                        </a>        
                                                        @endif

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
                                                            <a data-product-id="{{$post['windows_product_id']}}" data-product-url="{{$post['windows']}}" href="javascript:void(0)" class="btn-aoe btn-aoe--dark btn-aoe--image btn-microsoft">
                                                                <img src="@asset('images/button-gamepass-white-buynow.svg')" alt="{{$post['headline']}} on Xbox Game Pass" />
                                                            </a>
                                                            @endif

                                                        <a href="javascript:void(0)" data-product-id="{{$post['windows_product_id']}}" data-product-url="{{$post['windows']}}" class="btn-aoe btn-aoe--dark btn-aoe--image btn-microsoft">    
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
                                                <div class="buy-now__desc buy-now__desc-small">
                                                    {!! $post['description'] !!}
                                                    <div>
                                                    @if($post['minimum_system_requirements'])
                                                        <hr />
                                                        <h4>Minimum System Requirements</h4>
                                                        {!! $post['minimum_system_requirements'] !!}
                                                    @endif
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="buy-now__buttons">
                                        <div class="buy-now__buttons-wrap">
                                            @if($post['lg_featured_img_gear_shop_btn'])
                                            <a href="{{ $post['lg_featured_img_gear_shop_btn'] }}" target="_blank" class="btn-aoe btn-aoe--dark btn-aoe--image btn-aoe--image-lg">
                                                <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="Xbox Gear Shop: Age of Empires" />
                                            </a>        
                                            @endif

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
                                        <div class="buy-now__buttons-wrap-tablet">
                                            @if($post['lg_featured_img_gear_shop_btn'])
                                            <a href="{{ $post['lg_featured_img_gear_shop_btn'] }}" target="_blank" class="btn-aoe btn-aoe--dark btn-aoe--image btn-aoe--image-lg">
                                                <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="Xbox Gear Shop: Age of Empires" />
                                            </a>        
                                            @endif  

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
                        </div>
                    </div>




                    @endif    
                    @empty
                    @endforelse
                    <!-- end impnated piece -->
                    
                </div>
            </div>

        </div>
    </div>

     @endif
@empty
@endforelse

@forelse($defaults[0]['posts'] as $post)
@if($post['headline'] == 'Age of Empires II: Definitive Edition')
    <?php 
        $anchor_create = str_replace(':','',$post['headline']);
        $anchor_identifier = str_replace(' ','_',$anchor_create);
    ?>
    <span id="{{$anchor_identifier}}" class="jump_nav"></span>
    <div class="section--divider-aztec-mid section--padding">
       <div class="row">
          <div class="frame-box">
             <div class="buy-now__default frame-box__inner frame-box__inner--dark">
                <div class="buy-now__game-title">
                   <h2 class="buy-now--h2">{{$post['headline']}}</h2>
                </div>
                <div class="buy-now__white-bg clearfix">
                   <div class="buy-now__white-bg-inner">
                      <div class="buy-now__game-img hide-for-small-only">
                         <div class="frame-box">
                            <img src="{{$post['featured_image_url']}}">
                            <div class="included_expansions">
                               @if($post['expansions']['posts'])
                               <h4>Includes:</h4>
                               @forelse($post['expansions']['posts'] as $expansion)
                               <div class="buy-now__exp">
                                  <div class="buy-now__exp-img">
                                     <div class="frame-box">
                                        <img src="{{$expansion['featured_image_url']}}">
                                     </div>
                                  </div>
                               </div>
                               @empty
                               @endforelse
                               @endif
                            </div>
                         </div>
                      </div>
                      <div class="buy-now__content">
                         <div class="buy-now__inner">
                            <div class="buy-now__desc">
                               <div class="show-for-small-only buy-now__mobile-img">
                                  <div class="frame-box">
                                     <img src="{{$post['featured_image_url']}}">
                                  </div>
                               </div>
                               <div class="buy-now__mobile-buttons">
                                  <div class="buy-now__buttons-wrap">
                                    @if($post['lg_featured_img_gear_shop_btn'])
                                        <a href="{{ $post['lg_featured_img_gear_shop_btn'] }}" target="_blank" class="btn-aoe btn-aoe--small btn-aoe--dark btn-aoe--image btn-aoe--image-lg">
                                            <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="Xbox Gear Shop: Age of Empires" />
                                        </a>        
                                    @endif
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
                                            <a data-product-id="{{$post['windows_product_id']}}" data-product-url="{{$post['windows']}}" href="javascript:void(0)" class="btn-aoe btn-aoe--dark btn-aoe--image btn-microsoft">
                                                <img src="@asset('images/button-gamepass-white-buynow.svg')" alt="{{$post['headline']}} on Xbox Game Pass" />
                                            </a>
                                        @endif

                                     <a href="javascript:void(0)" data-product-id="{{$post['windows_product_id']}}" data-product-url="{{$post['windows']}}" class="btn-aoe btn-aoe--dark btn-aoe--image btn-microsoft">    
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
                                <div class="included_expansions show-for-small-only">
                                   @if($post['expansions']['posts'])
                                   <h4>Includes:</h4>
                                   @forelse($post['expansions']['posts'] as $expansion)
                                   <div class="buy-now__exp">
                                      <div class="buy-now__exp-img">
                                         <div class="frame-box">
                                            <img src="{{$expansion['featured_image_url']}}">
                                         </div>
                                      </div>
                                   </div>
                                   @empty
                                   @endforelse
                                   @endif
                                </div>
                               <div class="buy-now__desc buy-now__desc-small">
                                  {!! $post['description'] !!}
                                  <div>
                                     @if($post['minimum_system_requirements'])
                                     <hr />
                                     <h4>Minimum System Requirements</h4>
                                     {!! $post['minimum_system_requirements'] !!}
                                     @endif
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                      <div class="buy-now__buttons">
                         <div class="buy-now__buttons-wrap">
                            @if($post['lg_featured_img_gear_shop_btn'])
                                <a href="{{ $post['lg_featured_img_gear_shop_btn'] }}" target="_blank" class="btn-aoe btn-aoe--dark btn-aoe--image btn-aoe--image-lg">
                                    <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="Xbox Gear Shop: Age of Empires" />
                                </a>        
                            @endif
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
                         <div class="buy-now__buttons-wrap-tablet">
                            @if($post['lg_featured_img_gear_shop_btn'])
                                <a href="{{ $post['lg_featured_img_gear_shop_btn'] }}" target="_blank" class="btn-aoe btn-aoe--dark btn-aoe--image btn-aoe--image-lg">
                                    <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="Xbox Gear Shop: Age of Empires" />
                                </a>        
                            @endif     
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

                @forelse($defaults[0]['posts'] as $post)
                @if($post['headline'] == 'Pre-Order Now: Lords of the West')
                <?php 

                    $post_id = $post['post_ID'];

                    /*** Change Content on Timer ***/
                    $schedule_update_y_or_n = get_field('schedule_update_y_or_n', $post_id);
                    $change_content_on_date_buy_now = $post['change_content_on_date_buy_now'];  
                    
                    $futureDateTime = new DateTime($change_content_on_date_buy_now);

                    if($futureDateTime) {
                        $currentDateTime = new DateTime();
    
                        //Format them into a Unix timestamp
                        $futureTimestamp = $futureDateTime->format('U');
                        $currentTimestamp = $currentDateTime->format('U');   
                    }

                     /*** Variable Assignment ***/                    
                    // If alernate headline exists then reassign $headline to it
                    // or keep original $headline 
                    // (default title, AKA headline, built into all WP posts and custom post types)
                    $headline = (!empty($post['alternate_headline'])) ? $post['alternate_headline'] : $post['headline'];

                    $anchor_create = str_replace(':','', $headline);
                    $anchor_identifier = str_replace([' ', '-'],['_', ''],$anchor_create);  
    
                    $featured_image_url = $post['featured_image_url'];
                    $lg_featured_img_gear_shop_btn = $post['lg_featured_img_gear_shop_btn'];                    
                    $pre_order = $post['pre_order'];
                    $amazon = $post['amazon'];
                    $gamestop = $post['gamestop'];
                    $windows = $post['windows'];
                    $windows_product_id = $post['windows_product_id'];
                    $include_xbox_game_pass_btn = $post['include_xbox_game_pass_btn'];
                    $steam = $post['steam'];
                    $description = $post['description'];
                    $minimum_system_requirements = $post['minimum_system_requirements'];

                    /*** 
                    Variable Reassignment if $futureDateTime is greater than 
                    or equal to $futureDateTime so that variables
                    show the timed release values.
                    ***/
                    if($schedule_update_y_or_n && $futureTimestamp >= $currentTimestamp) {

                        $headline = get_field('timed_headline_buy_now', $post_id); 
                        $anchor_create = str_replace(':','', $headline);
                        $anchor_identifier = str_replace([' ', '-'],['_', ''],$anchor_create);  

                        // Featured image URL
                        $timed_feature_image_acf = get_field('timed_featured_image', $post_id);
                        $featured_image_url = esc_url($timed_feature_image_acf['url']);

                        $lg_featured_img_gear_shop_btn = get_field('timed_lg_featured_img_gear_shop_btn', $post_id);

                        $pre_order = get_field('timed_pre_order', $post_id);
                        $amazon = get_field('timed_amazon', $post_id);
                        $gamestop = get_field('timed_gamestop', $post_id);
                        $windows = get_field('timed_windows_url', $post_id);
                        $windows_product_id = get_field('timed_windows_product_id', $post_id);

                        $timed_include_xbox_game_pass_btn_acf_field = get_field('timed_include_xbox_game_pass_btn', $post_id);
                        $include_xbox_game_pass_btn = (!empty($timed_include_xbox_game_pass_btn_acf_field)) ? true : false;  

                        $steam = get_field('timed_steam', $post_id);
                        
                        $description = get_field('timed_content', $post_id);
                        $minimum_system_requirements = get_field('timed_minimum_system_requirements', $post_id);
                    }    
                ?>       
                    <span id="{{$anchor_identifier}}" class="jump_nav"></span>
                    <div class="frame-box inter_inter">
                    <div class="buy-now__default frame-box__inner frame-box__inner--dark">
                        <div class="buy-now__game-title">
                            <h2 class="buy-now--h2">{{$headline}}</h2>
                        </div>
                        <div class="buy-now__white-bg clearfix">
                            <div class="buy-now__white-bg-inner">
                                <div class="buy-now__game-img hide-for-small-only">
                                <div class="frame-box">
                                    <img src="{{$featured_image_url}}">
                                </div>
                                </div>
                                <div class="buy-now__content">
                                <div class="buy-now__inner">
                                    <div class="buy-now__desc">
                                        <div class="show-for-small-only buy-now__mobile-img">
                                            <div class="frame-box">
                                                <img src="{{$featured_image_url}}">
                                            </div>
                                        </div>
                                        <div class="buy-now__mobile-buttons">
                                            <div class="buy-now__buttons-wrap">
                                                @if($lg_featured_img_gear_shop_btn)
                                                    <a href="{{$lg_featured_img_gear_shop_btn}}" target="_blank" class="btn-aoe btn-aoe--small btn-aoe--dark btn-aoe--image btn-aoe--image-lg">
                                                        <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="Xbox Gear Shop: Age of Empires" />
                                                    </a>        
                                                @endif  
                                                @if($pre_order)
                                                    <a href="{{$pre_order}}" class="btn-aoe btn-aoe--small btn-aoe--dark btn-aoe--image">Pre-order Now</a>
                                                @endif
                                                @if($amazon)
                                                    <a href="{{$amazon}}" class="btn-aoe btn-aoe--small btn-aoe--dark btn-aoe--image">
                                                        <img src="@asset('images/amazon.svg')" alt="{{$headline}} on Amazon" />
                                                    </a>
                                                @endif
                                                @if($gamestop)
                                                    <a href="{{$gamestop}}" class="btn-aoe btn-aoe--small btn-aoe--dark btn-aoe--image">
                                                        <img src="@asset('images/gamestop.svg')" alt="{{$headline}} at GameStop" />
                                                    </a>
                                                @endif
                                                @if($windows)
                                                    @if($include_xbox_game_pass_btn) 
                                                        <a href="javascript:void(0)" data-product-id="{{$windows_product_id}}" data-product-url="{{$windows}}" class="btn-aoe btn-aoe--dark btn-aoe--image btn-microsoft">    
                                                            <img src="@asset('images/button-gamepass-white-buynow.svg')" alt="{{$headline}} on Xbox Game Pass" />
                                                        </a>
                                                    @endif
                                                    <a href="javascript:void(0)" data-product-id="{{$windows_product_id}}" data-product-url="{{$windows}}" class="btn-aoe btn-aoe--dark btn-aoe--image btn-microsoft">    
                                                        <img src="@asset('images/button-microsoft-store.png')" alt="{{$headline}} on Windows" />
                                                    </a>
                                                @endif
                                                @if($steam)
                                                    <a href="{{$steam}}" class="btn-aoe btn-aoe--small btn-aoe--dark btn-aoe--image">
                                                        <img src="@asset('images/steam.svg')" alt="{{$headline}} on Steam" />
                                                    </a>
                                                @endif
                                            </div>
                                        </div>
                                        <div class="buy-now__desc buy-now__desc-small">
                                            {!! $description !!}
                                            <hr />
                                            <h4>Minimum System Requirements</h4>
                                            {!! $minimum_system_requirements !!}
                                            <div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                <div class="buy-now__buttons">
                                <div class="buy-now__buttons-wrap">
                                    @if($lg_featured_img_gear_shop_btn)
                                        <a href="{{$lg_featured_img_gear_shop_btn}}" target="_blank" class="btn-aoe btn-aoe--dark btn-aoe--image btn-aoe--image-lg">
                                            <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="Xbox Gear Shop: Age of Empires" />
                                        </a>        
                                    @endif 
                                    @if($pre_order)
                                        <a href="{{$pre_order}}" class="btn-aoe btn-aoe--dark btn-aoe--image">Pre-order Now</a>
                                    @endif
                                    @if($amazon)
                                        <a href="{{$amazon}}" class="btn-aoe btn-aoe--dark btn-aoe--image">
                                            <img src="@asset('images/amazon.svg')" alt="{{$headline}} on Amazon" />
                                        </a>
                                    @endif
                                    @if($gamestop)
                                        <a href="{{$gamestop}}" class="btn-aoe btn-aoe--dark btn-aoe--image">
                                            <img src="@asset('images/gamestop.svg')" alt="{{$headline}} at GameStop" />
                                        </a>
                                    @endif
                                    @if($windows)
                                        @if($include_xbox_game_pass_btn) 
                                            <a href="javascript:void(0)" data-product-id="{{$windows_product_id}}" data-product-url="{{$windows}}" class="btn-aoe btn-aoe--dark btn-aoe--image btn-context-store btn-microsoft">    
                                                <img src="@asset('images/button-gamepass-white-buynow.svg')" alt="{{$headline}} on Xbox Game Pass" />
                                            </a>
                                        @endif
                                        <a data-product-id="{{$windows_product_id}}" data-product-url="{{$windows}}" href="javascript:void(0)" class="btn-aoe btn-aoe--dark btn-aoe--image btn-context-store btn-microsoft">    
                                            <img src="@asset('images/button-microsoft-store.png')" alt="{{$headline}} on Windows" />
                                        </a>
                                    @endif
                                    @if($steam)
                                        <a href="{{$steam}}" class="btn-aoe btn-aoe--dark btn-aoe--image">
                                            <img src="@asset('images/steam.svg')" alt="{{$headline}} on Steam" />
                                        </a>
                                    @endif
                                </div>
                                <div class="buy-now__buttons-wrap-tablet">
                                    @if($lg_featured_img_gear_shop_btn)
                                        <a href="{{$lg_featured_img_gear_shop_btn}}" target="_blank" class="btn-aoe btn-aoe--dark btn-aoe--image btn-aoe--image-lg">
                                            <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="Xbox Gear Shop: Age of Empires" />
                                        </a>        
                                    @endif 
                                    @if($pre_order)
                                        <a href="{{$pre_order}}" class="btn-aoe btn-aoe--dark btn-aoe--image">Pre-order Now</a>
                                    @endif
                                    @if($amazon)
                                        <a href="{{$amazon}}" class="btn-aoe btn-aoe--dark btn-aoe--image">
                                            <img src="@asset('images/amazon.svg')" alt="{{$headline}} on Amazon" />
                                        </a>
                                    @endif
                                    @if($gamestop)
                                        <a href="{{$gamestop}}" class="btn-aoe btn-aoe--dark btn-aoe--image">
                                            <img src="@asset('images/gamestop.svg')" alt="{{$headline}} at GameStop" />
                                        </a>
                                    @endif
                                    @if($windows)
                                        @if($include_xbox_game_pass_btn) 
                                            <a href="javascript:void(0)" data-product-id="{{$windows_product_id}}" data-product-url="{{$windows}}" class="btn-aoe btn-aoe--dark btn-aoe--image btn-context-store btn-microsoft">    
                                                <img src="@asset('images/button-gamepass-white-buynow.svg')" alt="{{$headline}} on Xbox Game Pass" />
                                            </a>
                                        @endif
                                        <a data-product-id="{{$windows_product_id}}" data-product-url="{{$windows}}" href="javascript:void(0)" class="btn-aoe btn-aoe--dark btn-aoe--image btn-context-store btn-microsoft">    
                                            <img src="@asset('images/button-microsoft-store.png')" alt="{{$headline}} on Windows" />
                                        </a>
                                    @endif
                                    @if($steam)
                                        <a href="{{$steam}}" class="btn-aoe btn-aoe--dark btn-aoe--image">
                                            <img src="@asset('images/steam.svg')" alt="{{$headline}} on Steam" />
                                        </a>
                                    @endif                                    
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                @endif    
                @empty
                @endforelse

             </div>
          </div>
       </div>
    </div>
    
@endif
@empty
@endforelse

@forelse($defaults[0]['posts'] as $post)
@if(($post['headline'] != 'Age of Empires III: Definitive Edition') && ($post['headline'] != 'Age of Empires II: Definitive Edition') && ($post['headline'] != 'Pre-Order Now: Lords of the West') && ($post['headline'] != 'Age of Empires III: DE – United States Civilization'))
    <?php 
        $anchor_create = str_replace(':','',$post['headline']);
        $anchor_identifier = str_replace(' ','_',$anchor_create);
    ?>
    <span id="{{$anchor_identifier}}" class="jump_nav"></span>
    <div class="section--divider-aztec-mid section--padding">
        <div class="row">
            <div class="frame-box">
                <div class="buy-now__default frame-box__inner frame-box__inner--dark">
                    <div class="buy-now__game-title">
                        <h2 class="buy-now--h2">{{$post['headline']}}</h2>
                    </div>
                    <div class="buy-now__white-bg clearfix">
                        <div class="buy-now__white-bg-inner">
                            <div class="buy-now__game-img hide-for-small-only">
                                <div class="frame-box">
                                    <img src="{{$post['featured_image_url']}}">
                                </div>
                            </div>
                            <div class="buy-now__content">
                                <div class="buy-now__inner">
                                    <div class="buy-now__desc">
                                        <div class="show-for-small-only buy-now__mobile-img">
                                            <div class="frame-box">
                                                <img src="{{$post['featured_image_url']}}">
                                            </div>
                                        </div>
                                        <div class="buy-now__mobile-buttons">
                                            <div class="buy-now__buttons-wrap">
                                                @if($post['lg_featured_img_gear_shop_btn'])
                                                    <a href="{{$post['lg_featured_img_gear_shop_btn']}}" target="_blank" class="btn-aoe btn-aoe--small btn-aoe--dark btn-aoe--image btn-aoe--image-lg">
                                                        <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="Xbox Gear Shop: Age of Empires" />
                                                    </a>        
                                                @endif 
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
                                                        <a data-product-id="{{$post['windows_product_id']}}" data-product-url="{{$post['windows']}}" href="javascript:void(0)" class="btn-aoe btn-aoe--dark btn-aoe--image btn-microsoft">
                                                            <img src="@asset('images/button-gamepass-white-buynow.svg')" alt="{{$post['headline']}} on Xbox Game Pass" />
                                                        </a>
                                                    @endif

                                                    <a href="javascript:void(0)" data-product-id="{{$post['windows_product_id']}}" data-product-url="{{$post['windows']}}" class="btn-aoe btn-aoe--dark btn-aoe--image btn-microsoft">    
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
                                        <div class="buy-now__desc buy-now__desc-small">
                                            {!! $post['description'] !!}
                                            <div>
                                                @if($post['minimum_system_requirements'])
                                                    <hr />
                                                    <h4>Minimum System Requirements</h4>
                                                    {!! $post['minimum_system_requirements'] !!}
                                                @endif
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="buy-now__buttons">
                                <div class="buy-now__buttons-wrap">
                                    @if($post['lg_featured_img_gear_shop_btn'])
                                        <a href="{{$post['lg_featured_img_gear_shop_btn']}}" target="_blank" class="btn-aoe btn-aoe--dark btn-aoe--image btn-aoe--image-lg">
                                            <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="Xbox Gear Shop: Age of Empires" />
                                        </a>        
                                    @endif 
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
                                <div class="buy-now__buttons-wrap-tablet">
                                    @if($post['lg_featured_img_gear_shop_btn'])
                                        <a href="{{$post['lg_featured_img_gear_shop_btn']}}" target="_blank" class="btn-aoe btn-aoe--dark btn-aoe--image btn-aoe--image-lg">
                                            <img src="@asset('images/btn/button-gearshop-white-buynow-tall.svg')" alt="Xbox Gear Shop: Age of Empires" />
                                        </a>        
                                    @endif 
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
     @endif

@empty
@endforelse