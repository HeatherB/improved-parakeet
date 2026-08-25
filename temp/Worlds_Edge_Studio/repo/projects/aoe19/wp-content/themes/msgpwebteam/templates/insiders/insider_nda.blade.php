<?php
    $languages = get_field_object('language', 'option')['choices'];
    $language_codes = array_keys(get_field_object('language','options')['choices']);

    $current_language = $_POST['ndaLanguage'] ? $_POST['ndaLanguage'] : get_browser_language($language_codes, DEFAULT_LANGUAGE);

    $agreement_values = [];
    foreach(get_field('agreements_en-US', 'option') as $index => $question) {
        array_push($agreement_values, $question['agreement_value']);
    }

    $greeting = get_field('greeting_' . $current_language, 'option');
    $greeting = str_replace('[username]','<span id="value_gamertag">' . $gamertag . '</span>',$greeting);
    $intro = get_field('intro_' . $current_language, 'option');
    $nda_content = get_field('nda_' . $current_language, 'option');
    $agreements = get_field('agreements_' . $current_language, 'option');
    $required_text = get_field('required_' . $current_language, 'option');
    $toggle_label = get_field('toggle_label_' . $current_language, 'option');
?>

<div class="question cordian nda sub_ac_open">
    <span class="title">
        <span class="title_name">Non-Disclosure Agreement (NDA)</span>
    </span>

    <div class="insider_content">
        <div class="error_msg"></div>

        <div class="ac_content_container">
            <div class="ac_content">
                <form id="ndaLanguageForm" method="post">
                    <label for="language"><i class="icon" role="presentation"></i>{{$toggle_label}}:</label>
                    <select name="ndaLanguage" id="ndaLanguageSelect" onchange="this.form.submit()">
                        @foreach($languages as $code => $language) 
                            <option value="{{$code}}" @if($code == $current_language) selected @endif>{{$language}}</option>
                        @endforeach 
                    </select>
                </form>

                <form id="insider_nda">
                    <label for="gamertag" class="survey-question-label survey_welcome">{!!$greeting!!}</label>

                    <div class="survey_note">{!! $intro !!}</div>

                    <div class="nda_container">{!! $nda_content !!}</div>

                    <ul class="insider_settings_cb not_a_list">
                        @foreach($agreements as $index => $question)
                            <li>
                                <input type="checkbox" class="standard required" name="{{$agreement_values[$index]}}" id="{{$agreement_values[$index]}}" data-q_value="{{$agreement_values[$index]}}" tabindex="1" />
                                <label for="{{$agreement_values[$index]}}"></label>
                                <span data-required-translation="({{$required_text}})">{{$question['agreement_text']}}</span>
                            </li>
                        @endforeach
                    </ul>

                    <div class="survey-button-container">
                        <button class="button cta save-and-continue" data-for-question="insider_nda">Save &amp; Continue</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
