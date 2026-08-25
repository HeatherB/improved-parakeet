import GetMatchDetails from '../component/GetMatchDetails';
import ClearInputField from '../util/ClearInputField';
import config from '../config.js';

export default {
  init() {
    let testGameId = '9281CE62-504C-4172-8575-B38ABD0D2A83';
    let gamertag = window.wp_object.gamertag,
      gameType = ( window.wp_object.gameType ) ? window.wp_object.gameType : 'mp',
      gameId = ( window.wp_object.gameId ) ? window.wp_object.gameId : null, game = (window.wp_object.game) ? window.wp_object.game : 'age';
    this.constants = {
      testUsers: ['RjayAoE','idmikau', 'OpeningAbyss925', 'Rommui', 'LOboo', 'Marra333', 'PortalMean0', 'FourLand8285422', 'Boschty', 'FiReHieronim', '2 Dev 343933030', '2matayl11292017', 'dodonotdodo'],
      game: {
        age: {
          api: {
            mp: config.api.MPFull,
            sp: config.api.SPFull,
            c: config.api.campaignStats,
            mpList: config.api.MPMatchList,
            spList: config.api.SPMatchList,
            getMatchDetail: config.api.getMatchDetail,
          },
        },
        age2: {
          api: {
            getMatchDetail: config.api.getAge2MatchDetail,
          },
        },
      },
    }
    this.apiRequest = {
      gamertag: null,
      gameType: null,
      gameId  : null,
      game    : null,
    }
    this.apiPropNames = {
      results: 'playerList',
      metaResults: 'matchSummary',
    }
    this.ui = {
      $container: $('.js-player-list-mount'),
    };
    if (this.ui.$container) {
      this.apiRequest.game = ( game ) ? game : this.apiRequest.game;
      console.log('Game:' + this.apiRequest.game);
      new GetMatchDetails(this.ui.$container, {
        api           : this.constants.game[this.apiRequest.game].api.getMatchDetail,
        apiPropNames  : this.apiPropNames,
      })
    }
  },
}