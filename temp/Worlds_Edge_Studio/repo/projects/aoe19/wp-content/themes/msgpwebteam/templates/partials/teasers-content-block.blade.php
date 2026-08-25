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
      case 'full':
        $alignmentClass = 'full';
        break;
    }
  }
?>


<div class="tease @if ( $styleClass ){{$styleClass}}@endif @if (!empty($content_section['cb_content_section_style'])){{$content_section['cb_content_section_style']}}@endif @if (!empty($content_section['cb_content_text_alignment'])){{$content_section['cb_content_text_alignment']}}@endif {{$alignmentClass}} @if (!empty($content_section['cb_content_border_style']))border--{{$content_section['cb_content_border_style']}}@endif">
  <div class="bg" style="@if ($content_section['cb_content_section_bg_image'])background-image: url({{$content_section['cb_content_section_bg_image']['url']}});@endif">
    <div class="text">
      <h4 class="title">{{$content_section['cb_content_title']}}</h4>
      <div class="words">{!!$content_section['cb_content_paragraph']!!}</div>
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
    </div>
  </div>
</div>