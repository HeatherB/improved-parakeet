<?php 
  $current_page = sanitize_post( $GLOBALS['wp_the_query']->get_queried_object() );
  $slug = $current_page->post_name;

  if( $slug == "tournaments" || is_post_type_archive('buy_now_pages')) {
    $content = "section--divider-aztec-mid";
  } elseif(is_front_page() || $slug == "aoeiide" || $slug == "age-of-empires-ii-de" || $slug == "media" ||  is_search() || is_singular('post') || $slug=="insider-faq" || is_home()) {
    $content = "section--divider-frank-mid";
  } elseif( is_post_type_archive('history') || $slug == "stats" || $slug == "mods") {
    $content = "section--divider-egypt-mid";
  } elseif ($slug=="profile") {
    $content ="generic-divider";
  } else {
    $content = "section-divider section--divider-egypt-mid";
  }
?>
<footer class="footer section--padding-small background--marble {{ $content }}">
  <div class="footer__inner-wrapper">
    <div class="footer__inner">
      <div class="footer__logo">
        <img src="@asset('images/age1-footer-logo.png')" alt="Age of Empires" />
      </div>
      <div class="footer__brand">
        <div class="footer__brand-logos">
          <a class="publisher" target="_blank" href="https://www.xbox.com/en-US/xbox-game-studios"><img src="@asset('images/Xbox_GameStudios_Stacked.svg')" alt="XBOX Game Studios" /></a>
          <a target="_blank" href="https://www.esrb.org/" aria-label="US/CANADA: Blood, Violence, Mild Language">      
                {{-- SVG ESRB Logo Start  --}}    
                <svg class="js-esrb-icon" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                   width="282.100006px" height="422.799988px" viewBox="0 0 282.100006 422.799988"
                   style="enable-background:new 0 0 282.100006 422.799988;" xml:space="preserve">
                <style type="text/css">
                  .st0{fill:#FFFFFF;}
                  .st1{fill:#231F20;}
                </style>
                <rect class="st0" width="282.100006" height="422.799988"/>
                <path class="st1" d="M232.899994,389.5h-6.199997v6.200012h8.600006c4.899994,0,8.5-0.600006,8.5-3.100006
                  C243.800003,389.700012,239.199997,389.5,232.899994,389.5z"/>
                <path class="st1" d="M168.800003,377.799988h-9.199997V384.5h7.699997c6.100006,0,9.399994-0.899994,9.399994-3.200012
                  S173.399994,377.799988,168.800003,377.799988z"/>
                <path class="st1" d="M241.699997,380.5c0-2.600006-3.899994-2.700012-8-2.700012h-7v5.600006h8.199997
                  C238.800003,383.399994,241.699997,382.399994,241.699997,380.5z"/>
                <path class="st1" d="M17.9,19.299999h244.200012v68.599991H17.9V19.299999z M17.799999,102.900002h244.300003v252.300018H17.799999
                  V102.900002z M68,403.5H17.9V370h49v7.799988H37.599998v4.799988h24.799999v7.799988H37.599998v5.200012H68V403.5z
                   M101.900002,404.200012C86,404.200012,75.699997,399,75.300003,393h18.900002
                  c0.400002,1.200012,1.599998,2.100006,3.300003,2.600006c1.599998,0.5,3.699997,0.799988,5.599998,0.799988
                  c4.900002,0,8.199997-0.899994,8.199997-2.5c0-5.100006-34.599998-1.600006-34.599998-14.399994
                  c0-7.100006,11-10.700012,26.099998-10.700012c16.699997,0,24.300003,4.700012,25.699997,10.600006h-18.800003v0.299988
                  c-0.300003-1.100006-1.400002-1.899994-2.900002-2.299988c-1.400002-0.399994-3.099998-0.600006-5.099998-0.600006
                  c-4.300003,0-6.300003,0.700012-6.300003,1.899994c0,5,34.600006,1.799988,34.600006,14
                  C130,400.5,118.400002,404.200012,101.900002,404.200012z M197.100006,403.5h-20c-0.5-0.700012-1-2.899994-1-5.799988
                  c0-4.399994-1.300003-5.799988-10.5-5.799988h-6v11.600006h-19.699997V370h28.399994c20,0,26.600006,3.100006,26.600006,9.600006
                  c0,3.899994-3.100006,7.100006-10.100006,8.200012C191.100006,389.100006,195,389.900024,195,396.600006
                  C195,401,194.699997,402.5,197.100006,402.5V403.5z M236.300003,403.5h-29.199997V370h28.699997
                  c13.5,0,24.300003,1.799988,24.300003,8.399994c0,3.5-4,6-7.899994,7.299988c6.5,0.899994,10,4.100006,10,7.700012
                  C262.200012,400.899994,252,403.5,236.300003,403.5z M277,4.6H5.1v413.799988H277V4.6z"/>
                <polygon class="st0" points="37.599998,390.399994 62.400002,390.399994 62.400002,382.600006 37.599998,382.600006 
                  37.599998,377.799988 66.900002,377.799988 66.900002,370 17.9,370 17.9,403.5 68,403.5 68,395.600006 37.599998,395.600006 "/>
                <path class="st0" d="M95.400002,378.700012c0-1.200012,2-1.899994,6.300003-1.899994c2,0,3.699997,0.200012,5.099998,0.600006
                  c1.5,0.399994,2.599998,1.200012,2.900002,2.299988v-0.299988H128.5c-1.400002-5.899994-9-10.600006-25.699997-10.600006
                  c-15.099998,0-26.099998,3.600006-26.099998,10.700012c0,12.799988,34.599998,9.299988,34.599998,14.399994
                  c0,1.600006-3.300003,2.5-8.199997,2.5c-1.900002,0-4-0.299988-5.599998-0.799988
                  c-1.699997-0.5-2.900002-1.399994-3.300003-2.600006H75.300003c0.400002,6,10.699997,11.200012,26.599998,11.200012
                  c16.5,0,28.099998-3.700012,28.099998-11.5C130,380.5,95.400002,383.700012,95.400002,378.700012z"/>
                <path class="st0" d="M195,396.600006c0-6.700012-3.899994-7.5-10.199997-8.799988c7-1.100006,10.100006-4.299988,10.100006-8.200012
                  c0-6.5-6.600006-9.600006-26.600006-9.600006h-28.399994v33.5h19.699997v-11.600006h6c9.199997,0,10.5,1.399994,10.5,5.799988
                  c0,2.899994,0.5,5.100006,1,5.799988h20v-1C194.699997,402.5,195,401,195,396.600006z M167.300003,384.5h-7.699997v-6.700012
                  h9.199997c4.600006,0,7.899994,1.200012,7.899994,3.5S173.399994,384.5,167.300003,384.5z"/>
                <path class="st0" d="M252.199997,385.700012c3.900009-1.299988,7.900009-3.799988,7.900009-7.299988
                  c0-6.600006-10.800003-8.399994-24.300003-8.399994h-28.699997v33.5h29.199997c15.699997,0,25.900009-2.600006,25.900009-10.100006
                  C262.200012,389.799988,258.700012,386.600006,252.199997,385.700012z M226.699997,377.799988h7c4.100006,0,8,0.100006,8,2.700012
                  c0,1.899994-2.899994,2.899994-6.800003,2.899994h-8.199997V377.799988z M235.300003,395.700012h-8.600006V389.5h6.199997
                  c6.300003,0,10.899994,0.200012,10.899994,3.100006C243.800003,395.100006,240.199997,395.700012,235.300003,395.700012z"/>
                <rect x="17.799999" y="102.900002" class="st0" width="244.300003" height="252.300018"/>
                <polygon points="29.802898,160.06459 219.801712,110.999695 234.397003,163.43399 173.369492,179.192886 214.303528,326.532257 
                  146.372421,344.102386 105.403603,196.743286 44.385548,212.521912 "/>
                <g>
                  <polygon points="204.662323,34.099998 220.710281,34.099998 239.352066,55.28643 238.693344,46.435768 238.693344,34.099998 
                    255.100006,34.099998 255.100006,72.900002 239.069733,72.900002 220.407379,51.776253 221.066116,60.604977 221.066116,72.900002 
                    204.662323,72.900002 	"/>
                  <polygon points="146.834412,34.099998 189.393723,34.099998 189.393723,43.13871 163.935165,43.13871 163.935165,48.714249 
                    185.485367,48.714249 185.485367,57.771763 163.935165,57.771763 163.935165,63.845623 190.423019,63.845623 190.423019,72.900002 
                    146.834412,72.900002 	"/>
                  <polygon points="87.006767,34.099998 129.563126,34.099998 129.563126,43.13871 104.125214,43.13871 104.125214,48.714249 
                    125.65181,48.714249 125.65181,57.771763 104.125214,57.771763 104.125214,63.845623 130.610016,63.845623 130.610016,72.900002 
                    87.006767,72.900002 	"/>
                  <polygon points="24.6,34.099998 72.461609,34.099998 72.461609,44.292053 57.098869,44.292053 57.098869,72.900002 
                    39.968666,72.900002 39.968666,44.292053 24.6,44.292053 	"/>
                </g>
                </svg>
                {{-- SVG ESRB Logo End  --}}    
                <div class="footer__ratings">
                  <ul class="rating-descriptors">      
                    <?php if ( $slug == "aoeiiide" ) { ?>           
                      <li>Mild Blood</li>
                      <li>Violence</li>
                    <?php } elseif( $slug == "age-of-empires-iv" ) { ?>
                      <li>Mild Blood</li>
                      <li>Mild Violence</li>
                    <?php } elseif( $slug == "aoe" ) { ?>
                      <li>Blood</li>
                      <li>Mild Violence</li>
                    <?php } elseif( $slug == "aoeiide" ) { ?> 
                      <li>Mild Blood</li>
                      <li>Mild Language</li>
                      <li>Violence</li> 
                    <?php } elseif( $slug == "aoeiii" || $slug == "aom" ) { ?>
                      <li>Blood</li>
                      <li>Violence</li>                                                            
                    <?php } else { ?>
                      <li>Blood</li>
                      <li>Violence</li>
                      <li>Mild Language</li>
                    <?php } ?> 
                  </ul>
                </div> 
          </a>
          <a target="_blank" href="https://www.pegi.info/">
            <?php if ( $slug == "aoe" || $slug == "aoeii" || $slug == "aoeiide" || $slug == "aom" ) { ?>
               <img class="js-esrb-icon" src="@asset('images/esrb/usk-12.png')" alt="USK Rating 12" />
            <?php } else if ( $slug == "aoeiii" || $slug == "aoeiiide" ) { ?>
                <img class="js-esrb-icon" src="@asset('images/esrb/usk-16.png')" alt="USK Rating 16" />
            <?php } else if ( $slug == "age-of-empires-iv" ) { ?>
                <img class="js-esrb-icon" src="@asset('images/esrb/usk-16.png')" alt="USK Rating 16" />
            <?php } else { ?>
                <img class="js-usk-icon" src="@asset('images/esrb/usk-16.png')" alt="USK Rating 16" />
            <?php } ?>
            <!--<img class="js-usk-icon" src="@asset('images/esrb/usk-16.png')" alt="USK Rating 16" />-->
            <div class="footer__ratings"><strong>
             GERMANY
            </strong></div>
          </a>
          <a target="_blank" href="https://www.pegi.info/">
             <?php if ( $slug == "aoe" || $slug == "aoeii" || $slug == "aoeiide" || $slug == "aom" ) { ?>
               <img class="js-esrb-icon" src="@asset('images/esrb/pegi-12.png')" alt="PEGI Rating 12" />
            <?php } else if ( $slug == "aoeiii" || $slug == "aoeiiide" ) { ?>
                <img class="js-esrb-icon" src="@asset('images/esrb/pegi-16.png')" alt="PEGI Rating 16" />
            <?php } else if ( $slug == "age-of-empires-iv" ) { ?>
                <img class="js-esrb-icon" src="@asset('images/esrb/pegi-16.png')" alt="PEGI Rating 16" />
            <?php } else { ?>
                <img class="js-pegi-icon" src="@asset('images/esrb/pegi-16.png')" alt="PEGI Rating 16" />
            <?php } ?>
            <!--<img class="js-pegi-icon" src="@asset('images/esrb/pegi-16.png')" alt="PEGI Rating 16" />-->
            <div class="footer__ratings"><strong>
              EUROPE
            </strong></div>
          </a>
        </div>

        <div class="footer__social">
          @include('partials.social-links')
        </div>

        <div class="footer__links">
            <a target="_blank" href="https://go.microsoft.com/fwlink/?LinkID=206977">
              Terms of Use
              </a> | <a target="_blank" href="https://www.microsoft.com/Trademarks">
                Trademarks
                </a> | <a target="_blank" href="https://go.microsoft.com/fwlink/?LinkId=521839">
                  Privacy & Cookies
            </a>
            <p class="copyright">&copy; <?php echo date("Y"); ?> Microsoft. 
            All rights reserved.
            </p>
        </div>
      </div>
    </div>
  </div>
</footer>
</div>
</div> <!-- off canvas content -->
</div> <!-- off canvas wrapper -->
{{--<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.10.0/d3.min.js"></script>--}}
