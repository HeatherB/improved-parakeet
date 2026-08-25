<div class="breakpoint-indicator is-hidden js-bp-indicator"></div>

<header class="header js-header">	
    <h1 class="header__logo">
    	<a class="header__logo__link" href="{{ home_url() }}">
    		<img src="@asset('images/logos/franchise-logo-horiz.png')" alt="{{ get_bloginfo('name', 'display') }}"/>
    	</a>
    </h1>

    <button class="header__menu-toggle js-nav-toggle" tabindex="0">
    	{{icon('menu', 'mobile-header-icon --toggle')}}
    	{{icon('close', 'mobile-header-icon --close')}}
    </button>

    <button class="header__profile-toggle js-profile-toggle" tabindex="0">
    	{{icon('profile', 'mobile-header-icon --toggle')}}
    	{{icon('close', 'mobile-header-icon --close')}}
    </button>
</header>

<div class="navbar">
	<div class="navbar__container">
		<nav class="primary-nav js-nav" data-state="lvl-0">
		  	@if (has_nav_menu('primary_navigation'))
		    	{!! wp_nav_menu([
			    	'theme_location' => 'primary_navigation', 
			    	'menu_class' => 'nav', 
			    	'items_wrap' => '<ul class="primary-nav__menu">%3$s</ul>',
			        'container' => false,
			        'walker' => new Walker_Primary_Nav()
		    	]) !!}
		  	@endif

		  	<div class="header__menu js-header-menu">
		  		<div class="header__buy">
			    	<a href="{{home_url('buy-now')}}" class="header__button js-cta-button">Buy Now</a>
			    </div>

			    <div class="header__menu__item header__language" tabindex="0">
			    	<span class="menu__item__label">
			    		{{icon('globe', 'header__icon')}}
			    		<span class="header__language__text">Language</span>
			    	</span>
			    </div>

			    <div class="header__menu__item header__search js-search">
			    	<div class="dropdown">
				    	<form class="header__search__form" action="{{get_site_url()}}">
				    		<label class="screen-reader-only" for="s">Search</label>
				    		<input type="text" name="s" class="header__search__form__input js-search-input" placeholder="Search" id="searchInput" />
				    		<button type="submit" class="header__search__form__submit" name="search-submit">
				    			{{icon('search', 'header__icon')}}
				    			<span class="screen-reader-only">Submit Search</span>
				    		</button>
				    	</form>
				    </div>
				    <button class="menu__item__label js-search-toggle">
				    	{{icon('search', 'header__icon --toggle')}}
				    	{{icon('close', 'header__icon --close')}}
			    		<span class="screen-reader-only">Open Search</span>
			    	</button>
			    </div>

			    <div class="header__menu__item header__share js-share">

			    	{{-- !!temp!! we should pull these from somewhere --}}
			    	<?php $share_links = array(
			    		array(
			    			'platform' => 'facebook',
			    			'url' => 'https://www.facebook.com/ageofempires/',
			    		),
			    		array(
			    			'platform' => 'twitter',
			    			'url' => 'https://twitter.com/ageofempires',
			    		),
			    		array(
			    			'platform' => 'instagram',
			    			'url' => 'https://www.instagram.com/ageofempiresgame/',
			    		),
			    		array(
			    			'platform' => 'youtube',
			    			'url' => 'https://www.youtube.com/ageofempires',
			    		),
			    		array(
			    			'platform' => 'twitch',
			    			'url' => '',
			    		),
			    		array(
			    			'platform' => 'discord',
			    			'url' => 'https://discord.gg/ageofempires',
			    		)
			    	); ?>

			    	<ul class="dropdown share__links">
			    		@foreach($share_links as $link)
			    			<li class="share__link">
			    				<a href="{{$link['url']}}">
			    					{{icon($link['platform'], 'share__icon --' . $link['platform'])}} <span class="screen-reader-only">{{ucwords($link['platform'])}}</span>
			    				</a>
			    			</li>
			    		@endforeach
			    	</ul>

			    	<button class="menu__item__label js-share-toggle">
			    		{{icon('share', 'header__icon --toggle')}}
			    		{{icon('close', 'header__icon --close')}}
			    		<span class="screen-reader-only">Open Share</span>
			    	</button>
			    </div>
			</div>
		</nav>

		<nav class="profile-nav js-profile">

			{{-- !!temp!! --}}
			<?php 
				$is_logged_in = is_user_logged_in();
				$profile_menu = array(
					array(
						'text' => 'Messages',
						'icon' => 'mail',
						'url' => '#Messages'
					), 
					array(
						'text' => 'Notifications',
						'icon' => 'bell',
						'url' => '#Notifications'
					), 
					array(
						'text' => 'Bookmarks',
						'icon' => 'bookmark',
						'url' => '#Bookmarks'
					), 
					array(
						'text' => 'Preferences',
						'icon' => 'settings',
						'url' => '#Preferences'
					), 
					array(
						'text' => 'Log Out',
						'icon' => 'sign-out',
						'url' => 'javascript:void(0);'
					)
				);
			?>

			@if($is_logged_in) 
				<a href="#profile" class="profile-nav__username">
					<img class="profile-nav__avatar" role="presentation" src="@asset('images/defaults/default-avatar.svg')" />
					{{wp_get_current_user()->msa_gt}}
				</a>
				
				<ul class="profile-nav__menu">
					@foreach ($profile_menu as $item)
						<li class="menu__item">
							
							<a href="{{$item['url']}}" class="menu__item__label">
								<div class="profile-nav__icon-container">
									{{icon($item['icon'], 'header__icon')}}
								</div>
								{{$item['text']}}
							</a>
						</li>
					@endforeach
				</ul>
			@else
				<a class="profile-nav__label" href="https://auth.ageofempires.com?env=staging">
					{{icon('sign-in', 'header__icon')}}
		    	</a>
		    @endif
			
		</nav>
	</div>
</div>

<div class="overlay js-overlay"></div>
