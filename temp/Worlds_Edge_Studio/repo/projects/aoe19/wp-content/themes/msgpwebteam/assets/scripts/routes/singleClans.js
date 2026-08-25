
import config from '../config';
import ClansPlayersList from '../component/ClansPlayersList';
import ClansAction from '../component/ClansAction';
import ClansFlag from '../component/ClansFlag';
import ProgressAnim from '../component/ProgressAnim';
import FieldKit from '../component/FieldKit';

export default {
  init() {

    this.ui = {
      members    : $('#clans-members-list'),
      applicants : $('#clans-applicants-list'),
      blocked    : $('#clans-blocked-list'),
      progressCircles : $('.progress-circle'),
      motdText   : $('.new_motd_text'),
      saveMotd   : $('#save_motd'),
    };
    
    this.options = {
      contentValid : true,
    }

    // All API property names.
    // This is used so we don't have to update every line of the filters/results JS if the API names change.
    // We just have to update these values.
    this.apiPropNames = {
      term           : 'q',
      sortCategory   : 'sort',
      startIndex     : 'paged',
      countMax       : 'postsPerPage',
      total          : 'totalCount',
      results        : 'playersList',
      playerId       : 'playerId',
      playerStatus   : 'playerStatus',
      clanId         : 'clanId',
      role           : 'role',
      responseStatus : 'success',
      responseError  : 'reason',
      promoteMember  : 'promote-member',
      promoteOfficer : 'promote-officer',
      demote         : 'demote',
      kick           : 'kick',
      block          : 'block',
      unblock        : 'unblock',
      approve        : 'approve',
      deny           : 'deny',
      save           : 'save_motd',
      message        : 'message',
      refresh        : 'refresh',
      deleteClan     : 'delete-clan',
      leave          : 'leave-member-officer',
      // leaveFounder   : 'leave-founder',
      join           : 'join',
      apply          : 'apply',
      cancelApply    : 'cancel-apply',
      flag           : 'flag',
    };

    if (this.ui.progressCircles.length) {
      this.ui.progressCircles.each((i, el) => {
        new ProgressAnim($(el), {
          selectorBar       : null,
          selectorNumber    : '.progress-circle__number',
          isBar             : false,
        });
      });
    }

    this._initLists();
    this._initActions();
    this._addEventListeners();
    FieldKit.prototype.characterCount();
  },

  _addEventListeners(){
    // Daily Message
    this.ui.motdText.on('keyup', () => {
      FieldKit.prototype.characterCount();
      FieldKit.prototype.checkContent(this.ui.motdText,this);
    });
    
  },
  
  _initLists() {
    if (this.ui.members.length) {
      new ClansPlayersList(this.ui.members, {
        apiUrlList             : config.api.clansMembersList,
        apiPropNames           : this.apiPropNames,
        selectorToolip         : '#clans-members-list .tooltip-menu',
        selectorPromoteOfficer : '#confirm-promote-officer',
      });
    }

    if (this.ui.applicants.length) {
      new ClansPlayersList(this.ui.applicants, {
        apiUrlList             : config.api.clansApplicantsList,
        apiPropNames           : this.apiPropNames,
        selectorToolip         : '#clans-applicants-list .tooltip-menu',
      });
    }

    if (this.ui.blocked.length) {
      new ClansPlayersList(this.ui.blocked, {
        apiUrlList             : config.api.clansBlockedList,
        apiPropNames           : this.apiPropNames,
        selectorToolip         : '#clans-blocked-list .tooltip-menu',
      });
    }
  },

  _initActions() {
    new ClansFlag({
      apiUrl                 : config.api.clansAction,
      apiPropNames           : this.apiPropNames,
      selectorTrigger        : '#flag-clan-confirm',
      selectorErrorModal     : '#flag-clan-error',
      selectorErrorModalMsg  : '#flag-clan-error__msg',
    });

    new ClansAction({
      apiUrl                 : config.api.clansAction,
      apiPropNames           : this.apiPropNames,
      selectorTrigger        : '#delete-clan-confirm',
      selectorErrorModal     : '#delete-clan-error',
      selectorErrorModalMsg  : '#delete-clan-error__msg',
    });

    new ClansAction({
      apiUrl                 : config.api.clansAction,
      apiPropNames           : this.apiPropNames,
      selectorTrigger        : '#leave-clan-confirm',
      selectorErrorModal     : '#leave-clan-error',
      selectorErrorModalMsg  : '#leave-clan-error__msg',
    });

    new ClansAction({
      apiUrl                 : config.api.clansAction,
      apiPropNames           : this.apiPropNames,
      selectorTrigger        : '#claim-clan-confirm',
      selectorErrorModal     : '#claim-clan-error',
      selectorErrorModalMsg  : '#claim-clan-error__msg',
    });

    new ClansAction({
      apiUrl                 : config.api.clansAction,
      apiPropNames           : this.apiPropNames,
      selectorTrigger        : '#join-clan-confirm',
      selectorErrorModal     : '#join-clan-error',
      selectorErrorModalMsg  : '#join-clan-error__msg',
    });

    new ClansAction({
      apiUrl                 : config.api.clansAction,
      apiPropNames           : this.apiPropNames,
      selectorTrigger        : '#apply-clan-confirm',
      selectorErrorModal     : '#apply-clan-error',
      selectorErrorModalMsg  : '#apply-clan-error__msg',
    });

    new ClansAction({
      apiUrl                 : config.api.clansAction,
      apiPropNames           : this.apiPropNames,
      selectorTrigger        : '#cancel-apply-confirm',
      selectorErrorModal     : '#cancel-apply-error',
      selectorErrorModalMsg  : '#cancel-apply-error__msg',
    });
    
    new ClansAction({
      apiUrl                 : config.api.clansAction,
      apiPropNames           : this.apiPropNames,
      selectorTrigger        : '#save_motd',
      selectorErrorModal     : '#save-motd-error',
      selectorErrorModalMsg  : '#save-motd-error__msg',
    });
    
    new ClansAction({
      apiUrl                 : config.api.clansAction,
      apiPropNames           : this.apiPropNames,
      selectorTrigger        : '#refresh',
      selectorErrorModal     : '#refresh-error',
      selectorErrorModalMsg  : '#refresh-error__msg',
    });
  },
};
