@if($pagination['numTotalPages'] > 0)
    <h4 class="pagination-title">Displaying <strong>{{ $pagination['numItemStart'] }}-{{ $pagination['numItemEnd'] }}</strong> of <strong>{{ $pagination['numTotalItems'] }}</strong></h4>
@endif
    @if($pagination['numTotalPages'] > 1)
    <ul class="pagination" role="navigation" aria-label="Pagination">
        @if($pagination["numCurPage"] == 1)
            <li class="current">{{$pagination["numCurPage"]}}</li>
        @else
            <li><a href="{{$current_base}}/?paged=1&game={{$current_tax}}" aria-label="page 1" data-page="1">1</a></li>
        @endif

        @if($pagination['showFirstNav'])
            <li class="ellipsis"></li>
        @endif

        @if($pagination['numTotalPages'] > 1)
            @foreach($pagination['arrPageRange'] as $index)
                @if($index == $pagination['numCurPage'])
                    <li class="current">{{ $index }}</li>
                @else
                    <li><a href="{{$current_base}}/?paged={{ $index }}&game={{$current_tax}}" aria-label="page {{ $index }}" data-page="{{ $index }}">{{ $index }}</a></li>
                @endif
            @endforeach
        @endif

        @if($pagination['showLastNav'])
            <li class="ellipsis"></li>
        @endif

        @if($pagination["numCurPage"] == $pagination["numTotalPages"])
            <li class="current">{{$pagination["numTotalPages"]}}</li>
        @else
            <li><a href="{{$current_base}}/?paged={{ $pagination['numTotalPages'] }}&game={{$current_tax}}" aria-label="page {{ $pagination['numTotalPages'] }}" data-page="{{ $pagination['numTotalPages'] }}">{{ $pagination['numTotalPages'] }}</a></li>
        @endif
    </ul>
@elseif ($pagination['numTotalPages'] < 1)
    <h4 style="max-width: 100% !important;" class="pagination-title"><strong>There are currently no posts that match the specified criteria.</strong></h4>
@endif
