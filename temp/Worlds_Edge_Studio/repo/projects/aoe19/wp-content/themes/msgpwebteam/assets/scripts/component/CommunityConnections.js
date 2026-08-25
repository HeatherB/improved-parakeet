import config from '../config';
import twitterTemplate from '../templates/communityConnections.html';
export default class CommunityConnections {
   
   constructor() {
      this.init();
   }

   init() {
    var self = this;
     $.get(config.api.TwitterFeed,
        function( res ){
            //res = JSON.parse(res);
            //console.log(res);
           if( res == null ) {
              //console.log('Social content not available');
                //failed
           } else {               
               $('#community-connections').html(twitterTemplate(res));
              self._addAltTags();     
           }
           //console.log('Social content ready...');
        });        
   }

  _addAltTags() {
    let imgElements = $('#community-connections').find('img');
    if(imgElements) {
      $(imgElements).attr('alt','social channel avatar image');
    }
  }
}
