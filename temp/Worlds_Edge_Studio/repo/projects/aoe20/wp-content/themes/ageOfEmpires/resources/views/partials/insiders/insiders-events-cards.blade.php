<div class="insiders__event-card {{$card['game']['value']}} js-event-card" id="{{$card['flight_id']}}">

    {{-- front face --}}
    <div class="insiders__event-card-face {{$card['game']['value']}} --front js-card-face">
        <div class="insiders__event-card-content-container">

            @include("partials.insiders.insider-event-card-header")

            <?php $inBeta = in_array($card['flight_id'],$flights->betaEnrollment); ?>

            @if($insider_status)

                    <?php

                    if($insider->has_specs === 'complete') {
                        $vram_qualified = $card['system_requirements']['vram'] <= $pc_specs->vram ? ($pc_specs->warnings ? 'warning' : 'complete') : 'inadequate';
                        $ram_qualified = $card['system_requirements']['ram'] <= $pc_specs->ram ? 'complete' : 'inadequate';
                    }

                    if(!empty($card['system_requirements']['ram'])) {
                        $ram_qualified = $card['system_requirements']['ram'] <= $pc_specs->ram ? 'complete' : 'inadequate';
                    }

                    if (!empty($card['system_requirements']['vram'])) {
                        $vram_qualified = $card['system_requirements']['vram'] <= $pc_specs->vram ? ($pc_specs->warnings ? 'warning' : 'complete') : 'inadequate';
                    }

                    if(isset($vram_qualified) && isset($ram_qualified)){
                        $min_spec = ($vram_qualified === 'complete' && $ram_qualified === 'complete') ? 'complete' : 'inadequate';
                    }

                    ?>
            @endif

            <div class="insiders__event-content">

                @if($insider_status)
                    @if($inBeta)
                    <div class="insiders__event-inclusion">
                        <h4 class="insiders__event-inclusion-message">You're in!</h4>
                    </div>
                    @endif

                    <div class="insiders__event-requirements">
                        <h5>Program Requirements</h5>
                        <ul class="insiders__event-requirements-checklist">
                            @if($card['req_steam'])
                                <li class="{{$insider->has_steam}}">Steam Connected</li>
                            @endif

                            @if($card['req_dx'])
                                <li class="{{$min_spec}}">Minimum Specifications</li>
                            @endif

                            @if($card['misc_message'])
                                <li class="misc_message">{{$card['misc_message']}}</li>
                            @endif
                        </ul>
                    </div>

                    <div class="insiders__event-card-button-group">
                        <button class="card-turner --to-back js-card-turner">
                            {{icon('info', 'icon --info')}}
                            Session Details
                        </button>

                        @if($inBeta)
                            @if ($card['post_invite_buttons'])
                            <div class="insiders__event-card-button-group-post-invite">
                                @foreach ($card['post_invite_buttons'] as $button)
                                    <?php
                                        $buttonHref = "";

                                        switch($button['type']) {
                                            case 'blog_article':
                                                $buttonHref = get_permalink($button['article']->ID);
                                                break;
                                            case 'internal_page':
                                                $buttonHref = $button['page'];
                                                break;
                                            case 'url':
                                                $buttonHref = $button['url'];
                                                break;
                                        }
                                    ?>

                                    <a class="more-button" href="{{$buttonHref}}" target="_blank">{{$button['button_text']}}</a>
                                @endforeach
                            </div>
                            @endif

                            
                            @if($card['platform'])
                            <div class="insiders__event-platforms">
                                @if($card['platform'][0] == 'windows')
                                <!-- prefer to open application over web interface -->
                                   <button class="insiders__event-launch-xbox-hub js-xbox-hub">Login to the Xbox Insider Hub</button>
                                @endif

                                @if($card['platform'][0] == 'steam' && ($card['steam_key'] || $card['branch_password'] || $card['extra_install_instruct']))
                                <div class="insiders__event-keys js-event-keys">
                                    <div class="insiders__event-keys-inner">
                                       <button class="insiders__event-reveal-btn js-reveal-key">Reveal Access Key</button>
                                       
                                       <div class="insiders__event-reveal-face js-reveal-face">
                                            <ul>
                                            @if(isset($card['steam_key']))
                                                <li>
                                                    <span class="label">Steam Key</span>
                                                    <span>{{$card['steam_key']}}</span>
                                                </li>
                                            @endif
                                            @if(isset($card['branch_password']))
                                                <li>
                                                    <span class="label">Branch Password</span>
                                                    <span>{{$card['branch_password']}}</span>
                                                </li>
                                             @endif
                                            </ul>
                                           @if($card['extra_install_instruct'])
                                            <div class="insiders__event-reveal-extra">
                                                {!! $card['extra_install_instruct'] !!}
                                            </div>
                                            @endif
                                            <button class="insiders__event-hide-btn js-reveal-key">
                                                {{icon('pointer-left', 'icon --pointer-left')}}
                                                Return
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                @endif
                            </div><!-- end of js-event-keys -->
                            @endif <!-- end of card/platform output -->

                        @endif <!-- end of in beta -->
                    </div><!-- end of insiders__event-card-button-group -->



                    @if($inBeta)
                    <button type="button">Resend Invitation</button>

                    @else
                        <?php 
                            $inviteDate = ""; 

                            // if exact_date_type is true, we'll get a date. If it's false, we'll get text 
                            // invite_date_type is true for exact date
                            if(!empty($card['invite_date_type'])) {
                                if(!empty($card['invite_date']) && strtotime($card['invite_date'])) {
                                    $inviteDate = $card['invite_date'];
                                }
                            } else {
                                if(!empty($card['invite_date_text'])) {
                                    $inviteDate = $card['invite_date_text'];
                                }
                            }
                        ?>

                        @if(!empty($inviteDate))
                            <div class="insiders__event-invites">
                                <h5>Next Invites:</h5>
                                <span class="insiders__event-invite-date">{{$inviteDate}}</span>
                            </div>
                        @endif

                    @endif
                @endif
            </div><!-- end of insiders__event-content -->
        </div>
    </div>


    {{-- back face --}}
    @if($insider_status)
        <div class="insiders__event-card-face --back js-card-face">
            <div class="insiders__event-card-content-container">

                @include("partials.insiders.insider-event-card-header")

                <div class="insiders__event-content">

                    @if ( $card['duration']['start'] && $card['duration']['end'] )
                        <p class="insiders__event-duration">{{$card['duration']['start']}} - {{$card['duration']['end']}}</p>
                    @endif

                    @if ( $card['short_description'] )
                        <p>{{$card['short_description']}}</p>
                    @endif

                    @if ($card['req_dx'])
                        <div class="insiders__event-requirement-comparison">
                            @if ( $card['system_requirements']['ram'] || $card['system_requirements']['vram'] )

                                <h6 class="insiders__event-requirement-header">System Requirements:</h6>

                                <ul class="insiders__event-requirement-checklist">
                                    @if( !empty($card['system_requirements']['ram']) )
                                        <li class="insiders__event-requirement --ram {{$ram_qualified}}">{{$card['system_requirements']['ram']}}GB RAM</li>
                                    @endif

                                    @if( !empty($card['system_requirements']['vram']) )
                                        <li class="insiders__event-requirement --vram {{$vram_qualified}}">{{$card['system_requirements']['vram']}}GB VRAM</li>
                                    @endif
                                </ul>

                                @if($vram_qualified === 'warning')
                                    <p class="insiders__event-requirement-tip">Shared VRAM may affect eligibility. <a href="/support/insider-faq/#beta-VRAM">See FAQ.</a>
                                @endif

                                <h6 class="insiders__event-requirement-header">Your System</h6>

                                <ul class="insiders__event-requirement-checklist --user">
                                    @if ($insider->has_specs === 'complete')
                                        @if( !empty($card['system_requirements']['ram']) )
                                            <li class="insiders__event-requirement --ram" {{$ram_qualified}}>{!! $pc_specs->ram !!}GB RAM</li>
                                        @endif

                                        @if( !empty($card['system_requirements']['vram']) )
                                            @if($vram_qualified === 'warning')
                                                <a href="/support/insider-faq/#beta-VRAM" data-tooltip title="Warning. See FAQ.">
                                            @endif
                                            <li class="insiders__event-requirement --vram {{$vram_qualified}}">{!! $pc_specs->vram !!}GB  VRAM</li>
                                            @if($vram_qualified === 'warning')
                                                </a>
                                            @endif
                                        @endif
                                    @else
                                        <li>
                                            <a href="/profile#insiderSettingDxDiag" class="insiders__button">Upload DXDiag</a>
                                        </li>
                                    @endif
                                </ul>
                            @endif

                        </div>
                    @endif

                    @if($card['system_requirements']['extra_requirement'])
                    <ul class="insiders__event-requirement --extra_requirement">
                        <li class="extra_requirement">{{$card['system_requirements']['extra_requirement']}}</li>
                    </ul>
                    @endif

                    
                    @if($card['show_more_details'])
                    <p class="insiders__event-requirement-tip --lower">For all requirements, see More Details.</p>
                     @endif
                    <div class="insiders__event-card-button-group">
                        <button class="insiders__button-card-turner js-card-turner">
                            {{icon('pointer-left', 'icon --pointer-left')}}
                            Return
                        </button>
                        @if($card['show_more_details'])
                        <button class="insiders__button-more js-event-details-button" data-open="eventDetails{{$cardIndex}}">
                            {{icon('info', 'icon --info')}}
                            More Details
                        </button>
                        @endif
                    </div>
                </div>
            </div>
        </div>  
        @include('components.modal-insider-event-details')
    @endif
</div>
