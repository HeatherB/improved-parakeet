<?php
/**
 * Template Name: MS Account Link
 * Allow MS Employees to link accounts.
 *
 */

?>

@extends('layouts.base')

@section('content')

    @include('partials.banner')

    <section class="block-content section--divider-frank-mid background--paper content">
        <div class="{{ $content }} section--padding background--paper">
            <div class="row">
                <div class="column small-12 medium-12">


                    @if(is_user_logged_in())

                        <?php
                            $current_user = wp_get_current_user();
                            $insider_status = $current_user->is_insider;
                            $gamertag = $current_user->msa_gt;
                            $ms_user = 0;

                            // Get beta information
                            if ($current_user->d365_contactid) {
                                $insider = json_decode(\Roots\Dynamics\Subscription::getSubscriber(), true);
                                $gamertag = isset($insider['gps_moderngamertag']) ? $insider['gps_moderngamertag'] : $current_user->msa_gt;
                                $ms_user = $insider['new_ismsfte'];
                                $ms_email = $insider['new_msalias'];
                            }
                        ?>

                        @if ($insider_status == 1 && $ms_user != 1)

                            <p><strong>Welcome, {{$gamertag}}</strong></p>

                            <p>Thank you again for your interest in the <em>Age of Empires</em> Insider Program!</p>
                            <p>By associating your Microsoft Employee alias with your <em>Age</em> Insider account, you will
                                become eligible for internal-only <em>Age</em> flights as well as increase your chances of
                                receiving an invitation to early pre-alphas, alphas, betas, and more! </p>
                            <p>Please note that we will still require you to meet any designated technical requirements. Like
                                with all <em>Age</em> Insiders, the program's <a href="{!! home_url('/nda') !!}">Guidelines & NDA</a> apply to your
                                participation. </p>
                            <br/>
                            <div class="survey-button-container text-center">
                                <a href="https://auth.ageofempires.com?env=aad-link" class="button cta save-survey-data">Link my Accounts</a>
                            </div>

                        @elseif($insider_status == 1 && $ms_user == 1)

                            <p><strong>Congrats, {!! str_replace('@microsoft.com', '', $ms_email) !!}!</strong></p>

                            <p>You have associated your alias with this <em>Age</em> Insider Account:
                                <strong>{{$gamertag}}</strong></p>

                            <p>This means you are eligible for consideration for internal-only Age flights, including early
                                pre-alphas, alphas, betas, and more! </p>

                            <p><strong>So what's next?</strong> Make sure that you have a DxDiag uploaded to your <a
                                        href="{!! home_url('/profile') !!}"><em>Age</em> Insider Profile</a> from the machine that you want to play
                                on; this can be your personal machine. We use this to determine your technical eligibility. </p>

                            <p>If you would like to no longer associate your alias with this account, you can choose to Opt Out
                                of the <em>Age</em> Insider Program at any time from your <a href="{!! home_url('/profile') !!}"><em>Age</em>
                                    Insider Profile</a>. </p>
                            <br/>
                            <div class="survey-button-container text-center">
                                <a href="{!! home_url('/profile') !!}" class="button cta save-survey-data">Return to Profile</a>
                            </div>

                        @else

                            <p><strong>Hey there, {{$current_user->display_name}}!</strong></p>

                            <p>Thank you for your interest in the <em>Age of Empires</em> Insider Program!  </p>

                            <p>It does not look like you are currently registered as an <em>Age</em> Insider. Click the sign-up button to get started on your registration or
                                <a href="{!! home_url('/support/insider-faq#insider-description') !!}">read about the perks</a> of being an
                                <em>Age</em> Insider! </p>

                            <div class="survey-button-container text-center">
                                <a href="{!! home_url('/insider-signup') !!}" class="button cta save-survey-data">Become an
                                    <em>Age</em> Insider!</a>
                            </div>
                            <br/>
                            <p>
                                After you are an <em>Age</em> Insider, you may need to return to
                                <a href="https://aka.ms/AgeInsiderFTE">aka.ms/AgeInsiderFTE</a> again to continue with
                                associating your account with your Microsoft employee alias to become eligible for internal-only
                                <em>Age</em> flights as well as increase your chances of receiving an invitation to early
                                pre-alphas, alphas, betas, and more!
                            </p>

                            <p>
                                Please note that we will still require you to meet any designated technical requirements. Like
                                with all <em>Age</em> Insiders, the program's <a href="{!! home_url('/nda') !!}">Guidelines & NDA</a> apply to your
                                participation.
                            </p>

                        @endif

                    @elseif ($user_data == null)
                        @php(wp_redirect('https://auth.ageofempires.com/home/loginaad?env=aad-link'))
                        @php(exit)
                    @else

                        <p><strong>Hi there, {{$user_data['FirstName']}}!</strong></p>
                        <p>Thanks so much for your interest in the <em>Age of Empires</em> Insider Program! </p>

                        <p>To get started you will need to sign into the <em>Age of Empires</em> website using your personal
                            Xbox Live account (linked to your personal Microsoft Account). </p>

                        <p>You may need to return to <a href="https://aka.ms/AgeInsiderFTE">aka.ms/AgeInsiderFTE</a> again after you are signed-in.</p>
                        <br/>
                        <div class="survey-button-container text-center">
                            <a href="javascript:void(0);" class="button cta save-survey-data js-sign-in">Sign In to Begin</a>
                        </div>

                @endif

                <!-- for all pages -->
                    <div class="questions_problems">Questions? Problems?
                        <a href="https://microsoft.sharepoint.com/teams/AgeofEmpires/SitePages/FTE-Registration-FAQ.aspx" target="_blank">Please see our FAQ for additional support</a> (MS alias sign-in required).
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script type="text/javascript">
        window.history.replaceState(null, null, window.location.pathname);
    </script>

@endsection
