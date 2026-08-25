import Header from '../component/Header';
import Nav from '../component/Nav';
import ButtonAnimation from '../component/ButtonAnimation';
import SubstanceAccordion from '../component/SubstanceAccordion';
import EuCookieBanner from '../component/EuCookieBanner';
import objectFitImages from 'object-fit-images';
import esrbRatingPending from '../../images/esrb/ratingsymbol_rp.png';
import TextModeration from "../component/TextModeration";
// SandButton script needs to run on all pages because it displays in
// "Become an Age Insider!" section at bottom of all pages
import SandButton from '../component/SandButton';

export default {
    init() {
        // JavaScript to be fired on all pages
        new ButtonAnimation();
        new SubstanceAccordion();
        new Header();
        new EuCookieBanner();
        new SandButton();

        this.nav = new Nav();

        this.ui = {
            $modal: $('#sign-in'),
            $steamModal: $('#sign-in-steam'),
            $descriptorList: $('.rating-descriptors'),
        }

        this.ratingDescriptors = this._getRatingDescriptors();
        this.ratingIcon = '.js-esrb-icon';
    },
    _getRatingDescriptors() {
        if ( $('body').hasClass('aoe') ) {
            return ['Blood','Mild Violence'];
        } else if ( $('body').hasClass('aoeiide') ) {
            return ['Mild Blood','Mild Language','Violence'];
        } else if ( $('body').hasClass('aoeiii') || $('body').hasClass('aom') ) {
            return ['Blood','Violence'];
        } else if ($('body').hasClass('age-of-empires-iv')) {
            return ['May contain content inappropriate for children. Visit esrb.org for rating information.'];
        } else {
            return ['Blood','Violence','Mild Language'];
        }
    },
    _setRating() {
        let self = this;
        let i=0;

        for(i; i < self.ratingDescriptors.length; i++) {
            self.ui.$descriptorList.append('<li>' + self.ratingDescriptors[i] + '</li>');
        }

        if ($('body').hasClass('age-of-empires-iv')) {
            $(self.ratingIcon).hide();
            $(self.ratingIcon + '.--pending').show();
        }
    },
    finalize() {
        // JavaScript to be fired on all pages, after page specific JS is fired
        let self = this;

        if ("ontouchstart" in document.documentElement) {
            $('html').addClass('has-touch');
        }

        $(window).ready(function () {
            $(document).on("touchstart click", ".js-sign-in", function (event) {
                event.preventDefault();
                self.ui.$modal.foundation('open');
                return false;
            });
            $(document).on("touchstart click", ".js-sign-in-steam", function (event) {
                event.preventDefault();
                self.ui.$steamModal.foundation('open');
                return false;
            });
        });

        $(document).ready(function() {
            objectFitImages();
            $('#stickyHeader').sticky( { zIndex: 500 });

            // check if IE and add class to body if so
            const ua = navigator.userAgent;

            if (ua.indexOf("MSIE ") > -1 || !!navigator.userAgent.match(/Trident.*rv\:11\./) ) {
                $('body').addClass('isIE');
            }

            self._setRating();
        });

    },
};
