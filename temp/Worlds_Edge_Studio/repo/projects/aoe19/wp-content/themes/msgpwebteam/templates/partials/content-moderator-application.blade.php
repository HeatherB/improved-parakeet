<h3>Moderator Application</h3>

<div class="form_wrapper">
    <div class="col col_left">

        @if(!is_user_logged_in())
            <div class="button_wrapper">
                <button class="button js-sign-in ensure-signin">Sign In to Continue</button>
            </div>
        @else
            

            <form action="<?php the_permalink(); ?>" id="vcm-form" method="post">

                <label class="required">
                    <span>Name <sup>*</sup></span>
                    <input class="border--gold--thin" type="text" name="name" id="name" />
                </label>

                <div class="input_wrap checkbox_group">
                    <label for="confirm_age" class="required">
                        <input class="border--gold--thin standard" type="checkbox" id="confirm_age" name="confirm_age" value="confirm_age" />
                        <span class="styled_checkbox"></span>
                        <span>Please confirm you are over 18+ years of age. <sup>&#42;</sup></span>
                    </label>
                </div>

                <div class="input_wrap checkbox_group">
                    <label for="confirm_insider" class="required">
                        <input class="border--gold--thin standard" type="checkbox" id="confirm_insider" name="confirm_insider" value="confirm_insider" />
                        <span class="styled_checkbox"></span>
                        <span>Please confirm you are a member of the <a href="/insider-signup" target="_blank"><em>Age of Empires</em> Insider program.</a><sup>&#42;</sup></span>
                    </label>
                </div>

                <label class="required">
                    <span>Email <sup>*</sup></span>
                    <div class="validation_notice email"></div>
                    <input class="border--gold--thin" type="email" name="email" id="email" required />
                </label>

                <label class="required">
                    <span>Country of Residence <sup>&#42;</sup></span>
                    @include('partials.forms.select-country')
                </label>

                <label class="required_group group_ident">
                    <span>Steam ID</span>
                    <input class="border--gold--thin" type="text" name="steam_id" id="steam_id" />
                </label>

                <label class="required_group group_ident">
                    <span>Discord ID</span>
                    <input class="border--gold--thin" type="text" name="discord_id" id="discord_id" />
                </label>

                <label class="required_group group_ident">
                    <span>Xbox Gamertag (your <em>Age</em> Insider username)</span>
                    <input class="border--gold--thin" type="text" name="forum_gamertag" id="forum_gamertag" />
                </label>

                <div class="input_wrap checkbox_group">
                    <p>Which community do you prefer to moderate? (<sup>&#42;</sup>Please note Moderators will be expected to have a presence across all platforms, but we will do our best to accommodate your preference.)</p>
                    <label for="steam">
                        <input class="border--gold--thin standard" type="checkbox" id="steam" name="steam" value="steam" />
                        <span class="styled_checkbox"></span>
                        <span>Steam</span>
                    </label>

                    <label for="discord">
                        <input class="border--gold--thin standard" type="checkbox" id="discord" name="discord" value="discord" />
                        <span class="styled_checkbox"></span>
                        <span>Discord</span>
                    </label>

                    <label for="forums">
                        <input class="border--gold--thin standard" type="checkbox" id="forums" name="forums" value="forums" />
                        <span class="styled_checkbox"></span>
                        <span>Forums</span>
                    </label>
                </div>

                <div class="input_wrap">
                    <p>Why do you want to be an <em>Age</em> Moderator? <sup>*</sup></p>
                    <textarea class="border--gold--thin required" id="moderator_why" name="moderator_why" rows="10" cols="30"></textarea>
                </div>

                <div class="input_wrap checkbox_group">
                    <label for="terms" class="required">
                        <input class="border--gold--thin standard" type="checkbox" id="terms" name="terms" value="terms" />
                        <span class="styled_checkbox"></span>
                        <span>I have read the <a href="https://www.xbox.com/en-US/legal/community-standards" target="_blank">Xbox Community Standards</a> and the requirements for appplying to be an <em>Age Moderator.</em> <sup>&#42;</sup></span>
                    </label>
                </div>

                <div class="button_wrapper">
                    <button type="submit" id="submit-vcm" disabled class="btn-aoe--cta">Submit Application</button>
                    <div id="submission_alert">
                        <p class="success">Your application is on it's way. We'll be in touch soon!</p>
                        <p class="error">Your application failed to submit. Please try again.</p>
                    </div>
                </div>
                
            </form>
        @endif
    </div>

    <div class="col col_right">
        <div class="image_wrapper border--gold">
            <picture>
                <source srcset="@asset('images/bgs/moderators/moderator-signup-scene2-vert-desk.jpg'), @asset('images/bgs/moderators/moderator-signup-scene2-vert-4k.jpg') 2x" loading="eager">
                <img src="@asset('images/bgs/moderators/moderator-signup-scene2-vert-desk.jpg')" alt="apply to be an Age Moderator" />
            </picture>
        </div>
    </div>
</div>

          