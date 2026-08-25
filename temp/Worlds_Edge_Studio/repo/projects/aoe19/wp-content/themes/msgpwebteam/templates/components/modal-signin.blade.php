<div class="reveal modal large" id="sign-in" data-reveal>
    <div class="modal-inner background--paper" style="position: relative">
        <div class="modal-content">
            <h2>Sign In</h2>
            <h4>Sign in to interact with our site and view additional content.</h4>
            <p>If you have an Xbox Live account (available for free, Microsoft account required)</p>
            <p class="link show-for-small-only">
                <a class="btn-aoe" href="https://auth.ageofempires.com/?env=dev">Sign in</a>
            </p>
            <p class="link show-for-medium">
                <a class="btn-aoe" href="https://auth.ageofempires.com/?env=dev">Sign in with your Xbox Live / Microsoft Account</a>
                <?php if ($_SERVER['HTTP_HOST'] == "www-dev.ageofempires.com") { ?>
                    <a class="btn-aoe" href="https://auth.ageofempires.com/?env=dev-sbx">Sign in with your Dev/Sandbox Account</a>
				<?php } ?>
            </p>
            <p>Don't have a Microsoft or Xbox Live account? No problem, just create one for free below!</p>

            <p class="link show-for-medium">
                <a class="btn-aoe" href="https://signup.live.com/signup?client_id=645be780-86c3-431d-8106-4ada76c3a8d3&lw=1&cobrandid=90011&response_type=code&contextid=72999F2B3C92AECD&bk=1516724798&ru=https://login.live.com/oauth20_authorize.srf%3fclient_id%3d645be780-86c3-431d-8106-4ada76c3a8d3%26scope%3dXboxlive.offline_access%2bXboxlive.signin%26lw%3d1%26cobrandid%3d90011%26response_type%3dcode%26redirect_uri%3dhttps://auth-dev.ageofempires.com/home/CompleteAuth%26contextid%3d72999F2B3C92AECD%26mkt%3dEN-US%26lc%3d1033%26bk%3d1516724798&uiflavor=web&uaid=93b8dbd34b334c3d90e32f24ba527000&mkt=EN-US&lc=1033">Create my free Microsoft account</a>
            </p>
            <p class="link show-for-small-only">
                <a class="btn-aoe" href="https://signup.live.com/signup?client_id=645be780-86c3-431d-8106-4ada76c3a8d3&lw=1&cobrandid=90011&response_type=code&contextid=72999F2B3C92AECD&bk=1516724798&ru=https://login.live.com/oauth20_authorize.srf%3fclient_id%3d645be780-86c3-431d-8106-4ada76c3a8d3%26scope%3dXboxlive.offline_access%2bXboxlive.signin%26lw%3d1%26cobrandid%3d90011%26response_type%3dcode%26redirect_uri%3dhttps://auth-dev.ageofempires.com/home/CompleteAuth%26contextid%3d72999F2B3C92AECD%26mkt%3dEN-US%26lc%3d1033%26bk%3d1516724798&uiflavor=web&uaid=93b8dbd34b334c3d90e32f24ba527000&mkt=EN-US&lc=1033">Create account</a>
            </p>
        </div>

        <button class="close-button btn-close" data-close aria-label="Close modal" type="button">
        </button>
    </div>
</div>
