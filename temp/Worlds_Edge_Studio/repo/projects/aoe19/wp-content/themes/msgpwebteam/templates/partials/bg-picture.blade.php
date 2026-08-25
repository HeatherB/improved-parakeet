<picture class="bg-picture__background">
    <?php 
        $mobile = $options['content_area_imgs']['mobile'];
        $tablet = $options['content_area_imgs']['tablet'];
        $desktop = $options['content_area_imgs']['desk'];
        $ultra = $options['content_area_imgs']['ultra'];
    ?>

    {{-- if a mobile image was uploaded ... --}}
    @if($mobile)
        {{-- add it as a source on screens smaller than its width --}}
        <source media="(max-width: {{$mobile['width']}}px)" srcset="{{$mobile['url']}}" loading="eager">
        {{-- if mobile AND tablet images were uploaded --}}

        @if($tablet)
            {{-- start tablet image at screens larger than the mobile image, and screens smaller than its width --}}
            <source media="(min-width: {{$mobile['width']}}px) and (max-width: {{$tablet['width']}}px)" srcset="{{$tablet['url']}}" loading="eager">
            {{-- then start desktop image at screens larger than the tablet image, using ultra as @2x if it was uploaded --}}
            <source media="(min-width: {{$tablet['width']}}px)" srcset="{{$desktop['url']}} @if($ultra), {{$ultra['url']}} 2x @endif" loading="eager">

        {{-- if a mobile image was uploaded, but NOT a tablet image --}}
        @else
            {{-- start the desktop image from screens larger than the mobile image --}}
            <source media="(min-width: {{$mobile['width']}}px)" srcset="{{$desktop['url']}} @if($ultra), {{$ultra['url']}} 2x @endif" loading="eager">
        @endif

    {{-- if no mobile image was uploaded, but a tablet image WAS uploaded--}}
    @elseif($tablet)
        {{-- add tablet image for screens smaller than its width --}}
        <source media="(max-width: {{$tablet['width']}}px)" srcset="{{$tablet['url']}}" loading="eager">
        {{-- then start desktop image at screens larger than the tablet image, using ultra as @2x if it was uploaded --}}
        <source media="(min-width: {{$tablet['width']}}px)" srcset="{{$desktop['url']}} @if($ultra), {{$ultra['url']}} 2x @endif" loading="eager">

    {{-- if not mobile image or tablet image were uploaded --}}
    @else
        {{-- use desktop image for all screen sizes, using ultra as @2x if it was uploaded --}}
        <source srcset="{{$desktop['url']}} @if($ultra), {{$ultra['url']}} 2x @endif" loading="eager">
    @endif

    {{-- fallback --}}
    <img srcset="{{$desktop['url']}}">
</picture>