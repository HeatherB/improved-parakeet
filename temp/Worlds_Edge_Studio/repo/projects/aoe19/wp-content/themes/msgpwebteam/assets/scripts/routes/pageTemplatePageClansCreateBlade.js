import config from '../config';
import ClanForm from '../component/ClanForm';
import alertNotLoggedIn from '../templates/alertNotLoggedIn.html';
import alertMobileDevice from '../templates/alertMobileDevice.html';

export default {
  init() {
    let $main = $('#clans-create-main');
  /*  if (config.isMobileDevice) {
      $main.children().remove();
      $main.addClass('section--padding').append(alertMobileDevice());
    } else {*/
    
      if (config.userLoggedIn) {
        
        if(window.wp_object.ownsClan.length && window.wp_object.clanId == null){
          let clanID = window.wp_object.ownsClan;
          window.location.href = `/clans/details/${clanID}/edit`;
        } else if(!window.wp_object.ownsClan.length && window.wp_object.clanAssoc.length) {
          let clanID = window.wp_object.clanAssoc;
          window.location.href = `/clans/details/${clanID}`;
        } 
        new ClanForm($('#clans-create'));
        
      } else {
        $main.children().remove();
        $main.addClass('section--padding').append(alertNotLoggedIn());
      }
    //}
  },
};
