//= require vendor/velocity.min.js
//= require global/bt

'use strict';

var Blackout = {
  initialized: false,
  element: null,
  initialize: function() {
    Blackout.element = $('<div/>', {id: 'lb-blackout'});
    Blackout.element.on('click', Core.stopPropagation)
                    .on('keyup', Blackout.listen);
    $('body').append(Blackout.element);

    Blackout.initialized = true;
  },
  listen: function(e) {
    if (e.which === KeyCode.esc) {
      Blackout.hide();
    }
  },
  show: function(callback, onClick, transparent) {
    if (!Blackout.initialized) {
      Blackout.initialize();
    };
    Blackout.element.show();
    if (Core.isCallback(callback)) {
      callback();
    }
    if (Core.isCallback(onClick)) {
      Blackout.element.click(onClick);
    }
  },

  hide: function(callback) {
    Blackout.element.hide();
    if (Core.isCallback(callback)) {
      callback();
    }
    Blackout.element.unbind('click');
  }
}

var Core = {
  isCallback: function(callback) {
    return (callback && typeof callback === 'function');
  },
  stopPropagation: function(e) {
    e.stopPropagation();
  },
  supportsVideo: function() {
    return !!document.createElement('video').canPlayType;
  }
};

var Lightbox = {
  initialized: false,
  element: null,
  callback: null,
  contentType: "image",
  config: {
    showTitle: false,
    includeControls: false
  },
  build: function() {
    Lightbox.element = $("#lightbox");
    Lightbox.container = $('#lightbox-container');
    Lightbox.head = $('#lightbox-head');
    Lightbox.content = $('#lightbox-content');
    
  },
  bindEvents: function() {
    Lightbox.anchor = $('.lightbox-close').on('click', Lightbox.close);
  }, 
  initialize: function() {
    Blackout.initialize();
    Lightbox.build();
    // Lightbox.bindEvents();
    Lightbox.initialized = true;
  },
  emptyContent: function() {
    Lightbox.content.removeAttr("style").empty();
    Lightbox.container.removeAttr("class");
    Lightbox.head.text();
  },
  loadContent: function(content, type) {
    if (!Lightbox.initialized) {
      Lightbox.initialize();
    }

    Lightbox.setContent(content);
  },
  setTitle: function (title) {
    if (!Lightbox.initialized) {
      Lightbox.initialize();
    }

    if (!title) {
      Lightbox.element.addClass('borderless');
    }

    Lightbox.head.text(title);
  },
  /**
  * Loads a YouTube video
  * 
  * @param video object
  *
  * Example:
  * { title: "Video Title Text", // Optional
  *   width: 890,
  *   height: 500,
  *   id: 'a0Ft2_nhalU'
  * };
  */
  loadVideo: function(objEmbed, callback) {
    if (!Lightbox.initialized) {
      Lightbox.initialize();
    }
    Lightbox.callback = callback;
    Lightbox.setEmbed(objEmbed);
  },
  setEmbed: function(objEmbed) {
    Lightbox.emptyContent();
    Lightbox.container.addClass("video");
    $('<iframe class="lightbox-vid" width="' + objEmbed.width +'" height="' + objEmbed.height +
      '" src="' + objEmbed.id + '?showinfo=0&amp;wmode=transparent&amp;vq=hd720&amp;rel=0&amp;modestbranding=1&amp;autohide=1&autoplay=1" frameborder="0" allowfullscreen="allowfullscreen"></iframe>')
      .appendTo(Lightbox.content);
    Lightbox.show();
  },
  setContent: function(content) {
    Lightbox.emptyContent();
    var node = $('.info.' + content);
    node.clone().appendTo(Lightbox.content);

    Lightbox.setFrameDimensions(750);
    Lightbox.show();
  },
  setFrameDimensions: function(width, height, offset) {
    height = height || Lightbox.element.height();
    // Explicityly set content container to content height
    Lightbox.content.css({
      height: height + "px"
    });

    Lightbox.container.css({
      top: offset || ((window.innerHeight - height) / 2) - 10,
      width: width + "px",
      height: height + "px"
    });
  },
  show: function() {
    Blackout.show(function() {
      Lightbox.container[0].style.display = "block";
      Lightbox.element.show();
    }, Lightbox.close);
  },
  close: function() {
    Lightbox.emptyContent();
    if (Lightbox.callback != null) {
      Lightbox.callback();
      Lightbox.callback = null;
    }
    Lightbox.element.unbind('click');
    Blackout.hide(Lightbox.container.hide());
  }
};

var KyraSpeach = {
  state: 'ready',
  copy: {
    ready: [ // starting text
      { speach: 'Well, hello there. What can I do for you?', time: 5000},
      { speach: 'For 5 catalysts, I\'ll mix you up something special.', time: 5000},
      { speach: 'Catalysts bubble and the cauldron foams.', time: 6000}
    ],
    choose: [ // waiting to choose a potion
      {speach: 'Pick a frosty potion and let\'s turn up the heat.', time: 6000},
      {speach: 'When the cauldron bubbles, your potion is ready!', time: 6000}
    ],
    finish: [ // after a game
      {speach: 'Now that you know your reward, you can collect it from Item Claim.', time: 5000},
      {speach: 'Got more catalysts? I\'m always ready to mix up something sweet.', time: 5000}
    ]
  },
  init: function() {
    KyraSpeach.alternate();
  },
  alternate: function(index) {
    var index = index || 0, nextItem,
        time = KyraSpeach.copy[KyraSpeach.state][index].time;

    setInterval(function(){
      index = (index >= 0 && index < KyraSpeach.copy[KyraSpeach.state].length - 1) ? index + 1 : 0;

      nextItem = KyraSpeach.copy[KyraSpeach.state][index];
      KyraSpeach.changeText(nextItem.speach);
    }, time);
  },
  changeText: function(text){
    $('#speach').text(text);
  }
}

var PotionShack = {
  user: 0,
  catalystsCount: 0,
  sending: false,
  chosenColor: '',
  s: {
    start: $('#start'),
    bottles: {
      all: $('.bottle'),
      red: $('#bottleRed'),
      blue: $('#bottleBlue'),
      purple: $('#bottlePurple'),
      green: $('#bottleGreen'),
      yellow: $('#bottleYellow'),
    },
    kyra: $('#kyra'),
    cauldron: $('#cauldron'),
    buy: $('#buy-more'),
    emp: $('#balance'),
    catalysts: $('#catalyst-count'),
    prizes: $('#prizes'),
    bounties: $('#bounties'),
    howTo: $('#earn'),
    prizeImage: $('#prizeImage'),
    prizeTitle: $('#prizeTitle')
  },
  init: function(settings) {
    var s = PotionShack.s;
    s = $.extend(s, settings);
    PotionShack.user = PotionShack.s.buy.data('user');
    PotionShack.catalystsCount = parseInt(PotionShack.s.catalysts.text());
    PotionShack.bindEvents();

    // Handle speach bubble
    KyraSpeach.init();
  },
  bindEvents: function() {
    // Purchase Catalysts through confirm dialog
    PotionShack.s.buy.find('a').on('click', function(e){
      e.preventDefault();
      var id = $(this).attr('href'),
          price = $(this).data('price'),
          count = $(this).data('count'),
          dialog = '';

      dialog += '<div class="dialog"><p>You\'re purchasing ' + count + ' ';
      dialog += (count > 1) ? 'catalysts' : 'catalyst';
      dialog += ' for '+price+' EMP. Would you like to continue?</p><ul><li><span id="confirm">Confirm</span></li><li><span id="cancel">Cancel</span></li></ul></div>';

      Lightbox.setTitle('confirm purchase');
      Lightbox.loadContent(dialog);
      Lightbox.element.find('span').bind('click', function(e) {
        e.preventDefault();
        var answer = $(this).attr('id');

        if (answer === 'confirm') {
          $(this).unbind('click').replaceWith('<div class="sk-circle"><div class="sk-circle1 sk-child"></div><div class="sk-circle2 sk-child"></div><div class="sk-circle3 sk-child"></div><div class="sk-circle4 sk-child"></div><div class="sk-circle5 sk-child"></div><div class="sk-circle6 sk-child"></div><div class="sk-circle7 sk-child"></div><div class="sk-circle8 sk-child"></div><div class="sk-circle9 sk-child"></div><div class="sk-circle10 sk-child"></div><div class="sk-circle11 sk-child"></div><div class="sk-circle12 sk-child"></div></div>');

          PotionShack.purchaseCatalyst(count);
        } else {
          Lightbox.close();
        }
      })
      Lightbox.setFrameDimensions(500, 160);
    });

    // Show how to dialog
    PotionShack.s.howTo.on('click', function(e){
      var _this = this;
      e.preventDefault();

      Lightbox.setTitle('earn free items!');
      Lightbox.loadContent('<img src="'+$(_this).data('url')+'" ><span id="confirm">Continue</span>');
      Lightbox.element.find('span').bind('click', function(e) {
        e.preventDefault();
        Lightbox.close();
      })
      Lightbox.setFrameDimensions(833, 499, 10);
    });

    // Show prize list
    PotionShack.s.prizes.on('click', function(e){
      e.preventDefault();

      Lightbox.setTitle('prize list');
      Lightbox.element.bind('click', Lightbox.close);
      Lightbox.loadContent('<img src="'+$(this).attr('href')+'" >');
      Lightbox.setFrameDimensions(833, 499, 10);
    });
    // show bounty board
    PotionShack.s.bounties.on('click', function(e){
      e.preventDefault();

      Lightbox.setTitle('');
      Lightbox.element.bind('click', Lightbox.close);
      Lightbox.loadContent('<img src="'+$(this).attr('href')+'" >');
      Lightbox.setFrameDimensions(662, 500, 10);
    });

    PotionShack.s.start.on('click', PotionShack.begin);
  },
  begin: function() {
    PotionShack.catalystsCount = parseInt(PotionShack.s.catalysts.text());
    if (PotionShack.catalystsCount >= 5) {
      PotionShack.s.start.unbind('click');
      KyraSpeach.state = 'choose';
      KyraSpeach.changeText(KyraSpeach.copy[KyraSpeach.state][0].speach)

      PotionShack.s.start.hide();
      PotionShack.s.kyra.addClass('after');
      PotionShack.s.cauldron.addClass('jiggle');
      PotionShack.showBottles();
    } else {
      Lightbox.setTitle('Oops!');
      Lightbox.loadContent('<div class="dialog"><p>You do not have enough catalysts to continue.</p><span id="confirm">Close</span></div>');
      Lightbox.element.find('span').bind('click', function(e) {
        e.preventDefault();
        Lightbox.close();
      })
      Lightbox.setFrameDimensions(386, 140);
    }
  },
  purchaseCatalyst: function(count) {
    if(!PotionShack.sending) {
      PotionShack.sending = true;
      $.ajax({
        type: 'POST',
        url: '/tera/potion-shack/purchase_catalyst',
        data: {
          catalyst: count, 
          game_account_id: PotionShack.user
        },
        success: function(data){
          data = $.parseJSON(data);

          PotionShack.sending = false;

          if (data.error) {
            Lightbox.setTitle('Oops!');
            Lightbox.loadContent('<div class="dialog"><p>You don\'t have enough EMP to buy this item.</p><span id="confirm">Continue</span></div>');
            Lightbox.element.find('span').bind('click', function(e) {
              e.preventDefault();
              Lightbox.close();
            })
            Lightbox.setFrameDimensions(500, 130);
          } else {
            PotionShack.s.catalysts.text(data.catalyst);
            PotionShack.catalystsCount = data.catalyst;
            PotionShack.s.emp.text(data.emp);
            Lightbox.close();
          }
        }
      });
    }
  },
  moveBottle: function(bottle, top, left, delay) {
    bottle.velocity({
      top: top,
      left: left
    }, {
      duration: 800,
      easing: [300, 20],
      delay: delay
    })
      .addClass('inPlace').bind('click', PotionShack.openGift);
  },
  showBottles: function() {
    PotionShack.moveBottle(PotionShack.s.bottles.yellow, 176, 503, 0);
    PotionShack.moveBottle(PotionShack.s.bottles.blue, 298, 89, 150);
    PotionShack.moveBottle(PotionShack.s.bottles.red, 159, 40, 300);
    PotionShack.moveBottle(PotionShack.s.bottles.purple, 380, 267, 450);
    PotionShack.moveBottle(PotionShack.s.bottles.green, 287, 423, 600);
    setTimeout(function(){
      PotionShack.s.cauldron.removeClass('jiggle');
    }, 400);
  },
  openGift: function() {
    var chosen = this,
        index = $(chosen).data('index');
    PotionShack.chosenColor = $(chosen).data('color');

    // Remove all bottles from the screen except the chosen one
    $.each(PotionShack.s.bottles.all, function() {
      var _this = this;

      $(_this).unbind('click');

      if ($(_this).attr('id') !== $(chosen).attr('id')) {
        $(_this).velocity({
          top: 150,
          left: 1000
        }, {
          duration: 400,
          easing: 'easeInSine',
          complete: function() {
            $(_this).removeAttr('style');
          }
        });
      }
    })

    // Move bottle into cauldron
    $(chosen).velocity({
        top: 140,
        left: 272
      }, {
        duration: 800,
        easing: 'easeInSine',
        complete: function() {
          $(chosen).css({'z-index': 2});
        }
      }).velocity({
        top: 280,
        left: 272
      }, {
        duration: 400,
        easing: 'easeInSine',
        delay: 200,
        complete: function() {
          $(chosen).removeAttr('style');
          $('.burst, #card').addClass(PotionShack.chosenColor);

          $('.spinner.one').velocity({
            opacity: 1
          }, {
            duration: 0,
            display: 'block',
            delay: 0,
            complete: function() {
              $('#cauldron, #bubbles').hide();
              $('#bouncer').velocity({
                opacity: 1
              }, {
                duration: 0,
                display: 'block',
                delay: 0,
                complete: function() {

                  $.ajax({
                    type: 'POST',
                    url: '/tera/potion-shack/open_gift',
                    data: {
                      open_index: index
                    },
                    success: function(data){
                      data = $.parseJSON(data);
                      if (!data.error) {
                        PotionShack.s.catalysts.text(data.catalyst);
                        if (data.gift.emp) {
                          data.selected_game_item.display_name = data.gift.emp + " EMP";
                          data.selected_game_item.image = "http://static.enmasse.com/store/potion-shack/EMP_Prizes/" + data.gift.emp + "EMP.png";

                          PotionShack.updateEmp(data.gift.emp);
                        }

                        if (data.selected_game_item.image) {
                          $('#prizeImage').css('background-image', 'url('+data.selected_game_item.image+')');
                        }
                        $('#prizeTitle').text(data.selected_game_item.display_name);

                        $('.spinner.two').velocity({
                          opacity: 1
                        }, {
                          duration: 100,
                          display: 'block',
                          delay: 1100,
                          complete: function() {
                            PotionShack.s.kyra.removeClass('after');
                            $('#card').velocity({
                              opacity: 1
                            }, {
                              duration: 800,
                              display: 'block',
                              delay: 0,
                              complete: function() {
                                $('#card').addClass('stars');
                                $('#cauldron, #bubbles').removeAttr('style');
                                $('#bouncer').hide();
                                $('.spinner').fadeOut();
                              }
                            }).velocity({
                              top: 600
                            }, {
                              duration: 800,
                              delay: 2000,
                              complete: function() {
                                KyraSpeach.state = 'finish';
                                KyraSpeach.changeText(KyraSpeach.copy[KyraSpeach.state][0].speach)
                                $('.burst, #card').removeClass(PotionShack.chosenColor);
                                PotionShack.reset();
                              }
                            });
                          }
                        });
                      } else {
                        Lightbox.setTitle('Error!');
                        Lightbox.loadContent('<div class="dialog"><p>' + data.message + '</p><a href="confirm">Continue</a></div>');
                        Lightbox.element.find('a').bind('click', function(e) {
                          e.preventDefault();
                          Lightbox.close();
                        })
                        Lightbox.setFrameDimensions(500, 220);
                      }
                    }
                  });
                }
              });
            }
          });
        }
      });
  },
  updateEmp: function(emp) {
    var current = parseInt($('#balance').text());
    $('#balance').text( current + emp );
  },
  reset: function() {
    $('#card, #bouncer').removeAttr('style class');
    PotionShack.s.bottles.all.removeAttr('style').removeClass('inPlace');
    $('#prizeImage').removeAttr('style');
    $('#prizeTitle').text('');

    PotionShack.s.start.on('click', PotionShack.begin).show();
  }
};


(function(){
  window.onload = function() {
    function loadLink(id) {
      try {
        _tera_client_proxy_;
      }
      catch(err) {
        _tera_client_proxy_ = null;
      }
      if (_tera_client_proxy_) {
        _tera_client_proxy_.invoke_menu(id);
      }
    }

    PotionShack.init();

    function listen(e) {
      e.stopPropagation();
      $('#potion-shack').unbind('click');
      $('.buy-emp button').bind('click', buyEmp);
    }

    function buyEmp(e) {
      e.stopPropagation();
      $('.buy-emp button').unbind('click');
      loadLink(130)
      $('#potion-shack').bind('click', listen);
    }

    $('.buy-emp button').bind('click', buyEmp);
  };
})();
