<?php

$returnURL = urlencode(get_site_url() . '/insider-signup/');
$link = "https://account.xbox.com/Account/Signin?returnUrl=".$returnURL."&ru=".$returnURL."";

?>
<div class="section-divider section--padding background--paper">
    <div class="row">
        <div class="column small-12 medium-12">
            <h1>Invalid Credentials</h1>
            <p>Please create an XBOX account</p>
            <p class="link show-for-medium">
                <a class="btn-aoe" href="<?php echo $link ?>">Create my free XBOX account</a>
            </p>
        </div>
    </div>
</div>