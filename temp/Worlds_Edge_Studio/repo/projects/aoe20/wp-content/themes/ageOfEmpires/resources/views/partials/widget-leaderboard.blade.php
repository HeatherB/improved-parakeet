<div class="widget --leaderboard">
	<div class="widget__content">
		<h3 class="widget__title">{{short_title(get_the_title())}} Leaderboards</h3>
		{{-- !!temp!! --}}
		<?php
			$players = array(
				array(
					'rank' => 1,
					'gamertag' => 'Nicov',
					'avatar' => 'images/defaults/default-avatar.svg',
					'link' => '#',
					'elo' => 2500
				),
				array(
					'rank' => 2,
					'gamertag' => 'TheViper',
					'avatar' => 'images/defaults/default-avatar.svg',
					'link' => '#',
					'elo' => 2499
				),
				array(
					'rank' => 3,
					'gamertag' => 'Hera',
					'avatar' => 'images/defaults/default-avatar.svg',
					'link' => '#',
					'elo' => 2498
				),
				array(
					'rank' => 4,
					'gamertag' => 'Villese',
					'avatar' => 'images/defaults/default-avatar.svg',
					'link' => '#',
					'elo' => 2497
				),
				array(
					'rank' => 5,
					'gamertag' => 'Heresy | dogao',
					'avatar' => 'images/defaults/default-avatar.svg',
					'link' => '#',
					'elo' => 2496
				),
				array(
					'rank' => 6,
					'gamertag' => 'd.',
					'avatar' => 'images/defaults/default-avatar.svg',
					'link' => '#',
					'elo' => 2480
				),
				array(
					'rank' => 7,
					'gamertag' => 'F1Re',
					'avatar' => 'images/defaults/default-avatar.svg',
					'link' => '#',
					'elo' => 2478
				),
				array(
					'rank' => 8,
					'gamertag' => 'Liereyy',
					'avatar' => 'images/defaults/default-avatar.svg',
					'link' => '#',
					'elo' => 2456
				),
				array(
					'rank' => 9,
					'gamertag' => 'Larry',
					'avatar' => 'images/defaults/avatar.svg',
					'link' => '#',
					'elo' => 2350
				),
				array(
					'rank' => 10,
					'gamertag' => 'Charlene',
					'avatar' => 'images/defaults/default-avatar.svg',
					'link' => '#',
					'elo' => 2340
				)
			);
		?>
		<table class="leaderboard" cellpadding="0" cellspacing="0">
			<tr class="leaderboard__row">
				<th class="leaderboard__heading">Leader</th>
				<th class="leaderboard__heading">ELO</th>
			</tr>

			@foreach($players as $player) 
				<tr class="leaderboard__row">
					<td class="leader">
						<span class="leader__rank">{{$player['rank']}}</span> 
						<a class="leader__link" href="{{$player['link']}}">
							<img class="leader__avatar widget__avatar" src="@asset($player['avatar'])" role="presentation" alt=""/>
							<span class="leader__gamertag">
								{{$player['gamertag']}}
							</span>
						</a>
					</td>
					<td class="leader__elo">{{$player['elo']}}</td>
				</tr>
			@endforeach
		</table>
	</div>

	<a class="widget__cta">More Leaders</a>
</div>