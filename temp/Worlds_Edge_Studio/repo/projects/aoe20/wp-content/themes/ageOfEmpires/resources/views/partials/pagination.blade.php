
@if($pagination['numTotalPages'] > 1)
    <nav class="pagination" aria-label="Pagination">

        @if($pagination["numCurPage"] != 1)
            <a class="pagination__control" href="{{$current_base}}/?paged={{$pagination["numCurPage"] - 1}}&game={{$current_tax}}#newsPosts" aria-label="previous page">
                {{icon('pointer-left')}}
            </a>
        @else
            <span class="pagination__control disabled">{{icon('pointer-left')}}</span>
        @endif

        @if($pagination["numCurPage"] == 1)
            <span class="pagination__number --current">{{$pagination["numCurPage"]}}</span>
        @else
            <a class="pagination__number" href="{{$current_base}}/?paged=1&game={{$current_tax}}#newsPosts" aria-label="page 1" data-page="1">1</a>
        @endif

        @if($pagination['showFirstNav'])
            <span class="pagination__number --ellipsis">&hellip;</span>
        @endif

        @if($pagination['numTotalPages'] > 1)
            @foreach($pagination['arrPageRange'] as $index)
                @if($index == $pagination['numCurPage'])
                    <span class="pagination__number --current">{{ $index }}</span>
                @else
                    <a class="pagination__number" href="{{$current_base}}/?paged={{ $index }}&game={{$current_tax}}#newsPosts" aria-label="page {{ $index }}" data-page="{{ $index }}">{{ $index }}</a>
                @endif
            @endforeach
        @endif

        @if($pagination['showLastNav'])
            <span class="pagination__number --ellipsis">&hellip;</span>
        @endif

        @if($pagination["numCurPage"] == $pagination["numTotalPages"])
            <span class="pagination__number --current">{{$pagination["numTotalPages"]}}</span>
        @else
            <a class="pagination__number" href="{{$current_base}}/?paged={{ $pagination['numTotalPages'] }}&game={{$current_tax}}#newsPosts" aria-label="page {{ $pagination['numTotalPages'] }}" data-page="{{ $pagination['numTotalPages'] }}">{{ $pagination['numTotalPages'] }}</a>
        @endif

        @if($pagination["numCurPage"] != $pagination["numTotalPages"])
            <a class="pagination__control" href="{{$current_base}}/?paged={{$pagination["numCurPage"] + 1}}&game={{$current_tax}}#newsPosts" aria-label="previous page">
                {{icon('pointer-right')}}
            </a>
        @else
            <span class="pagination__number disabled">{{icon('pointer-right')}}</span>
        @endif
    </nav>
@endif
