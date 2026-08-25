<div class="article__info">
	
	{!! get_avatar( get_the_author_meta('user_email'), 100, '', 'Author avatar', ['class' => 'article__author__avatar']) !!}

	<div class="article__meta">
		<span class="article__author">{{ get_the_author() }}</span>

		<time class="article__date" datetime="{{ get_post_time('c', true) }}">{{ get_the_date() }}</time>
	</div>
	
</div>