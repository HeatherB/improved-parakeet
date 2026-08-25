import config from '../config';
import twitterTemplate from '../templates/communityConnections.html';
export default class CommunityConnections {

  constructor() {
    this.init();
  }

  init() {
    $.get(config.api.TwitterFeed,
      function (res) {
        if (res != null) {
          $('#community-connections').html(twitterTemplate(res));
        }
      });
  }
}
