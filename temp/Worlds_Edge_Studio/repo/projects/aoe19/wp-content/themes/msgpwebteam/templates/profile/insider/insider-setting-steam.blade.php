<div class="insider_block" id="insiderSettingSteam">
  <span class="title">
    <div class="flex_container spaced">
      <span class="title_name flex_item <?php echo !empty($dynamics['persona_name']) ? 'complete' : 'incomplete' ?>">Steam</span>
      <span class="flex_item tooltip_icon" tabindex="1" data-tooltip
            title="A green checkmark icon indicates completed information. A red exclamation icon indicates pending, or incomplete information."></span>
    </div>
  </span>
    <div class="insider_content">
        @if(empty($dynamics['persona_name']))
            <button type="button" id="link_steam" href="{{home_url('steam-login')}}?link_steam=1" class="btn-aoe btn-aoe--small js-button js-steam_connect button">Link Steam</button>
        @else
            <span class="insider_label">Steam ID:</span>
            <span class="steam_id">{!! $dynamics['persona_name'] !!}</span>
            <br>
            <button type="button" href="{{home_url('steam-login')}}?link_steam=1" class="btn-aoe btn-aoe--small js-button js-steam_connect">Relink</button>
            @if(!empty($dynamics['persona_name']))
                <button type="button"
                        class="btn-aoe btn-aoe--small btn-aoe--gold js-button js-insiders_modal disconnect_steam_btn flex_item">
                    Disconnect
                </button>
            @endif
        @endif
    </div>
</div>