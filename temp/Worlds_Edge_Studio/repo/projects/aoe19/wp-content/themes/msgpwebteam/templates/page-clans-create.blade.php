{{--
  Template Name: Clans Create
--}}

@extends('layouts.base-alt')

@php($userObj = wp_get_current_user())

@if((isset($userObj->msa_uhs) && !empty($userObj->msa_uhs)) && (isset($userObj->msa_token) && !empty($userObj->msa_token)) && (isset($userObj->msa_xuid) && !empty($userObj->msa_xuid)))

    @section('content')
        @while(have_posts()) @php(the_post())
        @include('partials.clans-create-banner')
        <div class="content section--gold-divider section--padding-bottom background--rock clans-content clans-create-content">
            <div class="row">
                <main class="main" id="clans-create-main">
                    <div class="frame-box frame-box--form">
                        <div class="frame-box__inner frame-box__inner--light frame-box__inner--loading">
                            <div id="clans-create"></div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        @endwhile
    @endsection

@else

    @section('content')
        @while(have_posts()) @php(the_post())
            @include('partials.clans-create-banner')
            <div class="content section--gold-divider section--padding-bottom background--rock clans-content clans-create-content">
                <div class="row">
                    <main class="main" id="clans-create-main">
                        <div class="alert">
                            <div class="alert__content">
                                <div class="alert__message">
                                    <h4 class="alert__title">Sorry!</h4>
                                    <br/>
                                    <p class="alert__desc">Creating a clan requires sign-in with an active Xbox Live Account. To get started, please sign
                                        in using your Microsoft Account.
                                        <br/>
                                        <br/>
                                        If you don't have a Microsoft or Xbox Live account, you can create one <a class="dark-link not_a_link" href="https://auth.ageofempires.com/">here.</a></p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            @endwhile
    @endsection

@endif