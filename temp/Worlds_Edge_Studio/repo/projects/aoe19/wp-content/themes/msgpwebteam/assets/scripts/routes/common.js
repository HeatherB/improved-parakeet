import Header from '../component/Header';
import Nav from '../component/Nav';
import ButtonAnimation from '../component/ButtonAnimation';
import SubstanceAccordion from '../component/SubstanceAccordion';
import EuCookieBanner from '../component/EuCookieBanner';
import objectFitImages from 'object-fit-images';
import TextModeration from "../component/TextModeration";
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
        });

    },
};
