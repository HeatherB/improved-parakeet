{{-- global header and nav --}}

<div class="breakpoint-indicator visually-hidden"></div>

<div id="stickyHeader">
    <header class="header">
        <div class="content-container content-container--header">
            <h1 class="site-title header__block">
                <a class="home-link" href="{{ get_site_url() }}">
                    <img class="header__logo" src="@asset('images/header-logo.png')" alt="Age of Empires Home" />
                </a>
            </h1>

            <div class="header__info header__block">
                <div class="header__search js-search">
                    <form class="header__search__form" action="{{ get_site_url() }}">
                        <label class="visually-hidden" for="s">
                        Search
                        </label>

                        <input class="header__search__form__input js-typahead" placeholder="Search" id="search-input" type="text" name="s">

                        <button type="submit" class="header__search__form__submit" name="search-submit">
                            <i class="icon_search"><span class="visually-hidden">
                               Submit Search
                            </span></i>
                        </button>
                    </form>

                    <button class="header__search__toggle js-search-toggle">
                        <span class="visually-hidden">
                            Open Search
                        </span>
                    </button>

                </div>

                @include('partials.social-links')
            </div>
            
            <div class="header__profile js-profile @if( is_user_logged_in() )is-logged-in @endif">
                @if (is_user_logged_in() )
                    <?php 
                        $userId = get_current_user_id();
                        $user = get_userdata($userId);
                        $gamertag = get_user_meta($userId, 'msa_modern_gamertag', true) ?? get_user_meta($userId, 'msa_gt', true);
                        $clanAssoc = get_user_meta($userId, 'clan_assoc', true);

                        $nameDisplay = "";

                        if(!empty($gamertag)) {
                            $nameDisplay = $gamertag;
                        } else if(!empty($user->display_name)) {
                            $nameDisplay = $user->display_name;
                        } else if (!empty($user->user_nicename)) {
                            $nameDisplay = $user->user_nicename;
                        } else {
                            $nameDisplay = "Welcome";
                        } 
                    ?>

                    <div class="header__profile__menu__toggle js-profile-toggle">

                        <a class="header__profile__avatar header__link js-profile-link" href="/profile">
                            {!! get_avatar($userId) !!}
                            <span class="header__profile__username">{{$nameDisplay}}</span>
                        </a> 

                        <ul class="menu header__profile__menu">
                            <li class="menu__item">
                                <a href="/profile" class="menu__item__label">
                                    My Profile   
                                </a>
                            </li>
                            <li class="menu__item">
                                <a href="/stats" class="menu__item__label">
                                    My Stats    
                                </a>
                            </li>
                            @if(!empty($clanAssoc))
                                <li class="menu__item">
                                    <a href="{{get_bloginfo('url')}}/clans/details/{{$clanAssoc}}/"  class="menu__item__label">
                                        My Clan
                                    </a>
                                </li>
                            @endif
                            <li class="menu__item">
                                <a href="https://auth.ageofempires.com/wlid/ExpireCookie/?env=dev"  class="menu__item__label">
                                    Log Out
                                </a>
                            </li>
                        </ul>
                    </div>

                    {{-- for future forum integration --}}
                    <ul class="header__profile__actions">
                        <li><i class="icon--email"><span class="visually-hidden">
                            Messages
                        </span></i></li>
                        <li><i class="icon--alert"><span class="visually-hidden">
                            Alerts 
                        </span></i></li>
                        <li><i class="icon--bookmark"><span class="visually-hidden">
                            Bookmarks 
                        </span></i></li>
                    </ul>
                @else
                    <a class="header__profile__sign-in header__link js-sign-in-steam" href="javascript:void(0);">
                        <i class="icon--login" role="presentation"></i> 
                        Sign In
                    </a>
                @endif
            </div>

            <button class="header__menu-toggle">
                <span class="visually-hidden">
                    Open Menu
                </span>
            </button>
        </div>
    </header>

    <nav class="header__navigation">
        <div class="content-container">
            @if (has_nav_menu('primary_navigation'))
                @php
                    wp_nav_menu(
                        [
                            'theme_location' => 'primary_navigation',
                            'items_wrap' => '<ul class="menu primary-nav" data-state="lvl-1">%3$s</ul>',
                            'container' => false,
                            'walker' => new My_Walker_Nav_Menu()
                        ]
                    );
                @endphp
            @endif

            <div class="header__navigation__mobile-extras">
                @include('partials.social-links')
            </div>
        </div>
    </nav>
</div>

<div class="overlay"></div>

@include('components.modal-signin')
@include('components.modal-signin-steam')
@include('components.alerts-banner')