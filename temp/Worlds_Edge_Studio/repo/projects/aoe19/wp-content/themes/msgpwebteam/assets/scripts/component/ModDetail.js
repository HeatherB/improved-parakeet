import config from '../config';
import ajaxPost from '../util/ajaxPost';
import Expander from '../component/Expander';
import Loading from '../component/Loading';
import modDetailBanner from '../templates/modDetailBanner.html';
import modDetailTop from '../templates/modDetailTop.html';
import modDetailSidebar from '../templates/modDetailSidebar.html';
import modDetailBottom from '../templates/modDetailBottom.html';
import errorMessage from '../templates/modErrorMessage.html';
import ajaxGet from "../util/ajaxGet";


export default class ModDetail {
  constructor() {
    this.init();
  }

  init() {
    this.modId = window.wp_object.modId || null;

    this.ui = {
      $detailBanner: $('#mod-detail-banner'),
      $detailTop: $('#mod-detail-top'),
      $detailSidebar: $('#mod-detail-sidebar'),
      $detailBottom: $('#mod-detail-bottom'),
      $main: $('#mod-detail-main'),
      $flagModal: $('.modal#modFlag'),
      buttonToggleClass: '.btn-aoe--alt',
    };

    this.defaults = {
      modName: null, //str
      gameTitleId: null, //num 
      gameTitleName: null, //str
      gameVersion: null, //str
      modType: null, //str
      modTypeId: null, //num
      modStatus: null, //str
      modStatusId: null, //num
      modStatusMessage: null, //str
      description: null, //str/html
      changeList: null, //str/html
      imageUrls: null, //arr of objs
      metaData: null, //obj
      };

      this.defaultsV4 = {
          modName: null, //str
          gameTitleId: null, //num 
          gameTitleName: null, //str
          verifiedVersion: null, //str
          modType: null, //str
          modTypeId: null, //num
          modStatus: null, //str
          modStatusId: null, //num
          modStatusMessage: null, //str
          description: null,
          modDescription: null, //str/html
          changeList: null, //str/html
          imageUrls: null, //arr of objs
          creatorName: null, //obj
          createDate: null,
          lastUpdate: null,
          updateAvailable: null,
          modFileSize: null,
          modDiskSize: null,
          downloads: null,
          installs: null,
          likes: null,
          ratings: null,
          currentRating: null,
          userDownloaded: null,
          userLiked: null,
          userInstalled: null,
          userFlagged: null,
          thumbnail: null,
          metaData: null,
      };

    this.params = {
      modid: this.modId,
    };

    this.detailLoader = new Loading({
      // container: this.ui.$main,
    });

    this._fetchModData();
    this._events();

  }

  _modObject(mod) {
    let xhr = ajaxGet({
      url: window.wp_object.ajaxurl,
      data: {
        action: "mod_object",
        mod_id: mod.modId,
        mod_title: mod.modName,
        security: window.wp_object.ajax_nonce,
      },
    });

    Promise.resolve(xhr).then((response) => {
      if (response) {
        // Set the POST ID to MOD Object ID
        window.wp_object.post_ID = response;
      } else {
        this._error();
      }

      this.detailLoader.hide();
    }).catch(() => {
      this._error();
      this.detailLoader.hide();
    });
  }

  _fetchModData() {
    let self = this;
    this.detailLoader.show();

    let url = config.api.modsDetail;

    let success = false;
    let xhr = ajaxPost({
      url: url,
      data: JSON.stringify(this.params),
      statusCode: {
        401: function () {
          $('#sign-in-steam').foundation('open');
        },
        404: function () {
            success = false;
             //self._error('Mod Not Found. Try searching again or try back in a bit.');              
        },
      },
    });
    
    Promise.resolve(xhr).then((response) => {
        if (response) {
            success = true;
            this._modObject(response.metaData);
            this._renderModDetails(response);
            this.detailLoader.hide();
        }        
    }).catch(() => {
      if (!success) {
        let xhr2 = ajaxGet({
          url: config.apiV4.modsDetail + self.params.modid,
          statusCode: {
              401: function () {
                  $('#sign-in-steam').foundation('open');
              },
              404: function () {
                  self._error('Mod Not Found. Try searching again or try back in a bit.');
              },
          },
        });
        Promise.resolve(xhr2).then((response) => {
            if (response) {                  
                if (response.gameTitleId == 4) {
                    this._modObject({
                        modId: response.modId,
                        modName: response.modName,
                    });
                } else {
                    this._modObject(response.metaData);
                }
                this._renderModDetails(response);
                this.detailLoader.hide();
            } else {
                this._error();
            }
        }).catch(() => {
            this._error();
        });
      }
    });    
  }

    _renderModDetails(response) {
        if (response.gameTitleId == 4) {
            this.modDetails = Object.assign(this.defaultsV4, response);
            this.modDetails.metaData = Object.assign(this.defaultsV4, response);
            this.modDetails.description = this.modDetails.modDescription;
        } else {
            this.modDetails = Object.assign(this.defaults, response);
        }        
        this.ui.$detailBanner.html(modDetailBanner(this.modDetails));
        this.ui.$detailTop.html(modDetailTop(this.modDetails));
        this.ui.$detailSidebar.html(modDetailSidebar(this.modDetails));
        this.ui.$detailBottom.html(modDetailBottom(this.modDetails));
    document.title = "Age of Empires - Mods - " + this.modDetails.modName;
    //init widgets
    if (this.modDetails.imageUrls.length > 1) {
      this.ui.$detailTop.foundation();
    }
    if (this.modDetails.description) {
      new Expander($('#mod-description-expander'));
    }
    if (this.modDetails.changeList) {
      new Expander($('#mod-change-list-expander'));
    }
    this._handleDownloadBtns();
    this._handleInstallBtns();
    this._handleLikeBtns();
    this._handleFlagBtns();
  }

  _handleDownloadBtns() {

    let $btnDownload = this.ui.$detailSidebar.find('[data-button-download]');

    let toggleBtnDisplay = () => {
      if (this.modDetails.metaData.downloads) {
        $btnDownload.addClass(this.ui.buttonToggleClass);
      } else {
        $btnDownload.removeClass(this.ui.buttonToggleClass);
      }
    }

    let postDownloadState = () => {
      let params = {
        id: this.modId,
        boolValue: true, //always true, cannot un-download
      };

      let xhr = ajaxPost({
        url: config.api.modsDownload,
        data: JSON.stringify(params),
      });

      Promise.resolve(xhr).then((response) => {
        if (response) {
          this.modDetails.metaData.userDownloaded = true;            
          this.modDetails.metaData.downloads = response.value.downloadCount;
          // resultValue returns a url, not a number of downloads
          // download stats not available in response
          $('.stat-downloads').html(this.modDetails.metaData.downloads);
          // resultValue returns a url, open url in new window to download mod
          window.open(response.value.downloadUrl);
          toggleBtnDisplay();
        } else {
          this._error();
        }
      }).catch(() => {
        this._error();
      });
    };

    $btnDownload.on('click', (event) => {
      event.preventDefault();
      postDownloadState();
    });

    toggleBtnDisplay();
  }

  _handleInstallBtns() {
    let $btnUninstall = this.ui.$detailSidebar.find('[data-button-uninstall]');
    let $btnInstall = this.ui.$detailSidebar.find('[data-button-install]');

    let toggleBtnDisplay = () => {
      if (this.modDetails.metaData.userInstalled) {
        $btnInstall.hide();
        $btnUninstall.show();
      } else {
        $btnInstall.show();
        $btnUninstall.hide();
      }
    };

    let postInstalledState = (boolValue = true) => {
      let params = {
        id: this.modId,
        boolValue: boolValue,
      };

      let xhr = ajaxPost({
        url: config.api.modsInstall,
        data: JSON.stringify(params),
      });

      Promise.resolve(xhr).then((response) => {
        this.modDetails.metaData.userInstalled = boolValue;
        this.modDetails.metaData.downloads = response.value.installCount;
        $('.stat-downloads').html(this.modDetails.metaData.downloads);
        toggleBtnDisplay();
      });
    };

    let postUninstallState = (boolValue = true) => {
      let params = {
        id: this.modId,
        boolValue: boolValue,
      };

      let xhr = ajaxPost({
        url: config.api.modsUninstall,
        data: JSON.stringify(params),
      });

      Promise.resolve(xhr).then((response) => {
          this.modDetails.metaData.userInstalled = false;
          this.modDetails.metaData.downloads = response.value.installCount;
          $('.stat-downloads').html(this.modDetails.metaData.downloads);
        toggleBtnDisplay();
      });
    };

    $btnInstall.on('click', (event) => {
      event.preventDefault();
      postInstalledState(true);
    });

    $btnUninstall.on('click', (event) => {
      event.preventDefault();
      postUninstallState(true);
    });

    toggleBtnDisplay();
  }

  _handleLikeBtns() {
    let $btnLike = this.ui.$detailSidebar.find('[data-button-like]');
    let $btnUserLiked = this.ui.$detailSidebar.find('[data-button-user-liked]');
    let $statLikes = this.ui.$detailSidebar.find('.stat-likes');

    let toggleBtnDisplay = () => {
      if (this.modDetails.metaData.userLiked) {
        $btnLike.hide();
        $btnUserLiked.show();
      } else {
        $btnLike.show();
        $btnUserLiked.hide();
      }
    };

    let postLikedState = (boolValue = true) => {
      let params = {
        id: this.modId,
        boolValue: boolValue,
      };

      let xhr = ajaxPost({
        url: config.api.modsLike,
        data: JSON.stringify(params),
      });

      Promise.resolve(xhr).then((response) => {
        this.modDetails.metaData.userLiked = boolValue;
        this.modDetails.metaData.likes = response.resultValue;
        $statLikes.html(this.modDetails.metaData.likes);
        toggleBtnDisplay();
      });
    };

    $btnLike.on('click', (event) => {
      event.preventDefault();
      postLikedState(true);
    });

    $btnUserLiked.on('click', (event) => {
      event.preventDefault();
      postLikedState(false);
    });

    toggleBtnDisplay();
  }

  _handleFlagBtns() {
    let $btnOpener = this.ui.$detailSidebar.find('.js-modal-opener');
    let $btnFlag = this.ui.$flagModal.find('[data-button-flag]');
    let $btnUserFlagged = this.ui.$detailSidebar.find('[data-button-user-flagged]');
    let $flagModal = this.ui.$flagModal;

    let toggleBtnDisplay = () => {
      if (this.modDetails.metaData.userFlagged) {
        $btnOpener.hide();
        $btnUserFlagged.show();
      } else {
        $btnOpener.show();
        $btnUserFlagged.hide();
      }
    };

    let formError = (error) => {
      $('.flag-reason .error_msg').empty().append('<p>' + error + '</p>');
    }

    let getReason = () => {
      let otherValid = true;
      let answer = [];

      $('input[name=Reasons]').each(function () {

        // Check for answers which are checked
        if ($(this).prop("checked") === true) {

          if ($(this).data('answer') === "other") {
            let $otherInput = $(this).parents('ul').find('#other');

            let otherVal = $otherInput.val();

            // Make sure the "Other" value is not empty
            if (otherVal.length < 1) {
              otherValid = false;
            }

            answer.push("Other: " + otherVal);
          } else {
            answer.push($(this).data('answer'));
          }
        }
      });

      if (!otherValid) {
        formError("The other field cannot be empty.");
        return false;
      } else if (answer.length > 0) {
        $('.error_msg').empty();
        return answer.join(', ');
      } else {
        formError('You must choose at least one.');
        return false;
      }
    }


    let postFlaggedState = (boolValue = true) => {
      let self = this;
      let stringValue = getReason();

      // post data
      if (stringValue) {
        let params = {
          id: this.modId,
          boolValue: boolValue,
          stringValue: stringValue,
        };
        let xhr = ajaxPost({
          url: config.api.modsFlag,
          data: JSON.stringify(params),
        });

        Promise.resolve(xhr).then((response) => {
          this.modDetails.metaData.userFlagged = boolValue;
          if (response.resultValue === 'true') {
            toggleBtnDisplay();
            $flagModal.foundation('close');
          } else {
            self._error();
          }
        });
      }
    };

    $btnOpener.click(function () {
      $flagModal.foundation('open');
    });

    $btnFlag.on('click', (event) => {
      event.preventDefault();
      postFlaggedState();
    });

    $btnUserFlagged.on('click', (event) => {
      event.preventDefault();
      postFlaggedState(false);
    });

    toggleBtnDisplay();
  }

  _events() {
    let modsAddress = '/mods';
    // Activate Other Input Box
    $(document).on('click ready load', "input[data-answer='other']", function () {
      if ($(this).prop('checked')) {
        $(this).parents('ul').find('input[type=text]').prop('disabled', false);
      } else {
        $(this).parents('ul').find('input[type=text]').prop('disabled', true);
      }
    });

    $(document).on('click', "#mod-detail-banner .button--round-back-btn", function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (document.referrer.indexOf(modsAddress) > -1) {
        window.history.go(-1);
      } else {
        window.location.href = '/mods';
      }
    });
  }

  _error(message) {
    let modsErrorObj = {
      message: 'Something has gone wrong. Please try again later.',
    };

    if (message) {
      modsErrorObj.message = message;
      this.errorMessage = modsErrorObj;
    } else if (this.errorMessage === undefined) {
      this.errorMessage = modsErrorObj;
    }
    this.ui.$main.html(errorMessage(this.errorMessage));
    this.detailLoader.hide();
  }
}
