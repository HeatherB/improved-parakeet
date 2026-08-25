<?php
$category_id = '';
if ( is_category()) :
    $category_id = get_query_var('cat');
endif;
?>
<div class="row">
    
    <!-- news filters -->
        <div class="columns mods-filters__column-30">
            <select id="categorySelect" name="categorySelect">
                <option value="{{get_site_url()}}/news/?game={!! $current_tax !!}">All Categories</option>
                @php($categories = get_the_category())
                @forelse($cats as $cat)
                    @forelse($cat as $the_cat)
                        @if($the_cat['name'] != 'MOTD')
                            <option <?php if($category_id == $the_cat['ID']) : echo "selected"; endif; ?>  value="{{$the_cat['href']}}?game={!! $current_tax !!}">{{$the_cat['name']}}</option>
                        @endif
                    @empty
                        <h1>EMPTY!</h1>
                    @endforelse
                @empty
                    <h1>EMPTY!</h1>
                @endforelse
            </select>
        </div>
</div>