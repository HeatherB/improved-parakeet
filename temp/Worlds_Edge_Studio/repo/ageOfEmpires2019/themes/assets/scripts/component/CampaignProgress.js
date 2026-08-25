import * as d3 from "d3";
import TweenMax from 'gsap';
import config from '../config';
import Loading from './Loading';
import templateResults from '../templates/campaignProgress.html';
import templateNoResults from '../templates/statsShowNoResults.html';
import templateMyStatsNav from '../templates/myStatsNav.html';
import Pagination from './Pagination';
import ajaxPost from '../util/ajaxPost';

export default class CampaignProgress {
  constructor($container, objOptions) {
    this.init($container, objOptions)
  }
  init($container, objOptions) {
    let self = this;
    this.options = Object.assign({
      apiPropNames      : null,
      api               : null,
      resultsTemplate   : templateResults,
      noResultsTemplate : templateNoResults,
      myStatsNavTemplate: templateMyStatsNav,
      gamertag          : null,
      game              : 'age',
      player            : 0,
      gameId            : 0,
      profileId         : null,
      renderHeader      : true,
      homeUrl           : window.wp_object.homeURl,
      modalTemplate     : null,
    }, objOptions);
    this.ui = Object.assign({
      container   : $container,
      results     : $('.campaign-results-container'),
      mounts      : {
        header          : '.js-myStatsNav-mount',
        mainMount       : $container,
        noResults       : '.stats-showNoResults',
        modal           : $('#match-details-modal'),
        modalMount      : $('.js-match-summary-mount'),
        errorMount      : $('.stats-showNoResults'),
      },
    })

    this.loader = new Loading({
      container: $('body'),
    });

    this.loader.show();

    this.messages = {
      noStatsMessage    : "No stats available - go play!",
    };

    this.data = {
      homeUrl     : this.options.homeUrl,
      gameType  : 'c',
      game        : this.options.game,
      player      : this.options.player,
      gameId      : this.options.gameId,
      gamertag    : this.options.gamertag,
      profileId   : this.options.profileId,
      apiRequest  : {
        [this.options.apiPropNames.userHandle]    : this.options.gamertag,
        [this.options.apiPropNames.player]        : this.options.player,
        [this.options.apiPropNames.gameId]        : this.options.gameId,
        [this.options.apiPropNames.profileId]     : this.options.profileId,
      },
    };

    this.data.campaignImagePaths = {
      ascentOfEgypt: 'ascent-of-egypt_opt.jpg',
      aveCaesar: 'ave-caesar_opt.jpg',
      customCampaign: 'custom-campaign_opt.jpg',
      enemiesOfRome: 'enemies-of-rome_opt.jpg',
      gloryOfGreece: 'glory-of-greece_opt.jpg',
      imperiumRomanum: 'imperium-romanum_opt.jpg',
      reignOfTheHittites: 'reign-of-the-hittites_opt.jpg',
      riseOfRome: 'rise-of-rome_opt.jpg',
      theFirstPunicWar: 'the-first-punic-war_opt.jpg',
      voicesOfBabylon: 'voices-of-babylon_opt.jpg',
      yamatoEmpireOfTheRisingSun: 'yamato-empire-of-the-rising-sun_opt.jpg',
    }

    let xhrs = [
      ajaxPost({
        url: this.options.api,
        data: JSON.stringify(this.data.apiRequest),
      }),
    ];
    this._ajaxPromise(xhrs, this._getCampaigns, null)
  }
  _renderHeader() {
    if ( this.options.renderHeader == true ) {
      let $html = $(this.options.myStatsNavTemplate(this.data));
      $(this.ui.mounts.header).html($html);
    }
    else {
      return;
    }
  }
  _getCampaigns() {
    let self = this;

    let renderResults = [
      self._renderResults,
    ];
    this._ajaxPromise(renderResults);
  }
  _showNoResults() {
    let self = this;
    self.data.results = self._staticCampaign();
    self._findCampaignImage();
    $('.stats-toggle-visibility').removeClass('hide');
    $('.stats-msp').addClass('hide');
    $('.campaign-results-container').removeClass('hide');
    self._renderResults();
  }
  _ajaxPromise(arr, cb = null, loader = null) {
    var self = this;
    self.ajaxCallback = cb;
    $.when.apply($,arr)
      .done(function(response, textStatus, xhr) {
        if(textStatus === 'nocontent') {
          self._showNoResults();
        } else {
          if (response) {
            if( response.hasOwnProperty(self.options.apiPropNames.user) ) {
              self.data.user = response[self.options.apiPropNames.user];
              if (!response.hasOwnProperty(self.options.apiPropNames.campaignResults)) {
                self._renderHeader();
                self._showNoResults();
                $(self.ui.mounts.toggleVisibility).addClass('hide');
              }
            }
            if (response.hasOwnProperty(self.options.apiPropNames.campaignResults)) {
              self.data.results = response[self.options.apiPropNames.campaignResults];
              self._findCampaignImage();
              $('.stats-toggle-visibility').removeClass('hide');
              $('.stats-msp').addClass('hide');
              $('.campaign-results-container').removeClass('hide');
            }

            if (!self.data.results) {
              self._showNoResults();
            } else {
              self._renderResults();
              self._renderHeader();
            }
          }
        }
      }).fail(function(){
      self._showNoResults();
      //console.log("ajax failed");
    })
  }
  _findCampaignImage() {
    let self = this;
    let imagePath = window.wp_object.imageurl + "campaign-stats/";

    for (var key in self.data.results) {
      if (self.data.results[key].name == 'Ascent of Egypt') {
        self.data.results[key].imagePath = imagePath + self.data.campaignImagePaths.ascentOfEgypt;
      }
      if (self.data.results[key].name == 'Ave Caesar') {
        self.data.results[key].imagePath = imagePath + self.data.campaignImagePaths.aveCaesar;
      }
      if (self.data.results[key].name == 'Enemies of Rome') {
        self.data.results[key].imagePath = imagePath + self.data.campaignImagePaths.enemiesOfRome;
      }
      if (self.data.results[key].name == 'Glory of Greece') {
        self.data.results[key].imagePath = imagePath + self.data.campaignImagePaths.gloryOfGreece;
      }
      if (self.data.results[key].name == 'Reign of the Hittites') {
        self.data.results[key].imagePath = imagePath + self.data.campaignImagePaths.imperiumRomanum;
      }
      if (self.data.results[key].name == 'The First Punic War') {
        self.data.results[key].imagePath = imagePath + self.data.campaignImagePaths.reignOfTheHittites;
      }
      if (self.data.results[key].name == 'The Rise of Rome') {
        self.data.results[key].imagePath = imagePath + self.data.campaignImagePaths.riseOfRome;
      }
      if (self.data.results[key].name == 'Voices of Babylon') {
        self.data.results[key].imagePath = imagePath + self.data.campaignImagePaths.voicesOfBabylon;
      }
      if (self.data.results[key].name == 'Yamato, Empire of the Rising Sun') {
        self.data.results[key].imagePath = imagePath + self.data.campaignImagePaths.yamatoEmpireOfTheRisingSun;
      }
      if (self.data.results[key].name == 'Imperium Romanum') {
        self.data.results[key].imagePath = imagePath + self.data.campaignImagePaths.imperiumRomanum;
      }
    }
  }
  _renderResults() {
    let self = this;
    $(this.ui.mounts.noResults).html('')
    this.ui.results.empty();
    let $html = $(this.options.resultsTemplate(this.data));
    this.ui.results.html($html);
    this.loader.hide();
  }

  _staticCampaign() {
    return (
      [
        {
          "id": 1,
          "name": "William Wallace",
          "value": 0.0,
          "max": 7,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/williamwallace.jpg",
        },
        {
          "id": 2,
          "name": "Joan of Arc",
          "value": 0.0,
          "max": 6,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/joanofarc.jpg",
        },
        {
          "id": 3,
          "name": "Saladin",
          "value": 0.0,
          "max": 6,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/saladin.jpg",
        },
        {
          "id": 4,
          "name": "Genghis Khan",
          "value": 0.0,
          "max": 6,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/genghiskhan.jpg",
        },
        {
          "id": 5,
          "name": "Barbarossa",
          "value": 0.0,
          "max": 6,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/barbarossa.jpg",
        },
        {
          "id": 6,
          "name": "Attila the Hun",
          "value": 0.0,
          "max": 6,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/attilathehun.jpg",
        },
        {
          "id": 7,
          "name": "El Cid",
          "value": 0.0,
          "max": 6,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/elcid.jpg",
        },
        {
          "id": 8,
          "name": "Montezuma",
          "value": 0.0,
          "max": 6,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/montezuma.jpg",
        },
        {
          "id": 9,
          "name": "Alaric",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/alaric.jpg",
        },
        {
          "id": 10,
          "name": "Dracula",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/dracula.jpg",
        },
        {
          "id": 11,
          "name": "Bari",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/bari.jpg",
        },
        {
          "id": 12,
          "name": "Sforza",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/sforza.jpg",
        },
        {
          "id": 13,
          "name": "Pachacuti",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/pachacuti.jpg",
        },
        {
          "id": 14,
          "name": "Prithviraj",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/prithviraj.jpg",
        },
        {
          "id": 15,
          "name": "Historical Battles",
          "value": 0.0,
          "max": 16,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/historicalbattles.jpg",
        },
        {
          "id": 16,
          "name": "Tariq",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/tariq.jpg",
        },
        {
          "id": 17,
          "name": "Sundjata",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/sundjata.jpg",
        },
        {
          "id": 18,
          "name": "Francisco de Almeida",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/franciscodealmeida.jpg",
        },
        {
          "id": 19,
          "name": "Yodit",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/yodit.jpg",
        },
        {
          "id": 20,
          "name": "Gajah Mada",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/gajahmada.jpg",
        },
        {
          "id": 21,
          "name": "Suryavarman",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/suryavarman.jpg",
        },
        {
          "id": 22,
          "name": "Bayinnaung",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/bayinnaung.jpg",
        },
        {
          "id": 23,
          "name": "Le Loi",
          "value": 0.0,
          "max": 6,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/leloi.jpg",
        },
        {
          "id": 24,
          "name": "Tamerlane",
          "value": 0.0,
          "max": 6,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/tamerlane.jpg",
        },
        {
          "id": 25,
          "name": "Ivaylo",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/ivaylo.jpg",
        },
        {
          "id": 26,
          "name": "Kotyan",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/kotyan.jpg",
        },
        {
          "id": 27,
          "name": "The Art of War",
          "value": 0.0,
          "max": 5,
          "imageUrl": "https://cdn.ageofempires.com/aoe/ageii-campaign/theartofwar.jpg",
        },
      ]
    );
  }
}