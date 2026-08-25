<div class="question cordian disabled" >
  <span class="title">
      <span class="title_name">{!!$question['question_text']!!}</span>
  </span>
    <div class="insider_content">
        <div class="error_msg"></div>
        <div class="ac_content_container">

            <div class="ac_content">

                {!!$question['question_content']!!}

                <form id="{{$question['question_value']}}">

                    <ul class="insider_settings_cb not_a_list">
                        <?php foreach($question['possible_answers'] as $index => $answer ){ ?>

                        <li>
                            <input type="{{$question['input_type']}}" data-answer="{{$answer['answer_value']}}" class="standard"
                                   name="{{$question['question_value']}}"
                                   id="{{$question['question_value']}}_{{$index}}"/>
                            <label for="{{$question['question_value']}}_{{$index}}"></label>
                            <span>{{$answer['answer_text']}}</span>
                        </li>
                        <?php if($answer['answer_other']){ ?>
                        <li>
                            <input type="text"  name="{{$question['question_value']}}_{{$index}}_other" id="other" class="standard other_input" disabled value="">
                        </li>
                        <?php } ?>

                        <?php } ?>
                    </ul>

                    <div class="survey-button-container">
                        <button class="button cta btn--back">Back</button>
                        <button class="button cta save-and-continue" data-for-question="{{$question['question_type']}}">Save &amp; Continue</button>
                    </div>

                </form>
            </div>
        </div>
    </div>
</div>
