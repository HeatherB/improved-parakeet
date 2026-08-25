<div class="question cordian disabled">
  <span class="title">
      <span class="title_name"><?php echo get_field('upload_dxdiag_title','option'); ?></span>
  </span>
  <div class="insider_content">
    <div class="error_msg"></div>
    <div class="ac_content_container">

      <div class="ac_content">

        <form class="insider_upload_dxdiag">

            <?php echo get_field('upload_dxdiag_content_pre','option'); ?>

            <div class="survey-answers">
              <h2>Upload DxDiag.xml File:</h2>
              <label for="dxdiag_upload" class="survey-answer survey-answer-label">
                <input type="file" name="dxdiag_upload" id="dxdiag_upload" class="dxdiag_upload" accept="text/xml" >
              </label>
            </div>

            <?php echo get_field('upload_dxdiag_content_post','option'); ?>

            <div class="survey-button-container">
              <button class="button cta btn--back">Back</button>
              <button class="button cta save-and-continue" data-for-question="dx_upload">Skip &amp; Continue</button>
            </div>

        </form>
      </div>
    </div>
  </div>
</div>
