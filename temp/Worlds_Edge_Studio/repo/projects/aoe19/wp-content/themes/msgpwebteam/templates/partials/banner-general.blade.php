<div class="banner @if($class) {{$class}} @endif">
        @include('partials.hero-picture', ['options' => $hero_section])

    <div class="inner">
        <h1 class="light">{!! App\title() !!}</h1>

        @if($hero_section['title'])
        <h2>{{$hero_section['title']}}</h2>
        @endif

        @if($hero_section['copy'])
        {!! $hero_section['copy'] !!}
        @endif

        @if (!empty($hero_section['buttons']))
        <div class="hero_banner_buttons buttons hero-header__content">
            @foreach ($hero_section['buttons'] as $button)
                <?php
                  $buttonHref = "";

                  switch($button['type']) {
                      case 'blog_article':
                          $buttonHref = get_permalink($button['article']->ID);
                          break;
                      case 'page_internal':
                          $buttonHref = $button['page'];
                          break;
                      case 'page_external':
                          $buttonHref = $button['external_page_url'];
                          break;
                  }
                ?>

                @if ($button['type'] == 'video_modal_youtube')
                    <button type="button" class="btn-aoe--cta btn-aoe--cta--large hero-video-modal"
                        data-btn-open="hero-video-modal" data-video-src="{{$button['video_id']}}" data-video-type="youtube" data-video-muted="1">{{$button['button_text']}}</button>
                @else
                      <a class="btn-aoe--cta btn-aoe--cta--large" href="{{$buttonHref}}">{{$button['button_text']}}</a>
                @endif

            @endforeach
        </div>
      @endif
    </div><!--  end of inner -->

</div><!-- end of banner -->

<div class="modal-frank" id="hero-video-modal" data-reveal data-close-on-click="true">
  <div class="frame"></div>
  <div class="responsive-embed widescreen"></div>
  <button class="close-button" data-close aria-label="Close modal" type="button">
      <span aria-hidden="true">&times;</span>
  </button>
</div>
