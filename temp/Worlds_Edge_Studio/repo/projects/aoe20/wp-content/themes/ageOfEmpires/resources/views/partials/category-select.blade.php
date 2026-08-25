@if ( is_category())
    @php $category_id = get_query_var('cat') @endphp
@endif

<select id="categorySelect" name="categorySelect" class="category-select">
    <option value="{{get_site_url()}}/?game={!! $current_tax !!}">All Categories</option>

    @forelse($cats as $cat)
        @forelse($cat as $the_cat)
            @if($the_cat['name'] != 'MOTD')
                @php($is_selected = isset($category_id) && $category_id == $the_cat['ID'] ? true : false)

                <option @if($is_selected) selected @endif  value="{{$the_cat['href']}}?game={!! $current_tax !!}">{!! $the_cat['name'] !!}</option>
            @endif
        @empty
        @endforelse
    @empty
    @endforelse
</select>
