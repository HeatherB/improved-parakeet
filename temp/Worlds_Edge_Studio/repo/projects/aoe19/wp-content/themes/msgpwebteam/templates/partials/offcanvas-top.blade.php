<div class="off-canvas-wrapper">
    <div class="off-canvas position-left background--rock" id="offCanvasLeft" data-off-canvas data-transition="overlap">
        <div class="off-canvas__inner">
            <div class="off-canvas-close-button"><span class="close-button close-button-offcanvas close-button--vertical-align-center" data-close></span></div>
            <div class="frame-box">
                <div class="frame-box__inner frame-box__inner--light">
                    <div class="mobile-menu-logo">
                        <a href="/"><img src="@asset('images/aoe_logo_horizontal.png')" /></a>
                    </div>
                    <div class="mobile-menu">
                        <div class="mobile-menu__wrapper">
                            @if (get_the_title() == 'Age of Empires: Definitive Edition' && has_nav_menu('beta_signup'))
                                {!!
                                wp_nav_menu(
                                        [
                                                'theme_location' => 'beta_signup',
                                                'items_wrap' => '<ul class="menu vertical mobile-menu__ul" data-accordion-menu>%3$s</ul>',
                                                'container' => false,
                                                'link_before' => '<span>',
                                                'link_after'  => '</span>',
                                                'walker' => new My_Mobile_Walker_Nav_Menu()
                                        ]
                                )
                                !!}
                            @elseif(has_nav_menu('primary_navigation'))
                                {!!
                                  wp_nav_menu(
                                    [
                                      'theme_location' => 'primary_navigation',
                                      'items_wrap' => '<ul class="menu vertical mobile-menu__ul" data-accordion-menu>%3$s</ul>',
                                      'container' => false,
                                      'link_before' => '<span>',
                                      'link_after'  => '</span>',
                                      'walker' => new My_Mobile_Walker_Nav_Menu()
                                    ]
                                  )
                                !!}
                            @endif
                        </div>
                    </div>
                </div>
            </div>
            @if (is_user_logged_in() )
                <div class="frame-box">
                    <div class="frame-box__inner frame-box__inner--light">
                        <a class="menu__avatar" href="#">
                            <a class="btn-aoe btn-aoe--large" href="">Log Out</a>
                        </a>
                    </div>
                </div>
            @endif
        </div>
    </div>
    <div class="off-canvas-content" data-off-canvas-content>