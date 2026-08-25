export default class EuCookieBanner {
    constructor() {
        this.init();
    }

    init() {

        checkConsent();

        function showConsentOptions() {
            window.siteConsent.manageConsent();
        }
  
        function manageCookieConsent() {
            let siteFooter = document.querySelector('.footer__links');
            let gtmuaScript = document.querySelector('.gtmua_script');
            if(window.siteConsent.isConsentRequired){
                let btn = document.createElement("button");
                  btn.setAttribute("type", "button");
                  btn.innerHTML = "Manage Cookies";
                  btn.id = "wcpConsent-btn";

                if(siteFooter) {
                  siteFooter.prepend(btn);
                }
                
            } else {
              if(gtmuaScript) {
                gtmuaScript.parentNode.removeChild(gtmuaScript);
              }
              window['ga-disable-UA-45447305-7'] = false;
              loadScripts(true,true);
            }
        }
  
        function onConsentChanged(categoryPreferences) {
            let gtmuaScript = document.querySelector('.gtmua_script');
            let enableScripts = false;
            let allowAds = false;

            if(window.siteConsent.isConsentRequired){
                let recheckConsent = window.siteConsent.getConsent();
                if(recheckConsent.Analytics === true && recheckConsent.SocialMedia === true) {
                    if(recheckConsent.Advertising === true) {
                        if(gtmuaScript) {
                          gtmuaScript.parentNode.removeChild(gtmuaScript);
                        }
                        window['ga-disable-UA-45447305-7'] = false;
                        //loadScripts(true);
                        enableScripts = true;
                        allowAds = true;
                        loadScripts(enableScripts,allowAds);
                      /* build script with these options */
                    } else {
                        if(gtmuaScript) {
                          gtmuaScript.parentNode.removeChild(gtmuaScript);
                        }
                        window['ga-disable-UA-45447305-7'] = false;
                        //loadScripts(false);
                        enableScripts = true;
                        allowAds = false;
                        loadScripts(enableScripts,allowAds);
                      /* build script with these options */
                    }
                } else {
                    window['ga-disable-UA-45447305-7'] = true;
                      /* destroy script */
                    if(gtmuaScript) {
                        gtmuaScript.parentNode.removeChild(gtmuaScript);
                    }
                    loadScripts(enableScripts,allowAds);

                }
            }
        }
  
        function checkConsent() {
            let capturedConsent = '';
            if(window.hasOwnProperty('WcpConsent')) {
                window.WcpConsent && window.WcpConsent.init("en-US", "cookie-banner", function (err, _siteConsent) {
                    if (!err) {
                        window.siteConsent = _siteConsent;  //siteConsent is used to get the current consent
                        capturedConsent = _siteConsent;
                        manageCookieConsent(); // produce button to open consent menu
                        onConsentChanged(capturedConsent);
                    } else {
                        console.log("Error initializing WcpConsent: "+ err);
                    }
                }, onConsentChanged, window.WcpConsent.themes.light);
            } else {
                console.log('WcpConsent script has not loaded');
            }
        }
  
        document.addEventListener('click',function(e){
            if(e.target && e.target.id == 'wcpConsent-btn'){
                showConsentOptions();
            }
        });

        function loadScripts(enableScripts,allowAds) {
          (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
              (i[r].q = i[r].q || []).push(arguments);
            }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;a.setAttribute('class','gtmua_script');m.parentNode.insertBefore(a, m);
        })(window, document, 'script', 'https://www.googletagmanager.com/gtag/js?id=UA-45447305-7', 'ga');

        window.dataLayer = window.dataLayer || [];
        function gtag() {window.dataLayer.push(arguments);}
          gtag('js', new Date());
           if(!allowAds) {
              /* no consent for advertising */
              gtag('set', 'allow_google_signals', false);
            } else {
                /* given consent for advertising */
                gtag('set', 'allow_google_signals', true);
            } 
            /* main ga tag */
          gtag('config', 'UA-45447305-7', {
            'cookie_expires': 31536000,
          });

          (function (w, d, s, l, i) {
                w[l] = w[l] || []; w[l].push({
                    'gtm.start':
                        new Date().getTime(), event: 'gtm.js',
                }); var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                        'https://www.googletagmanager.com/gtm.js?id=' + i + dl; j.setAttribute('class', 'gtmua_script'); f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-TGW83TG');


            if(gtag) {
              /* learn to play interactions */
                let ltpVideos = document.querySelectorAll('.js-ltpVideo');
                ltpVideos.forEach((ltpVideo) => {
                  ltpVideo.onplaying = function() { 
                    let page_url = window.location.href;
                    let section_heading = ltpVideo.closest('.js-ltpSection');
                    let section_id = section_heading.querySelector('.lesson_heading').getAttribute('id'); 
                    let clicked_point = section_heading.querySelector('.pointsWrapperItem.active .ltp-heading').innerHTML;

                    gtag('event', 'learn_to_play_interaction', {
                        content_type: 'playing video',
                        items: [
                          {
                            name: "" + clicked_point + "",
                            variant: "" + section_id + "" + page_url + "",
                          },
                        ],
                      });
                  }

                  ltpVideo.onpause = function() { 
                    let page_url = window.location.href;
                    let section_heading = ltpVideo.closest('.js-ltpSection');
                    let section_id = section_heading.querySelector('.lesson_heading').getAttribute('id'); 
                    let clicked_point = section_heading.querySelector('.pointsWrapperItem.active .ltp-heading').innerHTML;

                    gtag('event', 'learn_to_play_interaction', {
                        content_type: 'pausing video',
                        items: [
                          {
                            name: "" + clicked_point + "",
                            variant: "" + section_id + "" + page_url + "",
                          },
                        ],
                      });
                  }
                });

                $("#learn-to-play").on("click", function(e) {
                  let page_url = window.location.href;
                  let section_heading = e.target.closest('.js-ltpSection');
                  

                  if(!(section_heading && e.target.tagName.toLowerCase() === 'path' || e.target.tagName.toLowerCase() === 'span')) {
                    return;
                  }
                  let section_id = section_heading.querySelector('.lesson_heading').getAttribute('id');
                  let user_interaction = 'zoom, navigate, or click';
                  
                  /* wait one second to ensure video has populated */
                  setTimeout(function(){ 
                    let clicked_point = section_heading.querySelector('.pointsWrapperItem.active .ltp-heading').innerHTML;

                    if(e.target.tagName.toLowerCase() === 'path') {
                      if(e.target.closest('button').classList.contains('js-btnZoom')) {
                        user_interaction = ' zoomed in or out';
                      } else {
                        user_interaction = ' navigated to';
                      }
                      
                    } else if(e.target.tagName.toLowerCase() === 'span') {
                      user_interaction = ' direct trigger';
                    }

                    gtag('event', 'learn_to_play_interaction', {
                      content_type: user_interaction,
                      items: [
                        {
                          name: "" + clicked_point + "",
                          variant: "" + section_id + "" + page_url + "",
                        },
                      ],
                    });
                  }, 1000);
                  
                });
                /* buy now page butons */
                $(".buy-now__buttons a").on("click", function(e) {
                  e.stopPropagation();

                  let selectedVariant = $(this).data('product-id') ? $(this).data('product-id') : $(this).attr("href");

                  gtag('event', 'click_buy_button', {
                    content_type: "product_link",
                    items: [
                      {
                        name: "" + $(this).find("img").attr("alt") + "",
                        variant: "" + selectedVariant + "",
                      },
                    ],
                  });
                });

                if($('.alert-page')) {
                  /* buy now page butons */
                  $(".alert-page a.alert-full-link").on("click", function(e) {
                    e.stopPropagation();
  
                    let selectedVariant = $(this).attr('href') ? $(this).attr('href') : 'No Alert Banner URL given';
  
                    gtag('event', 'click_alert_banner', {
                      content_type: "alert_banner",
                      items: [
                        {
                          name: $(this).prev().find('#aria-alert-body').text(),
                          variant: selectedVariant,
                        },
                      ],
                    });
                  });                
                }

                /* learn to play button on game aoeiide page */
                $("body.aoeiide .extra_fc a.btn-aoe--cta").on("click", function(e) {
                  e.stopPropagation();

                  let selectedVariant = $(this).attr("href");

                  gtag('event', 'click_learn_to_play_banner', {
                    content_type: "product_link",
                    items: [
                      {
                        name: "Learn to Play AGE II DE banner link",
                        variant: "" + selectedVariant + "",
                      },
                    ],
                  });
                });

                /* nda language selection */
                $("#ndaLanguageSelect").on("change", function(e) {

                  gtag('event', 'select_NDA_Language', {
                    content_type: "language_select",
                    items: [
                      {
                        name: "" + $(this).val() + "",
                      },
                    ],
                  });
                });

            }
            
       }
    }

    
}