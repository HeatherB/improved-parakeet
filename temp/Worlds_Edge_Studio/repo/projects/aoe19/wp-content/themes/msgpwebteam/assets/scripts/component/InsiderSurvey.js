import Loading from "./Loading";
import config from "../config";
import * as Convert from 'xml-js';
import SteamLink from "./SteamLink";

export default class InsiderSurvey {
    constructor() {
        this.init();
    }

    init() {
        this.steamWindow;
        this.surveyFormData = {
            "invite_token": "none",
            "steam_persona": "",
            "pref_email": "",
            "demographic": {},
            "survey_status": {
                "status": "active",
                "action": "welcome",
                "success": "0",
                "survey_error": "0",
                "current_index": "0",
                "next_index": "1",
                "is_summary": "0",
            },
            "survey_data": {},
            "DxDiag": {},
        };
        this._processUrlParams();
        this._checkInviteToken();
        this._getCountries();
        this._events();
        this._accordionControl(this.surveyFormData.survey_status.current_index);
        this._initLoaders();
        this._initClasses();
    }

    _initClasses(){
        this.SteamLink = new SteamLink();
    }

    _initLoaders() {
        this.loader = new Loading({
            container: $('body'),
        });
    }

    _getCountries() {
        let self = this;

        self.surveyFormData['pref_country'] = $('#pref_country').data('country');

        $.ajax({
            dataType: "json",
            url: config.api.CountryList,
            success: function (response) {
                $('#pref_country').append('<option value="instruct"> - Select a Country/Region - </option>');
                $.each(response, function (key, value) {
                    let select = (value == self.surveyFormData.pref_country ? 'selected' : '');
                    $('#pref_country').append('<option value="' + value + '" ' + select + '>' + key + '</option>')
                });
            },
        });
    }

    _surveyError(error, sectionID) {
        $('.sub_ac_open .insider_content .error_msg').empty().append('<p>' + error + '</p>');
        var menuOffset = $('#stickyHeader').height();
        $('html, body').animate({
            scrollTop: $('.sub_ac_open').offset().top - menuOffset,
        }, 600);
        // Google Analytics - Error Tracking
        if (typeof window.dataLayer != 'undefined') {
            window.dataLayer.push({'event': 'survey_error_' + sectionID});
        }
    }

    _accordionControl(action) {
        let self = this;

        // Array of accordion sections
        var accordion = $('.question.cordian');
        var indexLimit = accordion.length;

        // Add an index attribute to the sections in order to track clicks
        $.each(accordion, function (i, object) {
            $(this).attr('data-section-index', i);
        });

        switch (action) {
            case 'next':
                // Don't advance if there are no more indexes
                if ((parseInt(this.surveyFormData.survey_status.current_index) + 1) >= indexLimit) {
                    break;
                }
                this.surveyFormData.survey_status.current_index = this.surveyFormData.survey_status.next_index;
                this.surveyFormData.survey_status.next_index = (parseInt(this.surveyFormData.survey_status.next_index) + 1).toString();
                break;
            case 'back':
                this.surveyFormData.survey_status.current_index = (parseInt(this.surveyFormData.survey_status.current_index) - 1);
                this.surveyFormData.survey_status.next_index = (parseInt(this.surveyFormData.survey_status.next_index) - 1).toString();
                break;
            case 'complete':
                this.surveyFormData.survey_status.current_index = indexLimit;
                this.surveyFormData.survey_status.next_index = indexLimit;
                break;
            default:
                this.surveyFormData.survey_status.current_index = action;
                this.surveyFormData.survey_status.next_index = (parseInt(action) + 1).toString();
        }

        // Update Summary Page
        self._survey_sumarize();

        // Close any open sections
        $('.sub_ac_open').removeClass('sub_ac_open');

        // Open Current accordion index
        $(accordion[parseInt(this.surveyFormData.survey_status.current_index)]).addClass('sub_ac_open');
        $('.sub_ac_open:not(.welcome)').removeClass('disabled');

        // Jump to next section
        $('html, body').animate({
            scrollTop: $('.sub_ac_open').offset().top -100,
        }, 500);

        // If there is an error then show it
        if (self.surveyFormData.survey_status.survey_error.length > 1) {
            $('.sub_ac_open').find('.title').addClass('incomplete');
            self._surveyError(self.surveyFormData.survey_status.survey_error, $(this).attr('ID'));
        }

    }

    _events() {

        let self = this;

        // Set Section Index
        $(document).on('click', '.cordian span.title', function () {
            // Get section index from click
            let clickedIndex = $(this).parents('.cordian').attr('data-section-index');

            self._accordionControl(clickedIndex);

        });

        // Clear all other fields when clicking none
        $(document).on('click', "input[data-exclusive='1']", function () {
            $(this).parents('ul').find('input[type=text]').prop('disabled', true);
            $(this).parents('ul').find('input[type=checkbox]:checked').prop('checked', false);
            $(this).prop('checked', true);
        });

        // Activate Other Input Box
        $(document).on('click ready load', "input[data-answer='other']", function () {
            if ($(this).prop('checked')) {
                $(this).parents('ul').find('input[type=text]').prop('disabled', false);
            } else {
                $(this).parents('ul').find('input[type=text]').prop('disabled', true);
            }
        });

        // Uncheck None if any other checkboxes are clicked
        $(document).on('click', "input[type=checkbox]:not(input[data-exclusive='1'])", function () {
            $(this).parents('ul').find("input[data-exclusive='1']:checked").prop('checked', false);
        });

        // Survey Answer Checkbox Changes (checked or unchecked)
        $(document).on('change', '.insider_survey .ac_content input[type="checkbox"]', function () {

            let checkboxValue = $(this).val();

            let survey_question_slide_id = $('.slick-slide.slick-current.slick-active .survey-slide').attr("id");

            if (checkboxValue == "Other") {

                // make "Other" checkboxes toggle the disabled status on the input text element
                let inputTextID = '#' + $(this).attr("id") + '_text';

                if ($(this).prop("checked")) {
                    $(inputTextID).prop('disabled', false);  // If checked enable item
                } else {
                    $(inputTextID).prop('disabled', true);  // If checked disable item
                    $(inputTextID).val("");
                }

            } else if (checkboxValue == "None") {
                // reset everything else to unchecked
                $('#survey_carousel #' + survey_question_slide_id + ' .survey-answers .survey-answer' + ' input.checkbox:not(.checkbox-reset)').prop("checked", false);
                $('#survey_carousel #' + survey_question_slide_id + ' .survey-answers .survey-answer' + ' .input-other-text input').val("");
            } else {
                // reset checkbox none
                $('#survey_carousel #' + survey_question_slide_id + ' .survey-answers .survey-answer input.checkbox.checkbox-reset').prop("checked", false);
            }

        });

        // Save and Continue
        $(document).on('click', '.insider_survey button.save-and-continue, a.save-and-continue', function (event) {
            event.preventDefault();

            let questionType = $(this).data('for-question');
            let question = $(this).parents('form').attr('id');

            switch (questionType) {
                case "insider_nda":
                    self._qt_nda(question);
                    break;
                case "beta_prefs":
                    self._qt_beta_prefs(question);
                    break;
                case "contact_prefs":
                    self._qt_contact_prefs(question);
                    break;
                case "demographic":
                    self._qt_demographic(question);
                    break;
                case "checkboxGroup":
                    self._qt_checkboxGroup(question);
                    break;
                case "steam_login":
                    self._accordionControl('next');
                    break;
                case "dx_upload":
                    self._accordionControl('next');
                    break;
            }
        });

        // DxDiag Upload
        $(document).on('change', '#dxdiag_upload', function (event) {

            //Retrieve the first (and only!) File from the FileList object
            let uploadedFile = event.target.files[0];

            if (uploadedFile) {

                let uploadedFileName = uploadedFile.name;
                let uploadedFileNameExtension = uploadedFileName.split('.').pop();

                if (uploadedFileNameExtension.toLowerCase() == 'xml') {
                    // this is an xml file so do the parsing

                    let r = new FileReader();
                    r.onload = function (e) {
                        var xmlData = e.target.result;

                        // Change xmlData into a json object

                        // https://www.npmjs.com/package/xml-js
                        // Converts the _text to a normal text node
                        let removeJsonTextAttribute = function (value, parentElement) {
                            let keyNo = Object.keys(parentElement._parent).length;
                            let keyName = Object.keys(parentElement._parent)[keyNo - 1];
                            parentElement._parent[keyName] = value;
                        };

                        // Setup the xml to json filtering options (note the textFn)
                        const convertOpts = {
                            compact: true,
                            trim: true,
                            ignoreDeclaration: true,
                            ignoreInstruction: true,
                            ignoreAttributes: true,
                            ignoreComment: true,
                            ignoreCdata: true,
                            ignoreDoctype: true,
                            spaces: 0,
                            textFn: removeJsonTextAttribute,
                        };

                        // Convert our xml file to a json string
                        let dxdiagString;
                        try {
                            dxdiagString = Convert.xml2json(xmlData, convertOpts);
                        } catch (error) {
                            // The xml file did not contain a DxDiag node
                            self._surveyError('The file provided does not appear to be a valid XML file.', 'dxdiag_upload');
                        }

                        // Then convert the json string to an object
                        let dxdiagObj = JSON.parse(dxdiagString);

                        // Check for a DxDiag node in the JSON Object
                        if (!dxdiagObj.DxDiag) {
                            self._surveyError('The file provided does not appear to be a valid DxDiag file.', 'dxdiag_upload');
                        } else {
                            // There is a DxDiag node present
                            // DxDiag final filtered data is assigned to the surveyFormData object
                            self.surveyFormData.DxDiag = dxdiagObj.DxDiag; // the entire DxDiagObject

                            // Clear Errors
                            $('.error_msg').empty();

                            // Extract and save important specs
                            self._save_pc_specs();

                            // Update Summary
                            self._survey_sumarize();

                            // Go to Next Index
                            self._accordionControl('next');
                        }

                    };
                    r.readAsText(uploadedFile);

                } else {
                    // this was not an xml file so throw an error
                    self._surveyError('The file provided does not appear to be a valid XML file.', 'dxdiag_upload');
                }

            } else {
                self._surveyError('The was an issue loading the file.', 'dxdiag_upload');
            }

        });

        // Submit Survey
        $(document).on('click', '#submit-survey', function (event) {
            event.preventDefault();

            // Create Form input for submission
            let surveyForm = '.insider_survey';

            // Machine ID From PC SPECS
            if (typeof self.surveyFormData.pc_specs != 'undefined') {
                self.surveyFormData['machine_id'] = self.surveyFormData.pc_specs.MachineId.replace(/[\{\}']+/g, '');
            }

            // Stringify the large objects
            self.surveyFormData.DxDiag = JSON.stringify(self.surveyFormData.DxDiag);
            self.surveyFormData.pc_specs = JSON.stringify(self.surveyFormData.pc_specs);

            // Set Data to be sent
            let surveyData = self.surveyFormData;

            self.loader.show();

            self._submitSurveyData(surveyData);
        });

        // Survey Restart
        $(document).on('click', 'a#survey-restart', function (event) {
            event.preventDefault();

            // Clear URL params
            window.history.pushState(null, null, window.location.pathname);

            // Start Fresh
            window.location.reload();

        });

        // Steam Login
        $(document).on('steam_login_closed', function () {

            self.surveyFormData.steam_persona = self.SteamLink.steamData.steam_personaName;

            $('.steam_personaname').text(self.surveyFormData.steam_persona);
            $('.add_steam').addClass('hidden');
            $('.disconnect_steam').removeClass('hidden');
            $('.btn--save').removeClass('hidden');
            $('.btn--skip').addClass('hidden');
        });

        // Steam Disconnect
        $(document).on('click', '.js-steam_delete', function () {

            self.surveyFormData.steam_persona = "";

            $('.steam_personaname').text('');
            $('.disconnect_steam').addClass('hidden');
            $('.add_steam').removeClass('hidden');
            $('.btn--skip').removeClass('hidden');
            $('.btn--save').addClass('hidden');
        });

        // Survey Back
        $(document).on('click', '.insider_survey .btn--back', function (event) {
            event.preventDefault();

            // Clear Current Errors
            $('.error_msg').empty();

            // go to the prev index
            self._accordionControl('back');
        });

    }

    _qt_nda(question) {

        let self = this;

        let pass = true;

        let requiredFields = $('#' + question + ' input[type=checkbox].required');

        $.each(requiredFields, function (index, field) {
            if (!$(field).prop('checked')) {
                pass = false;
            } else {
                self.surveyFormData[$(field).data('q_value')] = "agree";
            }
        });

        if (pass) {
            // Remove any errors before progressing
            $('.error_msg').empty();
            $(requiredFields).prop('disabled', true);
            self._accordionControl('next');
        } else {
            self._surveyError('Please agree to the terms below', question);
        }

    }

    _qt_beta_prefs(question) {

        let self = this;

        var surveyQuestionAnswers = {};

        $('#' + question + ' input[type=checkbox]').each(function () {

            // Set Value of all contact preferences
            surveyQuestionAnswers[$(this).data('answer')] = $(this).prop("checked") ? 1 : 0;

        });

        self.surveyFormData["beta_prefs"] = surveyQuestionAnswers;

        self._accordionControl('next');

    }

    _qt_contact_prefs(question) {

        let self = this;

        var surveyQuestionAnswers = {};

        let country = $('#pref_country').val();
        let countryValid = false;
        let email = $('input#pref_email').val();
        let emailValid = self._validateEmail(email);

        /* ensure country is checked first */
        if (country != 'instruct') {
            countryValid = true;
            $('.error_msg').empty();
            console.log('country validation passed');
        } else {
            self._surveyError('Please select a country or region', question);
            console.log('country error should show');
        }

        /* then run email validations */
        if(countryValid && !emailValid) {
            self._surveyError('Please enter a valid email address', question);
        }

        if (countryValid && emailValid) {

            self.loader.show();

            $.ajax({
                type: "POST",
                dataType: "JSON",
                data: {
                    action: "checkExistingEmail",
                    pref_email: email,
                },
                url: window.wp_object.ajaxurl,
                success: function (response) {
                    // Check For Abuse
                    if(response.action === "abuse_check" && !response.success) {
                        window.location.href = response.redirect;
                    }
                    // Check if email is already taken and verified
                    if(response.action === "check_existing_email" && !response.success) {
                        self._surveyError(response.message, 'survey-submission');
                    } else {
                        $('.error_msg').empty();

                        $('#' + question + ' input[type=checkbox]').each(function () {
                                // Set Value of all contact preferences
                                surveyQuestionAnswers[$(this).data('answer')] = $(this).prop("checked") ? 1 : 0;
                            });

                            self.surveyFormData.pref_country = country;
                            self.surveyFormData["contact_prefs"] = surveyQuestionAnswers;
                            self.surveyFormData.pref_email = email;

                            self._accordionControl('next');
                    }

                    self.loader.hide();
                },
            });
        }
    }

    _qt_demographic(question) {

        let self = this;

        let surveyQuestionAnswers = [];
        let otherValid = true;

        $('#' + question + ' input[type=checkbox], #' + question + ' input[type=radio]').each(function () {

            // Check for answers which are checked
            if ($(this).prop("checked") === true) {

                // Get the survey question answer
                let surveyQuestionAnswer = $(this).data('answer');

                if (surveyQuestionAnswer === "other") {
                    let surveyQuestionAnswerTextInputID = $(this).parents('ul').find('#other');

                    surveyQuestionAnswer = $(surveyQuestionAnswerTextInputID).val();

                    // Make sure the "Other" value is not empty
                    if (surveyQuestionAnswer.length < 1) {
                        otherValid = false;
                    }

                    surveyQuestionAnswers.push({"other": surveyQuestionAnswer});

                } else {
                    surveyQuestionAnswers.push(surveyQuestionAnswer);
                }
            }
        });

        if (surveyQuestionAnswers.length > 0 && otherValid) {
            $('.error_msg').empty();
            self.surveyFormData.demographic[question] = surveyQuestionAnswers;
            self._accordionControl('next');
        } else if (!otherValid) {
            self._surveyError("The other field cannot be empty.", question);
        } else {
            self._surveyError('You must choose at least one.', question);
        }

    }

    _qt_checkboxGroup(question) {
        let self = this;

        let surveyQuestionAnswers = [];
        let otherValid = true;

        $('#' + question + ' input[type=checkbox], #' + question + ' input[type=radio]').each(function () {

            // Check for answers which are checked
            if ($(this).prop("checked") === true) {

                // Get the survey question answer
                let surveyQuestionAnswer = $(this).data('answer');

                if (surveyQuestionAnswer === "other") {
                    let surveyQuestionAnswerTextInputID = $(this).parents('ul').find('#other');

                    surveyQuestionAnswer = $(surveyQuestionAnswerTextInputID).val();

                    // Make sure the "Other" value is not empty
                    if (surveyQuestionAnswer.length < 1) {
                        otherValid = false;
                    }

                    surveyQuestionAnswers.push({"other": surveyQuestionAnswer});

                } else {
                    surveyQuestionAnswers.push(surveyQuestionAnswer);
                }
            }
        });

        if (surveyQuestionAnswers.length > 0 && otherValid) {
            $('.error_msg').empty();
            self.surveyFormData["survey_data"][question] = surveyQuestionAnswers;
            self._accordionControl('next');
        } else if (!otherValid) {
            self._surveyError("The other field cannot be empty.", question);
        } else {
            self._surveyError('You must choose at least one.', question);
        }

    }

    _surveyControl() {

        let self = this;

        // Get the url param value
        let action = self.surveyFormData.action;

        // Clear the URL Params
        window.history.pushState(null, null, window.location.pathname);

        // Steam Link
        if (action === "login_steam") {
            window.close();
        }

    }

    _processUrlParams() {

        let self = this;

        var urlParams = [
            "invite_token",
            "success",
            "action",
        ];

        let paramValue = null;

        $.each(urlParams, function (i, val) {

            // will return false if it doesn't exist
            paramValue = unescape(decodeURIComponent(self._getQueryVariable(val)));

            if (paramValue != "false") {

                if(val === "invite_token"){
                    self._setInviteToken(paramValue);
                } else {
                    self.surveyFormData[val] = paramValue;
                }

            }

        });

        self._surveyControl();

    }

    _setInviteToken(paramValue){

        let d = new Date();
        // 15 minutes expiration
        d.setTime(d.getTime() + (15 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = "invite_token" + "=" + paramValue + ";" + expires + ";path=/";

        return null;

    }

    _checkInviteToken(){

        let self = this;

        let all_the_cookies = document.cookie;

        // Get all the cookies pairs in an array
        let cookie_jar_arr = all_the_cookies.split('; ');

        // Now take key value pair out of this array
        for (let i = 0; i < cookie_jar_arr.length; i++) {
            let cookie_name = cookie_jar_arr[i].split('=')[0];
            let cookie_value = cookie_jar_arr[i].split('=')[1];

            if (cookie_name === "invite_token") {
                self.surveyFormData["invite_token"] = cookie_value;
            }

        }

        return null;
    }

    _save_pc_specs() {

        let self = this;

        // Create pc_specs node
        self.surveyFormData.pc_specs = {};

        // Get object nodes
        let systemInformation = self.surveyFormData.DxDiag.SystemInformation;
        let displayDevices = self.surveyFormData.DxDiag.DisplayDevices;

        // Operating System
        if (systemInformation.OperatingSystem) {
            self.surveyFormData.pc_specs.OperatingSystem = systemInformation.OperatingSystem;
        }

        // Memory
        if (systemInformation.Memory) {
            self.surveyFormData.pc_specs.Memory = systemInformation.Memory;
        }

        // Processor
        if (systemInformation.Processor) {
            self.surveyFormData.pc_specs.Processor = systemInformation.Processor;
        }

        // Display Devices
        if (displayDevices) {
            self.surveyFormData.pc_specs.DisplayDevices = displayDevices;
        }

        // Machine ID
        if (systemInformation.MachineId) {
            self.surveyFormData.pc_specs.MachineId = systemInformation.MachineId;
        }

    }

    _getQueryVariable(variable) {

        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }

    _validateEmail(email) {
        var pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return $.trim(email).match(pattern) ? true : false;
    }

    _survey_sumarize() {
        let self = this;

        // Set Loop for question types
        let loop = this.surveyFormData.survey_data

        if (self.surveyFormData.hasOwnProperty('steam_persona') && self.surveyFormData.steam_persona.length) {
            $('.info_status .info_label.steam_id').empty().append(self.surveyFormData.steam_persona);
            $('.info_status .info_label.steam_id').removeClass('incomplete').addClass('complete');
            $('.status_section .steam_connect').hide();
        } else if ($('.info_status .info_label.steam_id').hasClass('complete')) {
            $('.info_status .info_label.steam_id').removeClass('complete').addClass('incomplete');
            $('.info_status .info_label.steam_id').text('Skipped');
        }
        if (JSON.stringify(self.surveyFormData.DxDiag).length > 2) {
            $('.info_status .info_label.dx_upload').empty().append('Verified');
            $('.info_status .info_label.dx_upload').removeClass('incomplete').addClass('complete');
        }

        // Clear for new
        $('.completion_list').empty();

        // Add Email to Contact Summary
        $('.pref_email_value').text(self.surveyFormData.pref_email);


        var q = 1;

        // Loop through contact prefs
        $.each(self.surveyFormData.contact_prefs, function (cp) {
            if ($("input[data-answer='" + cp + "']").prop('checked')) {
                let text = $("span[data-answer='" + cp + "']").html();
                $('.survey_question_confirm#ssq_' + q + ' .completion_list').append('<li>' + text + '</li>');
            }
        });
        // Loop through beta prefs
        $.each(self.surveyFormData.beta_prefs, function (cp) {
            if ($("input[data-answer='" + cp + "']").prop('checked')) {
                let text = $("span[data-answer='" + cp + "']").html();
                $('.survey_question_confirm#ssq_' + q + ' .completion_list').append('<li>' + text + '</li>');
            }
        });
        ++q;

        // Loop through questions
        $.each(loop, function (keys, values) {

            // Loop through multiple answers
            $.each(values, function (i, answer) {

                if (typeof answer === 'object') {
                    answer = answer.other;
                }

                if (Object.prototype.toString.call(answer) == '[object String]') {
                    answer = answer.replace(/<[^>]+>/g, '');
                }

                $('.survey_question_confirm#ssq_' + q + ' .completion_list').append('<li>' + answer + '</li>');

            });

            ++q;
        });

        // Loop through Demographics
        $.each(self.surveyFormData.demographic, function (keys, values) {

            // Loop through multiple answers
            $.each(values, function (i, answer) {

                if (typeof answer === 'object') {
                    answer = answer.other;
                }

                if (Object.prototype.toString.call(answer) == '[object String]') {
                    answer = answer.replace(/<[^>]+>/g, '');
                }

                $('.survey_question_confirm#ssq_' + q + ' .completion_list').append('<li>' + answer + '</li>');

            });

            ++q;
        });

    }

    _submitSurveyData(surveyData) {
        let self = this;

        surveyData['action'] = "createInsider";

        $.ajax({
            type: "POST",
            dataType: 'JSON',
            data: surveyData,
            url: window.wp_object.ajaxurl,
            error: function (response) {
                console.log('error: ' + JSON.stringify(response));
            },
            success: function (response) {

                if (response.success) {
                    // Wont respond to success unless json type
                    self.surveyFormData.survey_status.status = "complete";
                    if (window.wp_object.user_logged_in.status) {
                        window.location.href = '/profile/?signup=true';
                    } else {
                        window.location.href = 'https://auth.ageofempires.com/';
                    }
                } else {
                    self.loader.hide();

                    $('.question.cordian').css('display', 'none');
                    // Open Last Section
                    $('.question.cordian').last().css('display', 'block');
                    $('.question.cordian').last().addClass('sub_ac_open');
                    // Empty and Append Restart Button
                    $('.question.cordian').last().find('.insider_survey_summary').empty().append("Please <b><a id='survey-restart' href='#'>restart</a></b> the survey, or check our <b><a href='/insider-faq/'>FAQ</a></b> for more information.");
                    // Show Error
                    self._surveyError(response.message, 'survey-submission');
                }

            },
        });
    }

}