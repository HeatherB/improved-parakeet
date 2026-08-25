{{--
  Template Name: Users Single
--}}

<?php

// If User is Singed in Perform Insider Operations
if(is_user_logged_in()){

    // Insider Information
    $survey_data = json_decode(Roots\Dynamics\Subscription::getSubscriber(),true);

    $survey_questions = json_decode($survey_data['gps_surveydata'],true);
    // Append demographics
    $survey_questions["demo_age"] = [$survey_data['gps_age']];
    if(!in_array(strtolower($survey_data['gps_gender']),['male','female','none'])){
        $survey_questions["demo_gender"] = [['other' => $survey_data['gps_gender']]];
    } else {
        $survey_questions["demo_gender"] = [$survey_data['gps_gender']];
    }

    $errorMessage = '';

    if(isset($survey_data)){

        $dynamics = [
            "is_insider"        => $survey_data['gps_isinsider'] ?? '',
            "persona_name"      => $survey_data['gps_personaname'] ?? '',
            "pref_email"        => $survey_data['emailaddress1'] ?? '',
            "last_updated"      => $survey_data['new_lastupdate'] ?? '',
            "country"           => $survey_data['gps_country'] ?? '',
            "email_confirmed"   => $survey_data['gps_emailconfirmed'] ?? false,
            "ms_contact"        => \Roots\Dynamics\Subscription::checkCPMSubscription($survey_data['emailaddress1'])['status'],
            "verification_key"  => $survey_data['new_emailverificationkey'] ?? '',
        ];

        // Check DxDiag
        if(isset($survey_data['gps_dxdiag'])){
            $hasDxDiag = true;
            $diag_date = strtotime(json_decode(stripslashes($survey_data['gps_dxdiag']))->SystemInformation->Time);
            // Check PC Specs
            if(isset($survey_data['gps_pcspecs']) && $survey_data['gps_pcspecs'] != 'null' && $survey_data['gps_pcspecs'] != '""' && $survey_data['gps_pcspecs'] != '{}'){
                $hasPCSpecs = true;
            } else {
                $hasPCSpecs = false;
                $errorMessage = "There is a problem with your dxdiag. Please reupload.";
            }
        } else {
            $hasDxDiag = false;
        }

        // Modal Data for welcome message and Video
        $insider_complete = get_field('insider_complete', 'option')[0];
        $video_id = $insider_complete['insider_intro_video'];
        $show_intro = $insider_complete['insider_show_intro'] ?? false;

    }

    // Handle General Warnings
    if(isset($_GET['warning'])){
        $errorMessage = get_field('warning_' . $_GET['warning'], 'option') ?? 'Error';
    }

    // Confirm Email -- TODO -- Check time on request
    if(isset($_GET['email_verify'])){
        if($_GET['email_verify'] === $dynamics['verification_key']){
            header(\Roots\Insiders\Insider::confirmEmail());
        } else if( isset(wp_get_current_user()->email_verification_key['timestamp']) && wp_get_current_user()->email_verification_key['timestamp'] <= strtotime('-7 days') ) {
            $errorMessage = get_field('warning_expired_email_verification');
        } else { // Nullified
            $errorMessage = get_field('warning_nullified_email_verification');
        }
    }

    $pref_email = (isset($dynamics['pref_email']) && !empty($dynamics['pref_email'])) ? $dynamics['pref_email'] : wp_get_current_user()->user_email;
    $country = (isset($dynamics['country']) && !empty($dynamics['country'])) ? $dynamics['country'] : wp_get_current_user()->msa_country;
}
?>

@extends('layouts.base-alt')

@section('content')

    <div class="dividers dividers--default">
        <div class="insiders insiders__banner">
            <div class="row column text-center">
                <h1 class="light"><?php the_title(); ?></h1>
            </div>
        </div>
        <div id="profile_error">
            @if(!empty($errorMessage))
                <span>{!! $errorMessage !!}</span>
            @endif
        </div>
        @while(have_posts()) @php(the_post())
        <section class="section-divider section--padding background--rock">

            @if(!is_user_logged_in())
                <div class="row">
                    <div class="frame-box">
                        <div class="frame-box__inner frame-box__inner--light">
                            <a href="javascript:void(0);" class="js-sign-in">Please sign in to view your profile.</a>
                        </div>
                    </div>
                </div>
            @else
                @if($users)
                    @forelse($users as $user)

                        <div class="profile-wrapper" data-insider_status="{!! $dynamics['is_insider'] ?? false !!}">
                            <aside class="profile-sidebar">
                                <div class="frame-box">
                                    <div class="frame-box__inner frame-box__inner--dark">
                                        <div class="profile-sidebar__pic">
                                            {!! $user['avatar'] !!}
                                        </div>
                                    </div>
                                </div>
                                <div class="mods-detail-legend">
                                    <dl>
                                        <dt>Gamertag</dt>
                                        <dd>{{$user['gamertag']}}</dd>
                                        <dt>Last Login</dt>
                                        <dd>{{ $user['last_login'] }}</dd>
                                    </dl>
                                </div>

                                @if(!$dynamics['is_insider'])
                                    <a href="{{get_bloginfo('url') . '/insider-signup'}}" class="button cta save-survey-data">INSIDER SIGNUP</a>
                                @endif

                            </aside>

                            <article class="profile-main">
                                @if(isset(wp_get_current_user()->msa_xuid) && !empty(wp_get_current_user()->msa_xuid))
                                    @include('profile.profile-setting-commPrefs')
                                @else
                                    <div class="row">
                                        <div class="frame-box">
                                            <div class="frame-box__inner frame-box__inner--light">
                                                <p>
                                                    Participation in the Age Insider Program requires sign-in with an active Xbox Live Account. To get started, or view the Insider Profile associated with your Steam Account, please sign in using your Microsoft Account.
                                                    <br />
                                                    <br />
                                                    If you don't have a Microsoft or Xbox Live account, you can create one <a href="https://auth.ageofempires.com/" >here.</a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                @endif
                                @if($dynamics['is_insider'])
                                  @include('profile.profile-setting-insider')
                                @endif
                                @include('profile.profile-setting-clan')
                            </article>
                        </div>
                    @empty
                    @endforelse
                @endif
            @endif
        </section>
        @endwhile
    </div>
    @if($dynamics['is_insider'])
        @include('components.modal-insiders-profile')
        @include('components.modal-insider_survey_complete')
        @include('components.modal-video')
    @endif
@endsection
