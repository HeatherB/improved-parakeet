<div class="question cordian disabled">
    <span class="title">
        <span class="title_name">{!! $insider_steam[0]['steam_title'] !!}</span>
    </span>
    <div class="insider_content">
        <div class="error_msg"></div>
        <div class="ac_content_container">
            <div class="ac_content">
                <form id="insider_steam">

                    {!! $insider_steam[0]['steam_content'] !!}

                    <div class="survey-button-container upper_survey_buttons">
                        <a href="{{ get_permalink() }}?link_steam=true" class="button cta save-survey-data">Add Steam Account</a>
                    </div>

                    {!! $insider_steam[1]['steam_content'] !!}

                    <div class="survey-button-container">
                        <button class="button cta btn--back">Back</button>
                        <button class="button cta save-and-continue" data-for-question="steam_login">Skip &amp; Continue</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>