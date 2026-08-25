<?php
  $alignmentClass = "";

  if ($content_section['cb_text_box_alignment']) {
    switch ($content_section['cb_text_box_alignment']) {
      case 'topleft':
        $alignmentClass = 'top left';
        break;
      case 'topright':
        $alignmentClass = 'top';
        break;
      case 'bottomleft':
        $alignmentClass = 'left';
        break;
      case 'bottomcenter':
        $alignmentClass = 'bottomcenter';
        break;
      case 'full':
        $alignmentClass = 'full';
        break;
    }
  }
?>


<div class="tease 
  @if ( $styleClass )
    {{$styleClass}}
  @endif 

  @if (!empty($content_section['cb_content_section_style']))
    {{$content_section['cb_content_section_style']}}
  @endif 

  @if (!empty($content_section['cb_content_text_alignment']))
    {{$content_section['cb_content_text_alignment']}}
  @endif 

  {{$alignmentClass}} 

  @if (!empty($content_section['cb_content_border_style']))
    border--{{$content_section['cb_content_border_style']}}
  @endif"><!-- end of div -->


  <div class="bg">
    @include('partials.hero-picture', ['options' => $content_section])
    <div class="text">
      @if($content_section['cb_content_title'])
      <h4 class="title">{{$content_section['cb_content_title']}}</h4>
      @endif

      @if($content_section['cb_content_paragraph'])
      <div class="words">{!!$content_section['cb_content_paragraph']!!}</div>
      @endif

      @if(isset($form_closed) && $form_closed == true)
        @if(!empty($content_section['cb_left_button_text']) || !empty($content_section['cb_right_button_text']) || !empty($content_section['cb_center_button_text']) ) 
          <div class="words warning">{!! $applications_closed_messaging !!}</div>
         @endif
      @else

        @if(!is_user_logged_in())
          @if(!empty($content_section['cb_left_button_text']) || !empty($content_section['cb_right_button_text']) || !empty($content_section['cb_center_button_text']) ) 
            <div class="buttons focus-button-container">
              <button class="button js-sign-in ensure-signin">Sign In to Continue</button>
            </div>
          @endif
        @else


          <div class="buttons focus-button-container">
            @if(!empty($content_section['cb_left_button_text'])) 
              <a href="{{$content_section['cb_left_button_url']}}" class="button cta linkreset">
                {{$content_section['cb_left_button_text']}}
              </a>
            @endif
            @if(!empty($content_section['cb_right_button_text']))
              <a href="{{$content_section['cb_right_button_url']}}" class="button cta linkreset">
                {{$content_section['cb_right_button_text']}}
              </a>
            @endif
            @if(!empty($content_section['cb_center_button_text']))
              <a href="{{$content_section['cb_center_button_url']}}" class="button cta linkreset">
                {{$content_section['cb_center_button_text']}}
              </a>
            @endif
          </div>
        @endif

      @endif

    </div>
  </div>
</div>