@extends('layouts.base')

@section('content')
    @include('partials.banner')

    <section class="block-content section--divider-frank-mid background--rock content">        
    	<div class="substance teasers">
			@foreach ($content_sections as $content_section) 
				@if ($content_section['acf_fc_layout'] == "content_block_intro")
					@include('partials.teasers-content-block')
				@endif
			@endforeach
    	</div>
    </section>

    <section class="block-content section--divider-frank-mid content">
    	<div class="substance teasers">
    		@foreach ($content_sections as $content_section) 
				@if ($content_section['acf_fc_layout'] == "content_block_start")
					@include('partials.teasers-content-block', ['styleClass' => 'empirewars--start secondary'])
				@endif

                @if ($content_section['acf_fc_layout'] == "content_block_play")
                    @include('partials.teasers-content-block', ['styleClass' => 'empirewars--play secondary'])
                @endif
			@endforeach
    	</div>
    </section>

@endsection