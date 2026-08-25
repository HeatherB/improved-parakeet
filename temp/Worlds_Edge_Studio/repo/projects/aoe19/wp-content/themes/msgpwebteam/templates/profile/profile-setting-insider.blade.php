<!-- Insider Settings -->
<div class="frame-box">
    <div id="insiderSettings">
        <div class="frame-box__inner frame-box__inner--dark frame-box__inner--padding">

            <h3 class="h3 light space-between">
                <div class="flex_container spaced">
                    <span class="title_name flex_item">Insider Settings</span>
                    <button type="button" class="btn-aoe btn-aoe--small js-button js-insiders_modal optout_btn flex_item">Opt Out</button>
                </div>
            </h3>

            <div class="frame-box__inner--light space-between space-above--large-below">
                <div class="row">
                    <div class="columns">
                        @include('profile.insider.insider-setting-betaPrefs')
                        @include('profile.insider.insider-setting-steam')
                        @include('profile.insider.insider-setting-dxdiag')
                        @include('profile.insider.insider-setting-gameprefs')
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>