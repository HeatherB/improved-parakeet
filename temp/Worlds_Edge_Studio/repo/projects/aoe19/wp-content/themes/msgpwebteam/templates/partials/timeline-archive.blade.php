<div class="timeline-container">
    <div class="scroll_container">
        <div class="nav_container">

            <div class="top_timeline"></div>

            <div class="cultures">
                <ul class="not_a_list">
								<?php
									$sumerianPage = get_page_by_path('sumerian-culture',OBJECT,'history');
									$egyptianPage = get_page_by_path('egyptian-culture',OBJECT,'history');
									$minoanPage = get_page_by_path('minoan-culture',OBJECT,'history');
									$chosonPage = get_page_by_path('choson-culture',OBJECT,'history');
									$greekPage = get_page_by_path('greek-culture',OBJECT,'history');
									$hittitePage = get_page_by_path('hittite-culture',OBJECT,'history');
									$babylonianPage = get_page_by_path('babylonian-culture',OBJECT,'history');
									$assyrianPage = get_page_by_path('assyrian-culture',OBJECT,'history');
									$shangPage = get_page_by_path('shang-culture',OBJECT,'history');
									$phoenicianPage = get_page_by_path('phoenician-culture',OBJECT,'history');
									$carthaginianPage = get_page_by_path('carthaginian-culture',OBJECT,'history');
									$romanPage = get_page_by_path('roman-culture',OBJECT,'history');
									$persianPage = get_page_by_path('persian-culture',OBJECT,'history');
									$macedonianPage = get_page_by_path('macedonian-culture',OBJECT,'history');
									$yamatoPage = get_page_by_path('yamato-culture',OBJECT,'history');
									$palmyrenePage = get_page_by_path('palmyrene-culture',OBJECT,'history');

									if($sumerianPage->post_status == 'publish'){ ?>
                    <li class="civ_1"><a href="{{home_url()}}/history/<?php echo $sumerianPage->post_name; ?>">Sumerian</a></li>
									<?php } else { ?>
										<li class="civ_1 grey-scale"><a class="coming-soon">Sumerian</a><span>IN PROGRESS</span></li>
									<?php }

									if($egyptianPage->post_status == 'publish'){ ?>
                    <li class="civ_2"><a href="{{home_url()}}/history/<?php echo $egyptianPage->post_name; ?>">Egyptian</a></li>
									<?php } else { ?>
                    <li class="civ_2 grey-scale"><a class="coming-soon">Egyptian</a><span>IN PROGRESS</span></li>
									<?php }

									if($minoanPage->post_status == 'publish'){ ?>
                    <li class="civ_4"><a href="{{home_url()}}/history/<?php echo $minoanPage->post_name; ?>">Minoan</a></li>
									<?php } else { ?>
                    <li class="civ_4 grey-scale"><a class="coming-soon">Minoan</a><span>IN PROGRESS</span></li>
									<?php }

									if($chosonPage->post_status == 'publish'){ ?>
                    <li class="civ_14"><a href="{{home_url()}}/history/<?php echo $chosonPage->post_name; ?>">Choson</a></li>
									<?php } else { ?>
                    <li class="civ_14 grey-scale"><a class="coming-soon">Choson</a><span>IN PROGRESS</span></li>
									<?php }

									if($greekPage->post_status == 'publish'){ ?>
                    <li class="civ_5"><a href="{{home_url()}}/history/<?php echo $greekPage->post_name; ?>">Greek</a></li>
									<?php } else { ?>
                    <li class="civ_5 grey-scale"><a class="coming-soon">Greek</a><span>IN PROGRESS</span></li>
									<?php }

									if($hittitePage->post_status == 'publish'){ ?>
                    <li class="civ_6"><a href="{{home_url()}}/history/<?php echo $hittitePage->post_name; ?>">Hittite</a></li>
									<?php } else { ?>
                    <li class="civ_6 grey-scale"><a class="coming-soon">Hittite</a><span>IN PROGRESS</span></li>
									<?php }

									if($babylonianPage->post_status == 'publish'){ ?>
                    <li class="civ_7"><a href="{{home_url()}}/history/<?php echo $babylonianPage->post_name; ?>">Babylonian</a></li>
									<?php } else { ?>
                    <li class="civ_7 grey-scale"><a class="coming-soon">Babylonian</a><span>IN PROGRESS</span></li>
									<?php }

                  if($assyrianPage->post_status == 'publish'){ ?>
                    <li class="civ_8"><a href="{{home_url()}}/history/<?php echo $assyrianPage->post_name; ?>">Assyrian</a></li>
									<?php } else { ?>
                    <li class="civ_8 grey-scale"><a class="coming-soon">Assyrian</a><span>IN PROGRESS</span></li>
									<?php }

                  if($shangPage->post_status == 'publish'){ ?>
                    <li class="civ_3"><a href="{{home_url()}}/history/<?php echo $shangPage->post_name; ?>">Shang</a></li>
									<?php } else { ?>
                    <li class="civ_3 grey-scale"><a class="coming-soon">Shang</a><span>IN PROGRESS</span></li>
									<?php }

									if($phoenicianPage->post_status == 'publish'){ ?>
                    <li class="civ_9"><a href="{{home_url()}}/history/<?php echo $phoenicianPage->post_name; ?>">Phoenician</a></li>
									<?php } else { ?>
                    <li class="civ_9 grey-scale"><a class="coming-soon">Phoenician</a><span>IN PROGRESS</span></li>
									<?php }

                  if($carthaginianPage->post_status == 'publish'){ ?>
                    <li class="civ_11"><a href="{{home_url()}}/history/<?php echo $carthaginianPage->post_name; ?>">Carthaginian &mdash;</a></li>
									<?php } else { ?>
                    <li class="civ_11 grey-scale"><a class="coming-soon">Carthaginian &mdash;</a><span>IN PROGRESS</span></li>
									<?php }

                  if($romanPage->post_status == 'publish'){ ?>
                    <li class="civ_13"><a href="{{home_url()}}/history/<?php echo $romanPage->post_name; ?>">Roman</a></li>
									<?php } else { ?>
                    <li class="civ_13 grey-scale"><a class="coming-soon">Roman</a><span>IN PROGRESS</span></li>
									<?php }

									if($persianPage->post_status == 'publish'){ ?>
                    <li class="civ_10"><a href="{{home_url()}}/history/<?php echo $persianPage->post_name; ?>">Persian</a></li>
									<?php } else { ?>
                    <li class="civ_10 grey-scale"><a class="coming-soon">Persian</a><span>IN PROGRESS</span></li>
									<?php }

                  if($macedonianPage->post_status == 'publish'){ ?>
                    <li class="civ_12"><a href="{{home_url()}}/history/<?php echo $macedonianPage->post_name; ?>">Macedonian &mdash;</a></li>
									<?php } else { ?>
                    <li class="civ_12 grey-scale"><a class="coming-soon">Macedonian &mdash;</a><span>IN PROGRESS</span></li>
									<?php }

									if($yamatoPage->post_status == 'publish'){ ?>
                    <li class="civ_16"><a href="{{home_url()}}/history/<?php echo $yamatoPage->post_name; ?>">Yamato</a></li>
									<?php } else { ?>
										<li class="civ_16 grey-scale"><a class="coming-soon">Yamato</a><span class="left">IN PROGRESS</span></li>
									<?php }

									if($palmyrenePage->post_status == 'publish'){ ?>
                    <li class="civ_15"><a href="{{home_url()}}/history/<?php echo $palmyrenePage->post_name; ?>">Palmyrene &mdash;</a></li>
									<?php } else { ?>
										<li class="civ_15 grey-scale"><a class="coming-soon">Palmyrene &mdash;</a><span>IN PROGRESS</span></li>
									<?php } ?>
                </ul>
            </div>

            <div class="bottom_timeline"></div>
        </div>

    </div>
    <a href="#" class="timeline_button"><img src="@asset('images/history/timeline/arrow.png')" />Timeline<img src="@asset('images/history/timeline/arrow.png')" /></a>
</div><!-- .container -->
