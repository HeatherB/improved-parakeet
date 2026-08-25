<div class="question cordian disabled">
  <span class="title">
      <span class="title_name">Survey Summary</span>
  </span>
  <div class="insider_content">
    <div class="error_msg"></div>
    <div class="ac_content_container">

      <div class="ac_content">

        <form class="insider_survey_summary">
          <h1>You're almost done</h1>

          <div class="survey-question-instructions text-center">

            <p>
              Please review the information below and click <strong>Submit Survey</strong> to finish your application to the Insider Program.
            </p>

            <div class="survey_confirm survey_flex_container">

              <div class="status_section survey_flex_item">
                <span class="info_title">Gamertag</span>
                <div class="info_status">
                  <span class="info_label gamertag complete">{{$gamertag}}</span>
                </div>
              </div>

              <div class="status_section survey_flex_item">
                <span class="info_title">Steam ID</span>
                <div class="info_status">
                  <span data-tooltip title="This action isn't required, but you won't be eligible to participate in Steam betas. Don't worry, this information can be updated at a later time in your profile." class="info_label steam_id incomplete">Skipped</span>
                </div>
              </div>

              <div class="status_section survey_flex_item">
                <span class="info_title">DxDiag File</span>
                <div class="info_status">
                  <span data-tooltip title="This action isn't required, but you won't be eligible to participate in betas. Don't worry, this information can be updated at a later time in your profile." class="info_label dx_upload incomplete">Skipped</span>
                </div>
              </div>

            </div>

            <div class="survey_questions_answered">
              <div class="status_section centered_full">
                <span class="info_title">Preferred Email</span>
                <div class="info_status">
                  <span class="complete info_label pref_email_value"></span>
                </div>

                <div class="survey_question_confirm" id="ssq_1">
                  <ul class="completion_list completion_confirmed"></ul>
                </div>
              </div>
            </div>

            <div class="survey_questions_answered survey_flex_container opac_container_1">
                <?php $i = 1; ?>
                <?php foreach(get_field('insider_game_preferences', 'option') as $index => $question){ ?>
                    <div class="survey_question_confirm survey_flex_item" id="ssq_<?php echo ++$i; ?>">
                        <span class="question_label"><?php echo $question['question_text']; ?></span>
                        <ul class="completion_list"></ul>
                    </div>
                <?php } ?>
            </div>

          </div>


          <div class="survey-button-container">
            <button class="button cta btn--back">Back</button>
            <button id="submit-survey" class="button cta " >Submit Survey</button>
          </div>

        </form>

      </div>
    </div>
  </div>
</div>
