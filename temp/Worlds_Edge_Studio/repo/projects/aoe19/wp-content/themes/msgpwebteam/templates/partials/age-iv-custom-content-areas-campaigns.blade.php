@if( !empty($age4_display_civ_sub_nav_content_area) && !empty($age4_content_areas) )
<section class="block-content section--divider {{$age4_content_areas['content_area_background_pattern'] === 'rocks' ? 'background--rock' : ''}} civs-template__wrapper --ageiv_campaigns">
  <div class="campaigns_wrapper">
@foreach($content_areas_campaigns['content_area_block'] as $campaign_block)
  <?php
      $content_area_background_color =  $campaign_block['content_area_background_color'];
      $chosen_content_area_bg_color = '';

      switch($content_area_background_color) {
        case 'light blue gradient':
          $chosen_content_area_bg_color = 'civs-template__light-blue-gradient';
          break;
        case 'dark blue gradient':
          $chosen_content_area_bg_color = 'civs-template__dark-blue-gradient';
          break; 
      }

      $content_area_text_background_image = false;
      if(!empty($campaign_block['content_area_text_background_image']) && $campaign_block['content_area_text_background_image'] !== 'default') {
        $content_area_text_background_image = $campaign_block['content_area_text_background_image'];
      }
?>
    <div class="civs-template">
      <div class="campaign_tile bg">

            @include('partials.bg-picture', ['options' => $campaign_block])

            <div class="text {{$content_area_text_background_image ? $content_area_text_background_image : $chosen_content_area_bg_color}}">
              @if($campaign_block['content_area_heading'])
                <h2 class="title">{!! $campaign_block['content_area_heading'] !!}</h2>
              @endif
              <div class="text-inner">
                {!! $campaign_block['content_area_text'] !!}
              </div>
            </div>      

      </div>
    </div>
   @endforeach
    </div> 
</section>
@endif