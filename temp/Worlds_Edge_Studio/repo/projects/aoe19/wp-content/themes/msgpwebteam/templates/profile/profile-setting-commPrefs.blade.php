<div class="frame-box">
    <div id="communicationsProfileSettings">
        <div class="frame-box__inner frame-box__inner--dark frame-box__inner--padding">
            <h3 class="h3 light space-between">Communication Preferences</h3>
            <div class="frame-box__inner--light space-between space-above--large-below">
                <div class="row">
                    <div class="insider_content">
                        <div class="columns insider-profile__contact-prefs">

                            <div class="insider_label">Preferred Email</div>
                            <div class="insider-profile__email">
                                <input id="pref_email" class="email_input" type="email" name="preferred_email"
                                       value="{{$pref_email}}"
                                       data-currentemail="{{$pref_email}}">

                                <div class="email_status" data-status="{{$pref_email}}">
                                    @if($dynamics['email_confirmed'])
                                        <span id="status_verified">Verified</span>
                                    @else
                                        <span id="status_unverified">Unverified
                                        <a id="resend_email_verification" href="#"
                                           data-email="{{$pref_email}}"
                                           data-nonce="<?php echo wp_create_nonce('sendEmailVerification'); ?>">Resend verification email</a>
                                    </span>
                                    @endif
                                </div>
                            </div>

                            <div class="insider_label pref_country">Country/Region</div>
                            <select name="pref_country" id="pref_country"
                                    data-country="{{$country}}"></select>
                            <div class="insider_comm_prefs ac_content">

                                <?php

                                $survey_contact_prefs = get_field('insider_contact_preferences', 'option');

                                // TEMP Condition used for initial page load when CPM has not yet been established
                                $last_known_cpm = wp_get_current_user()->tmpCPM ?? false;

                                if ($last_known_cpm) {
                                    delete_user_meta(wp_get_current_user()->ID, 'tmpCPM');
                                }

                                foreach($survey_contact_prefs as $contact_pref => $option){
                                if (!empty($survey_data["new_permissiontocontact"])) {
                                    $is_checked = ($dynamics['ms_contact'] || $last_known_cpm) ? 'checked' : '';
                                } else {
                                    $is_checked = '';
                                }
                                ?>
                                <div class="form-toggle">
                                    <input type="checkbox" class="toggle" data-answer="{{$option['question_value']}}"
                                           name="{{$option['question_value']}}" id="{{$option['question_value']}}"
                                           tabindex="1" <?php echo $is_checked; ?> <?php echo $dynamics['email_confirmed'] ? ' data-cpmnonce="'.wp_create_nonce('cpmnonce').'"' : 'disabled'; ?> />
                                    <label for="{{$option['question_value']}}"></label>
                                    <span class="form-toggle__label">{!! $option['question'] !!} <a
                                                href="https://privacy.microsoft.com/en-us/privacystatement"
                                                target="_blank">Privacy &amp; Cookies</a></span>
                                </div>

                                <?php } ?>

                                <button type="button"
                                        class="btn-aoe btn-aoe--small js-button js-update_comm_prefs"
                                        data-unsub="{{$pref_email}}"
                                        data-nonce="<?php echo wp_create_nonce('updateCommunicationPrefs'); ?>">Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>