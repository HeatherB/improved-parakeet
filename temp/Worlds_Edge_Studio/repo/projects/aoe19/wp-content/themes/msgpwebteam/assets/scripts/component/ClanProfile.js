import config from "../config";
import Loading from './Loading';

export default class ClanProfile {
    constructor() {
        this.init();
    }
    init() {
        let self = this;
        this.profileClansForm = $('#profile-clans');
        this.clansProfile = $('.profile-clans');
        this.clansProfileForm = $('#clansProfileForm');
        this.save = $('.js-save');
        this.submitActor = null;
        this.$submitActors = $('.js-form').find('.js-button');
        this.clansLoader = new Loading({});
        this.$submitActors.on('click', function (e) {
            self.submitActor = $(this);
        })
        if(this.clansProfile.length > 0 ) {
            this._findClansProfile();
        }
        this.clansProfileForm.submit(function (e) {
            e.preventDefault();
            let skillLevel = $('#member-skill-level').val();
            let activityLevel = $('#member-activity-level').val();
            let apiUrl;
            let data;
            if(self.submitActor.attr('data-sub') == 'save') {
                apiUrl = config.api.clansMemberProfile;
                data = {
                    "profileAction":"updateMemberProfile",
                    "skillLevel": skillLevel,
                    "activityLevel": activityLevel,
                };
            } else {
                apiUrl = config.api.clansMemberProfile;
                data = $(this).serialize();
            }
            var profile = [self._clansMemberProfileUpdate(data, 'profile-clans', apiUrl)];
            self._ajaxPromise(profile);
        });
    }
    _ajaxPromise(cb,) {
        let self = this;
        self.clansLoader.show();
        $.when.apply($,cb)
            .done(function() {
                self.clansLoader.hide();
            });
    }
    _findClansProfile() {
        let skillLevel = $('#member-skill-level');
        let activityLevel = $('#member-activity-level');
        let data = {
          "profileAction":"getMemberProfile",
        };
        $.ajax({
            type: "POST",
            dataType: 'JSON',
            data: data,
            url: config.api.clansMemberProfile,
            success: function(response) {
              if(response.success){
                skillLevel.val(response.skillLevel);
                activityLevel.val(response.activityLevel);
              } else {
                console.log(response.reason);
              }
            },
        });
    }
    _clansMemberProfileUpdate(data, form, api = config.api.clansMemberProfile) {
        var self = this;
        return $.ajax({
            url: api,
            type: 'POST',
            data: data,
            success: function (response) {
                if(response['success'] == false){
                  $('#' + form + ' .clan-message').removeClass('success').addClass('error');
                  $('#' + form + ' .clan-message span').html('Saved');
                } else if(response['success'] == true){
                  $('#' + form + ' .clan-message').removeClass('error').addClass('success');
                  $('#' + form + ' .clan-message span').html('Saved');
                  $('#' + form)[0].reset();
                }
                if(response['reason']) {
                    $('#' + form + ' .clan-message span').html(response['reason']);
                }
            },
        });
    }
}