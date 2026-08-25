<div class="internal_navigation @if($class) {{$class}} @endif">
    <div class="row column text-center">

      <div class="cordian frame-box__inner--light">
        <button class="su-spoiler-title">
          <span class="title">{{$ltp_overview_title}} Lessons</span>
        </button>
        <ul>
          @if(!empty($quick_nav_array))
            @foreach($quick_nav_array as $quick_nav_key => $quick_nav_value)
            <li>
              <a href="#{{$quick_nav_key}}">
                <span>{{$quick_nav_value}}</span>
              </a>
            </li>
            @endforeach
          @endif
        </ul>
      </div>

  </div>
</div>