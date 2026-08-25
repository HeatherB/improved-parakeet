<div class="reveal modal large" id="insiders-profile" data-reveal>
    <div class="modal-inner background--paper" style="position: relative">

        <div class="modal-content opt-out">
            <h2>Opt Out</h2>
            <p>WARNING! You are about to opt out of the Age Insider Program. This will delete the following information:
            <ul>
                <li>Beta Preferences</li>
                <li>Survey Information</li>
                <li>DxDiag File</li>
                <li>Steam Link Information</li>
                <li>Insider Forum Access</li>
                <li>All Game Beta Keys</li>
            </ul>
            </p>
            <p>
            This information will be lost permanently, which means you will need to re-submit your Insider survey to join the program in the future.
            </p>
            <p>
            Are you sure you’d like to proceed?
            </p>
            <button type="submit" data-email="<?php echo $insider['pref_email']; ?>" data-nonce="<?php echo wp_create_nonce( 'insiderOptOut' ); ?>" class="btn-aoe btn-aoe--small js-button js-del_survey">Opt Out</button>

            <button type="submit" data-close aria-label="Close modal" class="btn-aoe btn-aoe--small btn-aoe--gold js-button js-save js-cancel">Cancel</button>
        </div>

        <div class="modal-content upload_dxdiag">
            <h2>Update dxDiag</h2>
            <div class="dxdiag_content">
                <p>File must be in XML format</p>
                <p><a href="#" onclick="window.open('how-to-upload-your-dxdiag')">Need Help?</a></p>
                <div>
                    <h3>Upload DxDiag.xml File:</h3>
                    <label for="dxdiag_upload" class="survey-answer survey-answer-label">
                        <input type="file" name="dxdiag_upload" class="dxdiag_upload" accept="text/xml" >
                    </label>
                </div>
                <button type="submit" data-sub="save" class="btn-aoe btn-aoe--small js-button js-save js-upload_dx_diag" id="dxdiag_upload" data-nonce="<?php echo wp_create_nonce( 'updateDxDiag' ); ?>" disabled>Upload</button>
                <button type="submit" data-close aria-label="Close modal" class="btn-aoe btn-aoe--small btn-aoe--gold js-button js-cancel">Cancel</button>
                <div class="error_msg"></div>
            </div>
        </div>

        <div class="modal-content remove_dxdiag_modal">
            <h2>Please Confirm</h2>
            <p>This action will erase data. Please confirm to continue.</p>
            <button type="submit" class="btn-aoe btn-aoe--small js-button remove_dxdiag" data-nonce="<?php echo wp_create_nonce( 'deleteDxDiag' ); ?>">Continue</button>
            <button type="submit" data-close aria-label="Close modal" class="btn-aoe btn-aoe--small btn-aoe--gold js-button js-save js-cancel">Cancel</button>
        </div>

        <div class="modal-content disconnect_steam_modal">
            <h2>Please Confirm</h2>
            <p>This action will remove your steam information from the Insiders program. Please confirm to continue.</p>
            <button type="submit" class="btn-aoe btn-aoe--small js-button js-steam_delete" data-nonce="<?php echo wp_create_nonce( 'deleteSteam' ); ?>">Continue</button>

            <button type="submit" data-close aria-label="Close modal" class="btn-aoe btn-aoe--small btn-aoe--gold js-button js-save js-cancel">Cancel</button>
        </div>

        <div class="modal-content newsletter_unsubscribe_modal">
            <h2>Please Confirm</h2>
            <p>This action will remove your remove your email from the Insiders Newsletter. Please confirm to continue.</p>
            <button type="submit" data-email="<?php echo $insider['pref_email']; ?>" class="btn-aoe btn-aoe--small js-button newsletter_unsubscribe">Continue</button>
            <button type="submit" data-close aria-label="Close modal" class="btn-aoe btn-aoe--small btn-aoe--gold js-button js-save js-cancel">Cancel</button>
        </div>


        <button class="close-button btn-close" data-close aria-label="Close modal" type="button"></button>
    </div>
</div>
