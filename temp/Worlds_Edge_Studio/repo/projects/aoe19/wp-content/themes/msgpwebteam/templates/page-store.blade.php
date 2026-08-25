{{--
  Template Name: Store Test
--}}

@extends('layouts.base-alt')

@section('content')
    <div class="dividers dividers--default">
    	@include('partials.banner-page')        
        @while(have_posts()) @php(the_post())   
        	<div class="section-divider section--padding background--paper">
			    {{the_content()}}
<script>
  var exports = { __esModule: true };
  function purchaseProduct() {
    launchProductPurchase({ 
        productId: "9njdd0jgpp2q", 
        storeDomain: "www.xbox.com",
        styleOverrides: {
            "z-index": 1
        }
    })
      .then(result => console.log('purchase result: ${result}'))
      .catch(error => console.log('purchase error: ${error}'));
  }
</script>
<script src="https://assets.xbox.com/xbox-store-web-sdk/latest/purchaseHost.js"></script>
<div style="text-align: center;">
<a class="button cta" onclick="javascript: purchaseProduct()">Launch Purchase</a>
</div>

			</div>
        @endwhile
    </div>
@endsection
