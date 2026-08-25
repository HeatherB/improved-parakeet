<?php
/**
 * Template Name: Mods Single
 *
 */

?>


@extends('layouts.app')

@section('content')
	@while(have_posts()) @php(the_post())

	<!-- existing -->
	<!--<div class="banner mods-banner mod-detail-banner" id="mod-detail-banner"></div>-->
    <div class="content section-divider section--padding-bottom background--rock mods-content mods-single-content">
      <div class="row">
        <main class="main" id="mod-detail-main">
          <!--<div class="mod-detail-top" id="mod-detail-top"></div>-->
          <!--<div class="mod-detail-bottom" id="mod-detail-bottom"></div>-->
          <div class="mod-detail-comments" id="mod-detail-comments">
              <section class="comments">
                  <!--@ include('partials.comments') -->
              </section>
          </div>
        </main>
      </div>
    </div>

    <!--@ include('components.modal-mod-flag-reason')-->

    </div>    
	<!-- end existing -->




	<div id="mod-detail">
		<section>
			<div class="page-container">
				@include('partials.mods.subnav')

				<div id="mod-detail-banner"></div>
			
				<!--
				<h2 class="mods_mod-title">(DATA) Gold Technology At Wonder With All Technology</h2>
				<ul class="mods_tag-list">
					<li class="mods__tag">
						{{icon('clock', 'icon --mods-terrain')}}
						Terrain
					</li>
					<li class="mods__tag">
						{{icon('clock', 'icon --mods-official')}}
						Official
					</li>
					<li class="mods__tag">
						{{icon('clock', 'icon --mods-graphics')}}
						Graphics
					</li>
					<li class="mods__tag">
						{{icon('clock', 'icon --mods-event')}}
						Event
					</li>
					<li class="mods__tag">
						{{icon('clock', 'icon --mods-scenarios')}}
						Scenarios
					</li>
					<li class="mods__tag">
						{{icon('clock', 'icon --mods-speech')}}
						Speech
					</li>
					<li class="mods__tag">
						{{icon('clock', 'icon --mods-other')}}
						Other
					</li>
				</ul>

				<div class="mods__buttons">
					<button type="button" class="mods_button">
						{{icon('clock', 'icon --mods-subscribe')}}
						Subscribe
					</button>
				</div>-->
			</div>
		</section>

		<section>
			<div class="page-container">

				<div id="mod-detail-top"></div>
				<!-- gallery area -->
				<!--<div class="mods_gallery">
					<div class="mods_image-wrapper js-thumbCarousel-targets">
						<img src="/" alt="first image" />
						<img src="/" alt="second image" />
						<img src="/" alt="third image" />
						<img src="/" alt="fourth image" />
					</div>

					<div class="mods_thumbs-wrapper js-thumbCarousel-triggers">
						<img src="/" alt="first thumb" />
						<img src="/" alt="second thumb" />
						<img src="/" alt="third thumb" />
						<img src="/" alt="fourth thumb" />
					</div>
				</div>

				<div class="mods_rating">
					{{icon('star', 'icon --rating-star --selected')}}
					{{icon('star', 'icon --rating-star --selected')}}
					{{icon('star', 'icon --rating-star --selected')}}
					{{icon('star', 'icon --rating-star --selected')}}
					{{icon('star', 'icon --rating-star')}}
					<h5 class="mods_rating-count">888,888,888 ratings</h5>
				</div>

				<div class="mods_attribution">
					<h5 class="mods__sub-heading">Created By</h5>
					<h3 class="mods__sub-heading-author">
						DoYouThinkSheSauraDon
					</h3>

					<div class="mods_stats">
						<table>
							<tr>
								<th scope="row" class="mods_stats-label">Subscribers</th>
								<td>888,888,888</td>
								<th scope="row" class="mods_stats-label">File Size</th>
								<td>8888mb</td>
								<th scope="row" class="mods_stats-label">Version</th>
								<td>1.01.02</td>
								<th scope="row" class="mods_stats-label">Last Updated</th>
								<td>December 31, 2021</td>
								<th scope="row" class="mods_stats-label">Created On</th>
								<td>September 25, 2020</td>
							</tr>
						</table>
					</div>

					<button type="button" class="mods_button">
						{{icon('info', 'icon --info')}}
						How To Install
					</button>
				</div>-->

				<!-- description / change list block -->
				<div id="mod-detail-bottom"></div>
				<!--<div class="mods_about">
					<button type="button" class="mods_button">
						{{icon('share', 'icon --flag')}}
						Inappropriate
					</button>

					<div class="mods_description">
						<h6 class="mods__sub-heading">Description</h6>
						<p>copy copy copy</p>
						<p>copy copy copy</p>
					</div>

					<div class="mods_change-list">
						<h6 class="mods__sub-heading">Change List</h6>
						<p>copy copy copy</p>
						<p>copy copy copy</p>
					</div>
				</div>-->

				<!-- discussion / reviews -->
				<div id="mod-detail-discussion"></div>

				<!--<h3 class="mods__sub-heading">
					{{icon('forum', 'icon --discussion')}}
					Join the Discussion

					<div class="mods_add-comment">
						<div class="mods__avatar-wrapper">
							<img src="/" alt="gamertag" />>
						</div>
						<h6 class="mods__avatar-name">DoYouThinkSheSauraDon</h6>
						<div class="mods__avatar-make-comment">copy copy copy copy copy</div>
						<button type="button" class="mods__submit-comment">
							{{icon('forum', 'icon --comment')}}
							Post Comment
						</button>
					</div>

					<div class="mods_display-comment">
						<div class="mods__avatar-wrapper">
							<img src="/" alt="gamertag" />
						</div>
						<h6 class="mods__avatar-name">DoYouThinkSheSauraDon</h6>
						<div class="mods__avatar-display-comment">copy copy copy copy copy</div>
						<button type="button" class="mods__like_button">
							{{icon('like', 'icon --like')}}
							888,888
						</button>
						<button type="button" class="mods__reply_button">
							{{icon('reply', 'icon --reply')}}
							reply
						</button>
						<button type="button" class="mods__flag_button">
							{{icon('share', 'icon --flag')}}
						</button>
					</div>
				</h3>-->

				<!-- related mods -->
				<div id="mod-detail-related"></div>

				<!--<h3 class="mods__sub-heading">Related Mods</h3>

				<div class="mods__featured-mod">
					<img src="/" alt="/" class="mods__featured-mod-image" />
					<div class="mods__featured-mod-rating">
						{{icon('star', 'icon --rating-star --selected')}}
						{{icon('star', 'icon --rating-star --selected')}}
						{{icon('star', 'icon --rating-star --selected')}}
						{{icon('star', 'icon --rating-star --selected')}}
						{{icon('star', 'icon --rating-star')}}
					</div>

					<h6 class="mods__featured-mod-title">Extraordinarily Long Mod Title Name Description</h6>
					<div class="mods__avatar-wrapper">
						<img src="/" alt="gamertag" />>
						by Arthur the Author
					</div>
					<ul class="mods_tag-list">
						<li class="mods__tag">
							{{icon('clock', 'icon --mods-terrain')}}
							Terrain
						</li>
						<li class="mods__tag">
							{{icon('clock', 'icon --mods-official')}}
							Official
						</li>
					</ul>
					<button type="button" class="mods__button">
						{{icon('clock', 'icon --mods-download')}}
					</button>
				</div>-->

			</div>
		</section>
	</div>
	@endwhile    
@endsection
