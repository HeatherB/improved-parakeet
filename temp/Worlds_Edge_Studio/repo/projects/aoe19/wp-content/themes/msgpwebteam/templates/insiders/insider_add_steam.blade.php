<div class="question cordian disabled">
    <span class="title">
        <span class="title_name">{!! $insider_steam[0]['steam_title'] !!}</span>
    </span>
    <div class="insider_content">
        <div class="error_msg"></div>
        <div class="ac_content_container">
            <div class="ac_content">
                <form id="insider_steam">

                    {!! $insider_steam[0]['steam_content'] !!}

                    <div class="steam_connected">
                        <div class="disconnect_steam_container">
                            <div class="disconnect_steam btn-aoe hidden">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" xml:space="preserve" focusable="false">
                                    <path d="M20,0C9.5,0,0.9,8.1,0.1,18.4l10.7,4.4c0.9-0.6,2-1,3.2-1c0.1,0,0.2,0,0.3,0l4.8-6.9c0,0,0-0.1,0-0.1c0-4.2,3.4-7.5,7.5-7.5
                                    c4.2,0,7.5,3.4,7.5,7.5c0,4.2-3.4,7.5-7.5,7.5c-0.1,0-0.1,0-0.2,0l-6.8,4.9c0,0.1,0,0.2,0,0.3c0,3.1-2.5,5.7-5.7,5.7
                                    c-2.7,0-5-2-5.6-4.5l-7.7-3.2C3.1,33.8,10.8,40,20,40c11,0,20-9,20-20C40,9,31,0,20,0z M12.6,30.3l-2.5-1c0.4,0.9,1.2,1.7,2.2,2.1
                                    c2.2,0.9,4.7-0.1,5.6-2.3c0.4-1,0.4-2.2,0-3.2c-0.4-1-1.2-1.9-2.3-2.3c-1-0.4-2.2-0.4-3.1,0l2.5,1c1.6,0.7,2.4,2.5,1.7,4.1
                                    C16,30.3,14.2,31,12.6,30.3z M31.6,14.8c0-2.8-2.3-5-5-5s-5,2.3-5,5s2.3,5,5,5S31.6,17.6,31.6,14.8z M22.8,14.8
                                    c0-2.1,1.7-3.8,3.8-3.8s3.8,1.7,3.8,3.8c0,2.1-1.7,3.8-3.8,3.8C24.5,18.6,22.8,16.9,22.8,14.8z"></path>
                                </svg>
                                <span class="steam_personaname"></span>
                                <span class="disconnect js-steam_delete">Disconnect</span>
                            </div>
                        </div>
                    </div>

                    <div class="survey-button-container upper_survey_buttons add_steam">
                        <button type="button" href="{{home_url('steam-login')}}?link_steam=1" class="button cta save-survey-data js-steam_connect">Add Steam Account</button>
                    </div>

                    {!! $insider_steam[1]['steam_content'] !!}

                    <div class="survey-button-container">
                        <button class="button cta btn--back">Back</button>
                        <button class="button cta save-and-continue btn--skip" data-for-question="steam_login">Skip &amp; Continue</button>
                        <button class="button cta save-and-continue btn--save hidden" data-for-question="steam_login">Save &amp; Continue</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>