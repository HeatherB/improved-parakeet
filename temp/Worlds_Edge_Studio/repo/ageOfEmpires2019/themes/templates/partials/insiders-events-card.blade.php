<div class="insider-event__card {{$card['game']['value']}} js-event-card" id="{{$card['flight_id']}}">

    {{-- front face --}}
    <div class="insider-event__card__face {{$card['game']['value']}} --front js-card-face">
        <div class="insider-event__card__content-container">

            @include("partials.insider-event-card-header")

            <?php $inBeta = in_array($card['flight_id'],$flights->betaEnrollment); ?>
            <?php #$inBeta = true; ?>

            <!-- if in beta -->
            @if($insider_status)
                @if($inBeta)
                    <div class="insider-event__inclusion">
                        <h4 class="insider-event__inclusion__message">You're in!</h4>
                    </div>
                @endif
            @endif
            <!-- end if in beta -->

            <div class="insider-event__content">

                @if($insider_status)
                    @if($inBeta)
                        <div class="insider-event__content__block insider-event__requirements js-event-keys">
                            <div class="insider-event__requirements__inner js-event-keys">
                                <div class="insider-event__card__button-group-wrapper">
                                    <button class="card-turner --to-back js-card-turner"><i class="icon icon--question" role="presentation"></i>Program Summary</button>

                                    @if ($card['post_invite_buttons'])
                                        <div class="insider-event__card__button-group_post-invite">
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
                                </div>
                        
                            <!-- test -->
                            <?php
                                $steam_key = "XXXX-XXXX-XXXXX";
                                $branch_password = "XXXX-XXXX-XXXXX";
                            ?>

                            @if($card['platform'])
                                @if($card['platform'][0] == 'windows')
                                <!-- prefer to open application over web interface -->
                                   <button class="insider-event__launch-xbox-hub js-xbox-hub btn-aoe">Login to the Xbox Insider Hub</button>
                                @endif

                                @if($card['platform'][0] == 'steam' && ($steam_key || $branch_password || $card['extra_install_instruct']))
                                <div class="insider-event__keys">
                                    <div class="insider-event__keys__inner">
                                       <button class="btn-aoe insider-event__reveal__btn js-reveal-key">Reveal Access Key</button>
                                       
                                       <div class="insider-event__reveal__face js-reveal-face">
                                           <ul>
                                            @if($steam_key)
                                               <li>
                                                   <span class="label">Steam Key</span>
                                                   <span>{{$steam_key}}</span>
                                               </li>
                                            @endif
                                            @if($branch_password)
                                               <li>
                                                   <span class="label">Branch Password</span>
                                                   <span>{{$branch_password}}</span>
                                               </li>
                                             @endif
                                           </ul>
                                           @if($card['extra_install_instruct'])
                                           <div class="insider-event__reveal__extra">
                                            {!! $card['extra_install_instruct'] !!}
                                            </div>
                                            @endif
                                           <button class="insider-event__hide__btn js-reveal-key"><i class="icon icon--arrow-left" role="presentation"></i>Hide</button>
                                       </div>
                                    </div>
                                </div>
                            @endif
                        @endif
                            </div>
                        </div><!-- end insider-event__content__block insider-event__requirements -->
                    @else
                        <div class="insider-event__content__block insider-event__requirements">
                            <ul class="insider-event__requirements__checklist not_a_list">
                                @if($card['req_steam'])
                                    <li class="{{$insider->has_steam}}">Steam Connected</li>
                                @endif

                                @if($card['req_dx'])
                                    <li class="{{$insider->has_specs}}">Minimum Specifications<!--DirectX Diagnostic--></li>
                                @endif

                                @if($card['misc_message'])
                                    <li class="misc_message">{{$card['misc_message']}}</li>
                                @endif
                            </ul>

                            <button class="card-turner --to-back js-card-turner"><i class="icon icon--question" role="presentation"></i>Program Summary</button>
                        </div>
                        <!-- include invite date -->
                            <?php 
                                $inviteDate = ""; 

                                //echo '$card ';
                                //var_dump($card);

                                // if exact_date_type is true, we'll get a date. If it's false, we'll get text 
                                //if(isset($card['exact_invite_date'])) {
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

                                //echo ' $inviteDate ';
                                //var_dump($inviteDate);
                            ?>

                            @if (!empty($inviteDate))
                                <div class="insider-event__content__block insider-event__invites">
                                    Next Invites: 
                                    <span class="insider-event__invite-date">{{$inviteDate}}</span>
                                </div>
                            @endif
                            <!-- end invite date -->
                    @endif

                @else
                    <?php 
                        $inviteDate = ""; 

                        //echo '$card ';
                        //var_dump($card);

                        // if exact_date_type is true, we'll get a date. If it's false, we'll get text 
                        //if(isset($card['exact_invite_date'])) {
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

                        //echo ' $inviteDate ';
                        //var_dump($inviteDate);
                    ?>

                    @if (!empty($inviteDate))
                        <div class="insider-event__content__block insider-event__invites">
                            Next Invites: 
                            <span class="insider-event__invite-date">{{$inviteDate}}</span>
                        </div>
                    @endif
                
                @endif
            </div>
        </div>
    </div>


    {{-- back face --}}
    @if($insider_status)
        <div class="insider-event__card__face --back js-card-face">
            <div class="insider-event__card__content-container">

                @include("partials.insider-event-card-header")

                <div class="insider-event__content">

                    @if ( $card['duration']['start'] && $card['duration']['end'] )
                        <p class="insider-event__duration">{{$card['duration']['start']}} - {{$card['duration']['end']}}</p>
                    @endif

                    @if ( $card['short_description'] )
                        <p>{{$card['short_description']}}</p>
                    @endif

                    @if ($card['req_dx'])
                        <div class="insider-event__requirement-comparison">
                            @if ( $card['system_requirements']['ram'] || $card['system_requirements']['vram'] )

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
                                ?>

                                <h6 class="insider-event__content__block__header requirement-comparison__req-header">System Requirements:</h6>

                                <ul class="requirement-comparison__checklist --reqs not_a_list">
                                    @if( !empty($card['system_requirements']['ram']) )
                                        <li class="insider-event__req --ram {{$ram_qualified}}">{{$card['system_requirements']['ram']}}GB RAM</li>
                                    @endif

                                    @if( !empty($card['system_requirements']['vram']) )
                                        <li class="insider-event__req --vram {{$vram_qualified}}">{{$card['system_requirements']['vram']}}GB VRAM</li>
                                    @endif
                                </ul>

                                @if($vram_qualified === 'warning')
                                    <p class="requirement-comparison__tip">Shared VRAM may affect eligibility. <a href="/support/insider-faq/#beta-VRAM">See FAQ.</a>
                                @endif

                                <h6 class="insider-event__content__block__header requirement-comparison__user-header">Your System</h6>

                                <ul class="requirement-comparison__checklist --user not_a_list">
                                    <li class="insider-event__req --ram inadequate" >6GB RAM</li>

                                    <a href="/support/insider-faq/#beta-VRAM" class="sys-req-warning" data-tooltip class="top" title="Warning. See FAQ.">
                                        <li class="insider-event__req --vram warning">6GB  VRAM</li>
                                    </a>

                                    @if ($insider->has_specs === 'complete')
                                        @if( !empty($card['system_requirements']['ram']) )
                                            <li class="insider-event__req --ram" {{$ram_qualified}}>{!! $pc_specs->ram !!}GB RAM</li>
                                        @endif

                                        @if( !empty($card['system_requirements']['vram']) )
                                            @if($vram_qualified === 'warning')
                                                <a href="/support/insider-faq/#beta-VRAM" class="sys-req-warning" data-tooltip class="top" title="Warning. See FAQ.">
                                            @endif
                                            <li class="insider-event__req --vram {{$vram_qualified}}">{!! $pc_specs->vram !!}GB  VRAM</li>
                                            @if($vram_qualified === 'warning')
                                                </a>
                                            @endif
                                        @endif
                                    @else
                                        <li><a href="/profile#insiderSettingDxDiag" class="btn-aoe btn-aoe--small btn-aoe--borderless">Upload DXDiag</a></li>
                                    @endif
                                </ul>
                            @endif

                        </div>
                    @endif

                    @if($card['system_requirements']['extra_requirement'])
                    <ul class="requirement-comparison__checklist not_a_list --extra_requirement">
                        <li class="extra_requirement">{{$card['system_requirements']['extra_requirement']}}</li>
                    </ul>
                    @endif
                    
                    @if($card['show_more_details'])
                    <p class="requirement-comparison__tip --lower">For all requirements, see More Details.</p>
                     @endif
                    <div class="insider-event__card__button-group">
                        <button class="card-turner js-card-turner"><i class="icon icon--arrow-left" role="presentation"></i>Return</button>
                        @if($card['show_more_details'])
                        <button class="more-button js-event-details-button" data-open="eventDetails{{$cardIndex}}"><i class="icon icon--question" role="presentation"></i>More Details</button>
                        @endif
                    </div>
                </div>
            </div>
        </div>  

        @include('components.modal-insider-event-details')
    @endif
</div>
