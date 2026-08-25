
<div class="table-of-contents @if($class) {{$class}} @endif {{$associated_game}}">
	@if(!empty($ltp_post_lesson_group))
	<div class="related-lessons">
		<ul>
	        @foreach($ltp_post_lesson_group as $ltp_post_lesson)
        		<li class="{{$ltp_post_lesson['current_lesson']}}">
			        <a href="{{$ltp_post_lesson['guid']}}">
			        	<div class="lesson_ident">
			        		<span class="lesson_position">{{$ltp_post_lesson['lesson_position']}}</span>
			         		<span>{{$ltp_post_lesson['overview_title']}}</span>
			         	</div>
			         	<div class="lesson_progress">
			         		<svg class="progress-ring" height="48" width="48">
							  <circle data-length="0" class="bg_circle" stroke-width="8" fill="transparent" stroke="#66522d" r="16" cx="24" cy="24" />
							   <circle 
							   <?php
					            	if(!empty($ltp_progress)) {
						            	foreach($ltp_progress as $ltp_progress_key => $ltp_progress_value) {
						            		if($ltp_progress_key == 'ltp_'.$ltp_post_lesson['ID']) { ?>
						            			data-length="{{$ltp_progress_value['page_completion']}}"
						            		<?php }
						            	}
						            }
					            ?>
							    class="progress_circle" stroke-width="8" fill="transparent" stroke="#4bcc3d" r="16" cx="24" cy="24" />
							</svg>
			         	</div>
			        </a>
			    </li>
	        @endforeach
		</ul>
	</div>
	@endif
    @if(!empty($quick_nav_array))
	<div class="chapters {{$this_lesson_position}}">
		<ul>
            @foreach($quick_nav_array as $quick_nav_key => $quick_nav_value)
            	
            <li data-section="{{$quick_nav_key}}" 
            <?php
            	if(!empty($page_sections)) {
	            	foreach($page_sections as $page_section_key => $page_section_value) {
	            		if($page_section_key == $quick_nav_value) { ?>
	            			data-section-complete="{{$page_section_value}}"
	              <?php }
	            	}
	            }
            ?>
            ><!-- end of li -->
              <a href="#{{$quick_nav_key}}">
                <span>{{$quick_nav_value}}</span>
              </a>
            </li>
            @endforeach
        </ul>
	</div>
	@endif
</div>


