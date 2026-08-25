import config from '../config';
import ModForm from '../component/ModForm';
import alertNotLoggedIn from '../templates/alertNotLoggedIn.html';
import alertXBLLoginOnly from '../templates/alertXBLLoginOnly.html';
import alertMobileDevice from '../templates/alertMobileDevice.html';

export default {
  init() {
    let $main = $('#mods-create-main');
    if (config.isMobileDevice) {
      $main.children(':not(.section-nav.mods-nav)').remove();
      $main.append(alertMobileDevice());
    } else {
        if (config.userLoggedIn) {
            if (config.acctType == 'steam') {
                $main.children(':not(.section-nav.mods-nav)').remove();
                $main.append(alertXBLLoginOnly());
            } else {
                new ModForm($('#mods-create'));
            }        
        } else {
            $main.children(':not(.section-nav.mods-nav)').remove();
            $main.append(alertNotLoggedIn());
        }
    }
  },
};
