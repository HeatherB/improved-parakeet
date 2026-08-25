<div class="reveal modal" id="insiders-signup-success" data-reveal>
    <div class="modal-inner background--paper" style="position: relative">
        <div class="modal-content">

            <h2>{!! $insider_complete['completion_title'] !!}</h2>

            {!! apply_filters('the_content',$insider_complete['completion_content']) !!}

            <div class="survey-button-container">

                @if(!empty($insider_complete['left_button_text']))
                    <a class="button cta"
                       href="{!! $insider_complete['left_button_url'] !!}">{!! $insider_complete['left_button_text'] !!}</a>
                @endif

                @if(!empty($insider_complete['middle_button_text']))
                    <a class="button cta"
                       href="{!! $insider_complete['middle_button_url'] !!}">{!! $insider_complete['middle_button_text'] !!}</a>
                @endif

                @if(!empty($insider_complete['right_button_text']))
                    <a class="button cta"
                       href="{!! $insider_complete['right_button_url'] !!}">{!! $insider_complete['right_button_text'] !!}</a>
                @endif

            </div>

        </div>
        <button class="close-button btn-close" data-close aria-label="Close modal" type="button"></button>
    </div>
</div>