{{-- See Style Guide page for example use
 accepted arguments:    
    $title             : required, the summary/title of the accordion, expects string
    $content           : the description/content of the accordion
                         Can be a path to a partial (must start with 'partials'), content from Wordpress, or other html content
    $id                : required, a unique ID for this accordion panel
    $class             : optional, adds specified class the accordion element
    $state             : optional, default is closed, accepts 'open', 'closed','disabled'
--}}

@if (isset($title) && isset($content))
    <div class="@if (isset($class)) {{$class}} @endif accordion">
        <h3 class="accordion__title__bar">
            <button 
                id="accordionTitle{{$id}}" 
                class="accordion__title__container js-accordion-title @if(isset($state) && $state != 'open' || !isset($state))--is-closed @endif" 
                aria-controls="accordionTitle{{$id}}" 
                aria-expanded="false" 
                @if(isset($state) && $state == "disabled")disabled @endif
            >
                <span class="accordion__title">{{$title}}</span>
                {{icon('pointer-up', 'accordion__pointer')}}
            </button>
        </h3>
        <div id="accordionPanel{{$id}}" aria-labelledby="accordionTitle{{$id}}" class="accordion__panel" @if(isset($state) && $state != 'open' || !isset($state))hidden @endif>
            @if (substr($content, 0, strlen('partials')) == 'partials')
                @include($content)
            @else
                {!!$content!!}
            @endif
        </div>
    </div>
@endif
