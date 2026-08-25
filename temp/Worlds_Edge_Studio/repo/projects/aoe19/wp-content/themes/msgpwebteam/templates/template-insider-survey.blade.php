{{--
  Template Name: Insider Survey
--}}

@extends('layouts.insider-program')

@section('content')
    @include('partials.insider-signup-banner')
    <div class="content">
        <div class="insider_survey" data-survey_name="{!! get_field('insider_survey_name','option') !!}" data-title_id="<{!! get_field('insider_survey_title_id','option') !!}">
            <div class="substance teasers">
                <div class="tease">
                    @if(!is_user_logged_in())
                        @include('insiders.insider_welcome')
                    @else
                        @include('insiders.insider_nda')
                        @include('insiders.insider_contact_prefs')
                        @include('insiders.insider_beta_prefs')
                        @include('insiders.insider_add_steam')
                        @foreach(get_field('insider_game_preferences', 'option') as $index => $question)
                            @include('insiders.question_accordion')
                        @endforeach
                        @include('insiders.insider_upload_dxdiag')
                        @include('insiders.insider_survey_summary')
                    @endif
                    <div class="frame-gold"></div>
                </div>
            </div>
        </div>
    </div>
@endsection