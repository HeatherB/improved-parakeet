<div class="reveal modal large" id="sign-in-steam" data-reveal>
    <div class="modal-inner background--paper" style="position: relative">
        <div class="modal-content">
            <h2>Sign In</h2><br />
            <h3>Xbox Live</h3> 
            <p>If you would like to use an Xbox Live account (available for free, Microsoft account required)</p>
            <p class="link show-for-small-only">
                <a class="btn-aoe" href="https://auth.ageofempires.com/?env=dev">Sign in</a>
            </p>
            <p class="link show-for-medium">
                <a class="btn-aoe" href="https://auth.ageofempires.com/?env=dev">Sign in with your Microsoft Account</a> 
                <?php if ($_SERVER['HTTP_HOST'] == "www-dev.ageofempires.com") { ?>
                    <a class="btn-aoe" href="https://auth.ageofempires.com/?env=dev-sbx">Sign in with your Dev/Sandbox Account</a>
				<?php } ?>
            </p>
            <p>Don't have a Microsoft or Xbox Live account? No problem, just create one for free by following the "Create one!" link on the sign in page.</p>
            <div class="dividers gold slim"></div><br />
            <h3>Steam</h3>
            <p>If you prefer to use a Steam account </p>
            <p class="link show-for-small-only">
                <a class="btn-aoe" href="https://auth.ageofempires.com/home/loginsteam?env=dev">Steam Sign in</a>
            </p>
            <p class="link show-for-medium">
                <a class="btn-aoe" href="https://auth.ageofempires.com/home/loginsteam?env=dev">Sign in with your Steam Account</a>
            </p>
            <p>(Note: some areas of the site may require an Xbox Live / Microsoft account.)</p>
        </div>

        <button class="close-button btn-close" data-close aria-label="Close modal" type="button">
        </button>
    </div>
</div>
