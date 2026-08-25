//import config from '../config';
import modDetailDiscussion from '../templates/modDetailDiscussion.html';

export default class ModDiscussion {
  constructor() {
    this.init();
  }

  init() {
    console.log('capture user reviews / discussion');

    this.ui = {
      $detailDiscussion: $('#mod-detail-discussion'),
    };


  }

  _renderModDiscussion(response) {
    this.ui.$detailDiscussion.html(modDetailDiscussion(response));
  }

}
