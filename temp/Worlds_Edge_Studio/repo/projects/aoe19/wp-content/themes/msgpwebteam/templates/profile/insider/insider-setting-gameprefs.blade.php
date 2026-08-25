<div class="insider_block cordian">
  <span class="title">
      <span class="title_name">User Information</span>
  </span>
    <div class="insider_content">
        <div class="ac_content_container">

            <div class="ac_content">
                <form class="insider_game_prefs">

                    <?php

                    foreach(get_field('insider_game_preferences', 'option') as $index => $option) {

                        // Set to Question text if there is not value, and an empty array if there is not a match
                        $answer_array = $survey_questions[$option['question_value']] ?? $survey_questions[$option['question_text']] ?? [];
                        $other_value = '';
                        $other_checked = '';

                        foreach($answer_array as $aValue){
                            if(is_array($aValue)){
                                $other_value = $aValue['other'];
                                $other_checked = true;
                            }
                        }

                    ?>

                    <h4>{!!$option['question_text']!!}</h4>
                    <ul class="insider_settings_cb not_a_list" data-question="{{$option['question_value']}}">
                        <?php foreach($option['possible_answers'] as $i => $answer) {

                            if(!empty($answer) || ($answer['answer_value'] == 'other' && $other_checked)) {
                                $is_checked = (in_array($answer['answer_value'], $answer_array)) || ($answer['answer_value'] == 'other' && $other_checked) ? 'checked' : '';
                            } else {
                                $is_checked = '';
                            }

                            // Is other Checkbox
                            $is_other = (strtolower($answer['answer_value']) == 'other' ? 'other' : '');

                            // Is None Checkbox
                            $is_none = (strtolower($answer['answer_value']) == 'none' ? 'none' : '');

                        ?>

                        <li>
                            <input type="{{$option['input_type']}}" data-answer="{{$answer['answer_value']}}" data-exclusive="{{$answer['answer_exclusive']}}" class="standard {{$is_none}}{{$is_other}}"
                                   name="game_pref_{{$index}}"
                                   id="game_pref_{{$index}}_q_{{$i}}"
                                   {{$is_checked}}
                                   tabindex="1" />
                            <label for="game_pref_{{$index}}_q_{{$i}}"></label>
                            <span class="other_label">{{$answer['answer_text']}}</span>

                            <?php if($answer['answer_other']) { ?>
                        </li>
                        <li>
                            <input type="text" class="standard other_input"
                                   value="{{$other_value}}"
                                   name="game_pref_{{$index}}_q_{{$i}}"
                                   id="game_pref_{{$index}}_q_{{$i}}" <?php echo (!$other_checked) ? 'disabled' : ''; ?>>
                            <?php } ?>
                        </li>
                        <?php } ?>
                    </ul>

                    <?php } ?>

                    <button type="button" id="save_game_prefs" class="btn-aoe btn-aoe--small js-button save_pref" data-nonce="<?php echo wp_create_nonce('updateUserPrefs'); ?>" disabled>Save</button>

                </form>
            </div>
        </div>
    </div>
</div>
