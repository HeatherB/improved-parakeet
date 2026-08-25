
@if( !empty($age4_display_civ_sub_nav_content_area) && !empty($age4_content_areas) )
    @foreach ($age4_content_areas as $item)
      <?php
      $desktop_image = null;
      $mobile_image = null;
   
      $content_area_images = $item['content_area_images'];

      $desktop_image =  $content_area_images['desktop_image'];
      $mobile_image = $content_area_images['mobile_image'];     

      $content_area_background_color =  $item['content_area_background_color'];
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
      if(!empty($item['content_area_text_background_image']) && $item['content_area_text_background_image'] !== 'default') {
        $content_area_text_background_image = $item['content_area_text_background_image'];
      }
      
      ?>
      <section class="block-content section--divider {{$item['content_area_background_pattern'] === 'rocks' ? 'background--rock' : ''}} civs-template__wrapper">
        <div class="substance teasers">

          @if($item['content_area_heading'])
            <h2 class="title {{$item['content_area_background_pattern'] === 'rocks' ? 'parchment-font' : ''}}">{!! $item['content_area_heading'] !!}</h2>
          @endif
          <div class="tease addon_expansion civs-template {{$item['content_area_text_float']}}">
            <div class="bg bg__align-items-flex-start tease-custom-bg-image" style="background-image: url({{$desktop_image['url']}});">

              <img class="tease-mobile-image" src="{{$mobile_image['url']}}" alt="" />

              <div class="text {{$content_area_text_background_image ? $content_area_text_background_image : $chosen_content_area_bg_color}}">
                <div class="text-inner">
                  {!! $item['content_area_text'] !!}
                </div>
              </div>      
            </div>

          </div>   
        </div>  
      </section>  
    @endforeach
  @endif