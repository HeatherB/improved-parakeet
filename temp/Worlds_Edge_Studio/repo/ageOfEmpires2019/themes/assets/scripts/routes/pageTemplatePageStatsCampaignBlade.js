import CampaignProgress from '../component/CampaignProgress';
import ProgressAnim from '../component/ProgressAnim';

export default {
  init() {
    this.testing = true;
    this.testId = '2535442682337665';
    this.testingUser = 'userId';
    let gamertag  = (window.wp_object.gamertag) ? window.wp_object.gamertag : null;
    let userId    = (window.wp_object.user_id) ? window.wp_object.user_id : null;
    this.playerId = (null !== gamertag) ? gamertag : userId;
    let user = (null !== gamertag) ? 'gamertag' : 'userId';
    if( this.testing == true ) {
      user = this.testingUser;
      this.playerId = this.testId;
    }

    this.ui = {
      // progressBars    : $('.progress-bar'),
      // progressCircles : $('.progress-circle'),
      results         : $('.campaign-results-container'),
    };

    this.apiPropNames = {
      results         : 'campaignProgress',
      user            : 'user',
      userId          : 'userId',
      gamertag        : 'gamertag',
      userHandle      : user,
      statList        : 'campaignStatList',
    };

    // if (this.ui.progressBars.length) {
    //   this.ui.progressBars.each((i, el) => {
    //     new ProgressAnim($(el), {});
    //   });
    // }

    if (this.ui.results.length) {
      this.ui.results.each((i, el) => {
        let $curResults = $(el);
        new CampaignProgress($curResults, {
          apiPropNames  : this.apiPropNames,
          playerId      : this.playerId,
        });
      });
    }

    // if (this.ui.progressCircles.length) {
    //   this.ui.progressCircles.each((i, el) => {
    //     new ProgressAnim($(el), {
    //       selectorBar       : null,
    //       selectorNumber    : '.progress-circle__number',
    //       isBar             : false,
    //     });
    //   });
    // }
  },
};

