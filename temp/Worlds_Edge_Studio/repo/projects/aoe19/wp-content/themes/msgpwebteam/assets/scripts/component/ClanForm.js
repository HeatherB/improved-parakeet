import Foundation from 'foundation';
import FieldKit from './FieldKit';
import clanForm from '../templates/clanForm.html';
import ajaxGet from '../util/ajaxGet';
import ajaxPost from '../util/ajaxPost';
import config from '../config';
import Loading from '../component/Loading';
import _ from 'underscore';

export default class ClanForm {
    constructor($container, objOptions) {
        this.init($container, objOptions);
    }

    /**
     * Initialize the clan form
     * @param  {Object} $container jQuery object containing DOM element form will be contained in
     * @param  {Object} objOptions Form options a user wants to customize
     */
    init($container, objOptions) {

        // set options
        this.options = Object.assign({
            clanId: window.wp_object.clanId || null,
            playerId: window.wp_object.playerId || null,
            retryCount: 0,
            dataLogoBgs: null,
            contentValid: true,
            dataLogoShields: null,
            dataLogoIcons: null,
            dataBgs: null,
            dataDetails: null,
        }, objOptions);
        // set ui elements
        this.ui = {
            $container: $container,
            $form: null,
            $inputName: null,
            $inputMotto: null,
            $inputTag: null,
            $selectLanguage: null,
            $selectVisibility: null,
            $selectActivityLevel: null,
            $selectAvgSkillLevel: null,
            $selectApplications: null,
            $textareaManifesto: null,
            $textareaDailyMessage: null,
            $inputLogoBackground: null,
            $inputLogoShield: null,
            $inputLogoIcon: null,
            $logoBackgroundImage: null,
            $logoShieldImage: null,
            $logoIconImage: null,
            $btnLogosReset: null,
            $inputBackground: null,
            $btnCancel: null,
            saveMotd: "",
        };

        // create loader instances
        this.loader = new Loading({
            container: this.ui.$container,
        });

        // load data for form
        this._getClanData();
    }

    //Get external info
    //Languages
    _loadLanguages(selected) {
        $.ajax({
            url: config.api.languages,
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, value) {
                    var sLanguage = '';
                    if (selected == value.utf8Language) {
                        sLanguage = 'selected';
                    } else {
                        sLanguage = '';
                    }
                    var item = "<option value='" + value.utf8Language + "' " + sLanguage + " >" + value.utf8Language + "</option>";
                    $('#clan-lang').append(item);
                });
            },
        });
    }

    /**
     * Get various data needed to display the clan create/edit form
     */
    _getClanData() {
        let xhrs = [
            ajaxGet({url: config.api.clansLogoBgs, crossDomain: true, xhrFields: {
                withCredentials: false,
              } }), // get logo backgrounds
            ajaxGet({url: config.api.clansLogoIcons, crossDomain: true, xhrFields: {
                withCredentials: false,
              } }), // get logo icons
            ajaxGet({url: config.api.clansLogoShields, crossDomain: true, xhrFields: {
                withCredentials: false,
              } }), // get logo shields
            ajaxGet({url: config.api.clansBgs, crossDomain: true, xhrFields: {
                withCredentials: false,
              } }), // get clan backgrounds behind logo
        ];

        // get clan data if we're in edit mode
        if (this.options.clanId) {
            xhrs.push(ajaxGet({
                url: config.api.clansDetail,
                data: {
                    'clanId': this.options.clanId,
                },
            }));
        }
        this.loader.show();
        Promise.all(xhrs).then((response) => {
            if ((response.length === 4 && !this.options.clanId) || (response.length === 5 && this.options.clanId)) {
                this._render(response);
            } else {
                this._loadError();
            }
            this.loader.hide();
        }).catch((err) => {
            this._loadError(err);
            this.loader.hide();
        });
    }

    /**
     * Retry loading on falure 2 times
     * @param  {Object} err Object containing error message details
     */
    _loadError(err) {
        if (this.options.retryCount < 2) {
            this.options.retryCount++;
            this._getClanData();
        } else {
            console.warn('ERROR!', err);
        }
    }

    /**
     * Render the form based on the API response
     * @param  {Object} response Reponse object from API requests containing logo, background and clan details data.
     */
    _render(response) {
        const formData = {
            id: null,
            logoBgs: null,
            logoIcons: null,
            logoShields: null,
            backgrounds: null,
            name: null,
            motto: null,
            tag: null,
            language: null,
            visibility: null,
            activityLevel: null,
            avgSkillLevel: null,
            applications: null,
            manifesto: null,
            dailyMessage: null,
            logoBg: null,
            logoShield: null,
            logoIcon: null,
            background: null,
        };
        this.options.dataLogoBgs = response[0];
        this.options.dataLogoIcons = response[1];
        this.options.dataLogoShields = response[2];
        this.options.dataBgs = response[3];
        this.options.dataDetails = response[4];
        // set form data values
        if (this.options.clanId) {
            formData.id = this.options.clanId;
        }
        // if (this.options.playerId) formData.modCreator = this.options.playerId;

        formData.logoBgs = this.options.dataLogoBgs;
        formData.logoIcons = this.options.dataLogoIcons;
        formData.logoShields = this.options.dataLogoShields;
        formData.backgrounds = this.options.dataBgs;

        if (this.options.dataDetails) {
            formData.name = this.options.dataDetails.clans[0].clanName;
            formData.motto = this.options.dataDetails.clans[0].clanMotto;
            formData.tag = this.options.dataDetails.clans[0].clanTag;
            formData.language = this.options.dataDetails.clans[0].language;
            formData.visibility = this.options.dataDetails.clans[0].visibility;
            formData.activityLevel = this.options.dataDetails.clans[0].activity;
            formData.avgSkillLevel = this.options.dataDetails.clans[0].skill;
            formData.applications = this.options.dataDetails.clans[0].application;
            formData.manifesto = this.options.dataDetails.clans[0].manifesto;
            formData.dailyMessage = this.options.dataDetails.clans[0].dailyMessage;
            formData.logoBg = this.options.dataDetails.clans[0].bannerPoster.postId;
            formData.logoShield = this.options.dataDetails.clans[0].logoShield.postId;
            formData.logoIcon = this.options.dataDetails.clans[0].logoIcon.postId;
            formData.background = this.options.dataDetails.clans[0].backgroundImage.postId;
        }

        // assign formData as class member
        this.formData = formData;

        // render the form and init foundation again
        this.ui.$container.html(clanForm(formData)).foundation();

        // set ui vars based on updated ui
        this.ui.$form = $('#clans-form');
        this.ui.$inputName = $('#clan-name');
        this.ui.$inputMotto = $('#clan-motto');
        this.ui.$inputTag = $('#clan-tag');
        this.ui.$selectLanguage = $('#clan-language');
        this.ui.$selectVisibility = $('#clan-visibility');
        this.ui.$selectActivityLevel = $('#clan-activity-level');
        this.ui.$selectAvgSkillLevel = $('#clan-avg-skill-level');
        this.ui.$selectApplications = $('#clan-applications');
        this.ui.$textareaManifesto = $('#clan-manifesto');
        this.ui.$textareaDailyMessage = $('#clan-daily-message');
        this.ui.$inputLogoBackground = $('input[name="ClanLogoBackground"]');
        this.ui.$inputLogoShield = $('input[name="ClanLogoShield"]');
        this.ui.$inputLogoIcon = $('input[name="ClanLogoIcon"]');
        this.ui.$logoBackgroundImage = $('#logo-background-image');
        this.ui.$logoShieldImage = $('#logo-shield-image');
        this.ui.$logoIconImage = $('#logo-icon-image');
        this.ui.$btnLogosReset = $('#logos-reset');
        this.ui.$inputBackground = $('input[name="ClanBackgroundImage"]');
        this.ui.$btnCancel = $('#form-cancel');

        // init carousels
        $('#clan-backgrounds .carousel').slick({
            dots: true,
            infinite: false,
            slidesToShow: 2,
            slidesToScroll: 2,
            draggable: false,
            swipe: true,
            responsive: [
                {
                    breakpoint: 640,
                    settings: {
                        dots: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ],
        });
        this._initLogoCarousel('#logo-backgrounds');

        //listen for form events
        this._addEventListeners();
        this._resetLogos();

        // Disable Static Inputs
        if (this.options.clanId) {
            this._disableStaticInputs();
        }

        // If Chosen Logo Icon, Select it
        if (this.options.dataDetails && formData.logoIcon.length) {
            let logIconID = formData.logoIcon;
            $('#clans-logo-icon-' + logIconID).prop('checked', true).change();
        }

        // If Chosen Logo Shield, Select it
        if (this.options.dataDetails && formData.logoShield.length) {
            let logShielID = formData.logoShield;
            $('#clans-logo-shield-' + logShielID).prop('checked', true).change();
        }

        // If Chosen Logo Background, Select it
        if (this.options.dataDetails && formData.logoBg.length) {
            let bannerPosterID = formData.logoBg;
            $('#clans-logo-bg-' + bannerPosterID).prop('checked', true).change();
        }

        // If Chosen Background, Select it
        if (this.options.dataDetails && formData.background.length) {
            let bgID = formData.background;
            $('#clans-background-' + bgID).prop('checked', true).change();
        }

        let selected = '';

        if (typeof (this.options.dataDetails) != 'undefined') {
            selected = this.options.dataDetails.clans[0].language;
        }

        this._loadLanguages(selected);
        FieldKit.prototype.characterCount();
    }

    _disableStaticInputs() {
        this.ui.$inputName.prop('disabled', 'disabled');
        this.ui.$selectApplications.prop('disabled', 'disabled');
    }

    /**
     * Add event listeners to dom elements
     */
    _addEventListeners() {
        this.ui.$form.on('submit', (e) => {
            e.preventDefault();
            if (this.options.contentValid == true) {
                if (this._isValid()) this._submitForm();
            }
        });

        this.ui.$inputName.on('blur', () => {
            if (this.ui.$inputName.val().length) {
                let val = this.ui.$inputName.val();
                let okay = FieldKit.prototype.checkContent(this.ui.$inputName, this);
                if (okay) {
                    this._clanExists();
                }
            } else {
                this.ui.$inputName.parents('.form__item').removeClass('error');
                this.ui.$inputName.siblings('.field_error').remove();
            }
        });

        //Check Content on blur for emoji or bad words

        // Motto
        this.ui.$inputMotto.on('blur', () => {
            if (this.ui.$inputMotto.val().length) {
                FieldKit.prototype.checkContent(this.ui.$inputMotto, this);
            } else {
                this.ui.$inputMotto.parents('.form__item').removeClass('error');
                this.ui.$inputMotto.siblings('.field_error').remove();
            }
        });
        this.ui.$inputMotto.on('keyup', () => {
            FieldKit.prototype.characterCount();
        });

        // Tag
        this.ui.$inputTag.on('blur', () => {
            if (this.ui.$inputTag.val().length) {
                let okay = FieldKit.prototype.checkContent(this.ui.$inputTag, this);
                if (okay) {
                    this._checkExists('clan_tag', this.ui.$inputTag);
                }
            } else {
                this.ui.$inputTag.parents('.form__item').removeClass('error');
                this.ui.$inputTag.siblings('.field_error').remove();
            }
        });

        // Manifesto
        this.ui.$textareaManifesto.on('blur', () => {
            if (this.ui.$textareaManifesto.val().length) {
                FieldKit.prototype.checkContent(this.ui.$textareaManifesto, this);
            } else {
                this.ui.$textareaManifesto.parents('.form__item').removeClass('error');
                this.ui.$textareaManifesto.siblings('.field_error').remove();
            }
        });
        this.ui.$textareaManifesto.on('keyup', () => {
            FieldKit.prototype.characterCount();
        });

        // Daily Message
        this.ui.$textareaDailyMessage.on('blur', () => {
            if (this.ui.$textareaDailyMessage.val().length) {
                FieldKit.prototype.checkContent(this.ui.$textareaDailyMessage, this);
            } else {
                this.ui.$textareaDailyMessage.parents('.form__item').removeClass('error');
                this.ui.$textareaDailyMessage.siblings('.field_error').remove();
            }
        });
        this.ui.$textareaDailyMessage.on('keyup', () => {
            FieldKit.prototype.characterCount();
        });

        // Logo Background
        this.ui.$inputLogoBackground.on('change', () => {
            let val = this.ui.$inputLogoBackground.filter(':checked').val();
            //let obj = _.findWhere(this.formData.logoBgs, {postID: val});
            let obj = _.find(this.formData.logoBgs, function (rw) {
                return rw.postID == val
            });
            this.ui.$logoBackgroundImage.attr('src', obj.href);
        });

        // Logo Shield
        this.ui.$inputLogoShield.on('change', () => {
            let val = this.ui.$inputLogoShield.filter(':checked').val();
            //let obj = _.findWhere(this.formData.logoShields, {postID: val});
            let obj = _.find(this.formData.logoShields, function (rw) {
                return rw.postID == val
            });
            this.ui.$logoShieldImage.attr('src', obj.href);
        });

        // Logo Icon
        this.ui.$inputLogoIcon.on('change', () => {
            let val = this.ui.$inputLogoIcon.filter(':checked').val();
            //let obj = _.findWhere(this.formData.logoIcons, {postID: val});
            let obj = _.find(this.formData.logoIcons, function (rw) {
                return rw.postID == val
            });
            this.ui.$logoIconImage.attr('src', obj.href);
        });

        // Reset Logo Button
        this.ui.$btnLogosReset.on('click', () => {
            this._resetLogos();
        });

        // Cancel Button
        this.ui.$btnCancel.on('click', () => {
            this._cancel();
        });

        // Logo Layer Tabs
        $('#logo-tabs').on('change.zf.tabs', (event, tab) => {
            //$('.clans-create-logo .slick-initialized').slick('unslick');
            this._initLogoCarousel(tab.find('a').attr('href'));
        });
    }

    _initLogoCarousel(selector) {
        $(`${selector} .carousel`).slick({
            dots: true,
            infinite: false,
            draggable: false,
            swipe: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 640,
                    settings: {
                        dots: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ],
        });
    }

    //Check if clan name already exists locally
    _checkExists(metakey, item) {

        let dataArray = {
            metakey: metakey,
            metavalue: item.val(),
            clanId: window.wp_object.clanId,
        };

        let apiUrl = config.api.ClansCheckExisting;

        $.ajax({
            type: "POST",
            dataType: "json",
            url: apiUrl,
            data: dataArray,
            success: function (data) {
                if (data.success) {
                    if (!$(item).parents('.form__item').hasClass('error')) {
                        $(item).parents('.form__item').addClass('error');
                        if ($(item).siblings('.field_error').length) {
                            $(item).next('.field_error').remove();
                        }
                        $(item).after("<span class='field_error'>Name already in use</span>");
                    }
                } else {
                    $(item).parents('.form__item').removeClass('error');
                }
            },
        });

    }

    /**
     * Check if form is valid
     * @return {Boolean} Return boolean representing if for is valid
     */
    _isValid() {
        let formIsValid = true;
        const requiredFields = [
            this.ui.$inputName,
            this.ui.$inputMotto,
            this.ui.$inputTag,
            this.ui.$selectLanguage,
            this.ui.$selectVisibility,
            this.ui.$selectActivityLevel,
            this.ui.$selectAvgSkillLevel,
            this.ui.$selectApplications,
            this.ui.$textareaManifesto,
        ];
        // loop over required form fields
        $.each(requiredFields, (i, item) => {
            const $item = $(item);
            if ($item.val() === '') {
                $item.parents('.form__item').addClass('error');
                formIsValid = false;
            } else {
                $item.parents('.form__item').removeClass('error');
            }
        });

        //Tag is at least 2 characters long, no special characters and doesn't start with a space
        var pattern = /[^a-zA-Z\d ]/g;
        if (this.ui.$inputTag.val().length < 2 || this.ui.$inputTag.val()[0] == " " || pattern.test(this.ui.$inputTag.val())) {
            this.ui.$inputTag.parents('.form__item').addClass('error');
            formIsValid = false;
        } else {
            this.ui.$inputTag.parents('.form__item').removeClass('error');
        }

        // return if form is valid or not
        return formIsValid;
    }

    /**
     * Check if Name is available through clubs API
     * @return {JSON}
     */

    _isAvailable() {
        let formData = new FormData(this.ui.$form[0]);
        let apiUrl = config.api.clubReserve;

        ajaxPost({
            url: apiUrl,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
        }).then((response) => {

            if (response.success === 'true') {
                this.ui.$inputName.parents('.form__item').removeClass('error');
                this.ui.$inputName.next('.field_error').remove();
            } else if (!this.ui.$inputName.parents('.form__item').hasClass('error')) {
                this.ui.$inputName.parents('.form__item').addClass('error');
                if (this.ui.$inputName.siblings('.field_error').length) {
                    this.ui.$inputName.next('.field_error').remove();
                }
                this.ui.$inputName.after("<span class='field_error'>Name already in use</span>");
            }

        }).catch(() => {
            // error reaching api
            this.ui.$form.addClass('error');
            this.loader.hide();
        });

    }

    _clanExists() {
        let formData = new FormData(this.ui.$form[0]);
        let apiUrl = config.api.ClansCheckExistingClan;

        ajaxPost({
            url: apiUrl,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
        }).then((response) => {

            if (!response.success) {
                this.ui.$inputName.parents('.form__item').removeClass('error');
                this.ui.$inputName.next('.field_error').remove();
                this._isAvailable();
            } else if (!this.ui.$inputName.parents('.form__item').hasClass('error')) {
                this.ui.$inputName.parents('.form__item').addClass('error');
                if (this.ui.$inputName.siblings('.field_error').length) {
                    this.ui.$inputName.next('.field_error').remove();
                }
                this.ui.$inputName.after("<span class='field_error'>Name already in use</span>");
            }

        }).catch(() => {
            // error reaching api
            this.ui.$form.addClass('error');
            this.loader.hide();
        });
    }

    /**
     * Gather and submit current form data
     */
    _submitForm() {
        let formData = new FormData(this.ui.$form[0]);

        let apiUrl = this.options.clanId === null ? config.api.clansSave : config.api.clansEdit;
        // reset form
        this.ui.$form.removeClass('error');
        this.loader.show();
        // setup ajax request

        ajaxPost({
            url: apiUrl,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
        }).then((response) => {

            if (response.resultKey && response.resultKey === 'ClanId' && response.resultValue && response.resultValue !== '-1') {
                // valid response, redirect to created detail page
                window.location.href = `/clans/details/${response.resultValue}/`;
            } else if (response.error) {
                this.ui.$form.addClass('form_error');
                this.ui.$form.find('.form__api-error').text(response.error);
                this.ui.$inputName.addClass('form_error');
                this.loader.hide();
            } else {
                // error creating clan
                this.ui.$form.addClass('form_error');
                this.loader.hide();
            }
        }).catch(() => {
            // error reaching api
            this.ui.$form.addClass('form_error');
            this.loader.hide();
        });
    }

    /**
     * Reset logo radio-buttons to original state
     */
    _resetLogos() {
        this.ui.$inputLogoBackground.first().prop('checked', true).change();
        this.ui.$inputLogoShield.first().prop('checked', true).change();
        this.ui.$inputLogoIcon.first().prop('checked', true).change();
    }

    /**
     * Cancel the form editing and return to clans landing or details based on if we are creating or editing a clan
     */
    _cancel() {
        if (this.options.clanId) {
            window.location.href = `/clans/details/${this.options.clanId}/`;
        } else {
            window.location.href = '/clans/';
        }
    }
}
