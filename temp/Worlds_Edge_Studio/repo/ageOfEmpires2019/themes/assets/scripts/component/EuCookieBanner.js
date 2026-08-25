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
                /* buy now page butons */
                $(".buy-now__buttons a").on("click", function(e) {
                  e.stopPropagation();

                  let selectedVariant = $(this).data('product-id') ? $(this).data('product-id') : $(this).attr("href");

                  gtag('event', 'click_buy_button', {
                    content_type: "product_link",
                    'event_category' : 'Buy Now',
                    'event_label' : "" + $(this).find("img").attr("alt") + "",
                    items: [
                      {
                        name: "" + $(this).find("img").attr("alt") + "",
                        variant: "" + selectedVariant + "",
                      },
                    ],
                  });
                });

                /* nda language selection */
                $("#ndaLanguageSelect").on("change", function(e) {

                  gtag('event', 'select_NDA_Language', {
                    content_type: "language_select",
                    'event_category' : 'NDA',
                    'event_label' : "" + $(this).val() + "",
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