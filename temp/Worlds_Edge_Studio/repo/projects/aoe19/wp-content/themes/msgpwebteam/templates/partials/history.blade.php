@if(get_field($field . '_content'))
    @php
        $card_header = str_replace('_', ' ', $field);
    @endphp
    <div class="frame-box frame-box--card">
        <div class="frame-box__inner--light">
            <div class="history__card">
                <h3 class="history__header" id="{{$field}}">{{$card_header}}</h3>
                {!! get_field($field . '_content') !!}
            </div>
        </div>
    </div>
@endif