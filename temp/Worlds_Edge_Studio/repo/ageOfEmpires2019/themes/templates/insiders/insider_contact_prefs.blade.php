<div class="question cordian disabled">
    <span class="title">
      <span class="title_name">Communication Preferences</span>
    </span>
    <div class="insider_content">
        <div class="error_msg"></div>
        <div class="ac_content_container">

            <div class="ac_content">

                <form id="contact_prefs">

                    {!! get_field('contact_preferences_content', 'option') !!}

                    <label for="pref_email" class="survey-question-label">Preferred Email Address
                        <span data-tooltip class="tooltip_icon"
                              title="This can be different from your Xbox Live email."></span>
                        <br/>
                        <input type="email" name="pref_email" id="pref_email" class="standard" value="{!!$user->user_email!!}"/>
                    </label>

                    <label for="pref_country" class="survey-question-label">Country<br/>
                        <select name="pref_country" id="pref_country" class="standard" data-country="{!!$user->msa_country!!}"></select>
                    </label>
                    
                    <ul class="insider_settings_tg not_a_list text_links">
                        @foreach($insider_contact_prefs as $contact_pref)
                            <li>
                                <input type="checkbox" class="toggle" data-answer="{!!$contact_pref['question_value']!!}"
                                       name="{!!$contact_pref['question_value']!!}" id="{!!$contact_pref['question_value']!!}"
                                       />
                                <label for="{!!$contact_pref['question_value']!!}"></label>
                                <span data-answer="{!!$contact_pref['question_value']!!}">{!! $contact_pref['question'] !!}
                                    <a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank">Privacy &amp; Cookies</a>
                                </span>
                            </li>
                        @endforeach
                    </ul>

                    <div class="survey-button-container">
                        <button class="button cta btn--back">Back</button>
                        <button class="button cta save-and-continue" data-for-question="contact_prefs">Save &amp; Continue</button>
                    </div>

                </form>

            </div>
        </div>
    </div>
</div>
