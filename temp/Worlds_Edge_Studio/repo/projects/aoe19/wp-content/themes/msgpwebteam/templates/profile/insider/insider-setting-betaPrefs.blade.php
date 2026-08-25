<div class="insider_block">
    <span class="title">
      <div class="flex_container spaced">
      <span class="title_name flex_item ">Beta Preferences</span>
      <span class="flex_item tooltip_icon" tabindex="1" data-tooltip title="A green checkmark icon indicates completed information. A red exclamation icon indicates pending, or incomplete information."></span>
    </div>
    </span>
    <div class="insider_content">
        <div class="ac_content_container">
            <div class="ac_content">
                <form class="insider_beta_prefs">

                    <ul class="insider_settings_tg">
                        <?php $insider_contact_prefs = get_field('insider_contact_preferences', 'option');
                            $preferredBeta = explode(',',$survey_data["new_betapreferredplatforms"]);

                            foreach(get_field('insider_beta_preferences', 'option') as $index => $option) {

                                if(!empty($preferredBeta)){
                                    if($preferredBeta[0] == 3){
                                        $is_checked = 'checked';
                                    } else {
                                        $is_checked = in_array($option['question_value'],$preferredBeta) ? 'checked' : '';
                                        echo in_array([$option['question_value']],$preferredBeta);
                                    }
                                } else {
                                    $is_checked = '';
                                }
                            ?>

                                <div class="form-toggle">
                                    <input type="checkbox" class="toggle" data-answer="{{$option['question_value']}}" name="beta_pref_<?php echo $index;?>" id="beta_pref_<?php echo $index;?>" tabindex="1" <?php echo $is_checked;?> />
                                    <label for="beta_pref_<?php echo $index;?>"></label>
                                    <span class="form-toggle__label">{{$option['question']}}</span>
                                </div>

                            <?php }
                        ?>

                    </ul>

                    <button type="button" class="btn-aoe btn-aoe--small js-button js-update_beta_prefs" data-nonce="<?php echo wp_create_nonce('updateBetaPrefs'); ?>">Save</button>

                </form>
            </div>
        </div>
    </div>
</div>
