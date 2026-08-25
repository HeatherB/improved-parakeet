<div class="related_lessons @if($class) {{$class}} @endif {{$associated_game}}">
    <div class="row column text-center">
      @if(!empty($ltp_post_lesson_group))
          @foreach($ltp_post_lesson_group as $ltp_post_lesson)
          <a href="{{$ltp_post_lesson['guid']}}">
            <span>{{$ltp_post_lesson['overview_title']}}</span>
          </a>
          @endforeach
      @endif
  </div>
</div>
