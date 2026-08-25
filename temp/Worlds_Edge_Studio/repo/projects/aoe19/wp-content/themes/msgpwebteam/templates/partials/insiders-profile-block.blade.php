 <div class="insider__profile">
    <div class="insider__profile__avatar">
        <?php if(!empty(wp_get_current_user()->msa_pp)){ ?>
            <img src="<?php echo wp_get_current_user()->msa_pp; ?>"/>
        <?php } else { ?>
            <img src="@asset('images/default/default-avatar.svg')"/>
        <?php } ?>
    </div>

    <div class="insider__profile__info">
        <h2 class="insider__profile__name">{{$insider->gamerName }}</h2>

        <p>Gamertag: <span class="insider__profile__gamertag">{{$insider->gamerName }}</span></p>
        <p>Steam: 
            @if (isset($insider->gps_steamid))
                <span class="insider__profile__steamname">{{$insider->gps_personaname}}</span>
            @else
                &nbsp;<a href="/profile#insiderSettingSteam" class="btn-aoe btn-aoe--small btn-aoe--borderless">Link Steam</a>
            @endif
        </p>
    </div>
    
</div>