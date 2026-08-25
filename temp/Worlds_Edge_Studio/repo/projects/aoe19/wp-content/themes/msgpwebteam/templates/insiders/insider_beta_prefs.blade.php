<div class="question cordian disabled">
    <span class="title">
        <span class="title_name">Beta Preferences</span>
    </span>
    <div class="insider_content">
        <div class="error_msg"></div>
        <div class="ac_content_container">
            <div class="ac_content">

                <form id="beta_prefs">

                    {!!  get_field('beta_preferences_content','option') !!}

                    <ul class="insider_settings_tg not_a_list">
                        @foreach($insider_beta_prefs as $beta_pref)
                            <li>
                                <input type="checkbox" data-answer="{{$beta_pref['question_value']}}" class="toggle" name="{{$beta_pref['question_value']}}" id="{{$beta_pref['question_value']}}" />
                                <label for="{{$beta_pref['question_value']}}"></label>
                                <span data-answer="{{$beta_pref['question_value']}}">{!! $beta_pref['question'] !!}</span>
                            </li>
                        @endforeach
                    </ul>

                    <div class="survey-button-container">
                        <button class="button cta btn--back">Back</button>
                        <button class="button cta save-and-continue" data-for-question="beta_prefs">Save &amp;
                            Continue
                        </button>
                    </div>

                </form>

            </div>
        </div>
    </div>
</div>