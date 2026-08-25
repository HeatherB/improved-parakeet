<?php
// Get content From ACF
$options = get_fields();

/* logged out FAQs */
$acf_insider_landing_faq = $options['acf_insider_landing_faq'];
$acf_insider_landing_faq_title = $options['acf_insider_landing_faq']['insider_faq_title'];
$acf_insider_landing_faq_description = $options['acf_insider_landing_faq']['insider_faq_description'];
/* zenfaqs */
$zenFaqs = [get_option('zendesk_faq_selection_0'),get_option('zendesk_faq_selection_1'),get_option('zendesk_faq_selection_2')];

?>

<section>
	<div class="page-container">
		<div class="insiders__block-faq">
			@if($acf_insider_landing_faq_title)
			<h3 class="insiders__section-heading">{{$acf_insider_landing_faq_title}}</h3>
			@endif

			@if($acf_insider_landing_faq_description)
			<div class="copy">
				{!!$acf_insider_landing_faq_description!!}
			</div>
			@endif

			@if ($zenFaqs)
		      <div class="js-zenfaq">
		          @foreach ($zenFaqs as $zenFaq)
		            @if (!empty($zenFaq))
		            <div class="cordian" data-zenid="{{$zenFaq}}">
		              <button class="title linkreset" type="button"></button>
		              <div class="text">
		                <div class="words"></div>
		              </div>
		            </div>
		            @endif
		         @endforeach
		      </div>
		    @endif

		    <p>
		      You can also read up on other common questions in the official Insider FAQ or ask any unanswered questions in the Insider forum.
		    </p>

			<div class="insiders__buttons">
				<a href="/" class="insiders__button">Insider FAQ</a>
				<a href="/" class="insiders__button">Insider Forum</a>
			</div>

			
		</div>
	</div>
</section>