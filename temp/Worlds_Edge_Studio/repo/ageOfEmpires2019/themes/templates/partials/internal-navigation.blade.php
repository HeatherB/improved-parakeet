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
          <!--<li>
            <a href="#">What is Age of Empires?</a>
          </li>
          <li>
            <a href="">User Interface Overview</a>
          </li>
          <li>
            <a href="/">What are Resources?</a>
          </li>
          <li>
            <a href="/">How to Start a Game</a>
          </li>
          <li>
            <a href="/">What is a civilization?</a>
          </li>
          <li>
            <a href="/">Starting Economy</a>
          </li>
          <li>
            <a href="/">Start of a Map</a>
          </li>
          <li>
            <a href="/">Aging Up</a>
          </li>-->
        </ul>
      </div>

  </div>
</div>