<?php

$faq = get_field('insider_faq');
$zenFaqs = [get_option('zendesk_faq_selection_0'),get_option('zendesk_faq_selection_1'),get_option('zendesk_faq_selection_2')];

$faq_right_floated_image_class = 'dynasties';

if( 
    !empty($signUpBlock['content_body_background_image']) &&
    $signUpBlock['content_body_background_image'] !== 'default'
) {
  $faq_right_floated_image_class = $signUpBlock['content_body_background_image'] . '-faq-section';
} elseif( !empty($faq['faq_right_floated_image']) && $faq['faq_right_floated_image'] !== 'default' ) {
  $faq_right_floated_image_class = $faq['faq_right_floated_image'] . '-faq-section';
}
?>

<div class="faq flexcol">
  <div class="col eight">
    <h3><?php echo $faq['insider_faq_title']; ?></h3>
    <p><?php echo $faq['insider_faq_description']; ?></p>

    @if ($zenFaqs)
      <div id="zenfaq">
          @foreach ($zenFaqs as $zenFaq)
            @if (!empty($zenFaq))
            <div class="cordian" data-zenid="{{$zenFaq}}">
              <button class="title linkreset" type="button"></button>
              <div class="text">
                <div class="words"></div>
              </div>
            </div>
            @endif
         @endforeach
      </div>
    @endif

    <p>
      You can also read up on other common questions in the official Insider FAQ or ask any unanswered questions in the Insider forum.
    </p>

    @if ($faq['buttons'])
      <div class="buttons">
          @foreach ($faq['buttons'] as $button)
              <?php 
                  $buttonHref = "";

                  switch($button['type']) {
                      case 'blog_article':
                          $buttonHref = get_permalink($button['article']->ID);
                          break;
                      case 'internal_page':
                          $buttonHref = $button['page'];
                          break;
                      case 'url':
                          $buttonHref = $button['url'];
                          break;
                  }
              ?>

              <a class="sandbutton" href="{{$buttonHref}}">{{$button['button_text']}}</a>
          @endforeach
      </div>
  @endif

  </div>
  <div class="col four">
    <div class="tease vert {{$faq_right_floated_image_class}}">
      <div class="bg">
        <div class="text">
          <h4 class="title">{{$faq['insider_faq_title']}}</h4>
        </div>
      </div>
      <div class="frame-gold"></div>
    </div>
  </div>
</div>