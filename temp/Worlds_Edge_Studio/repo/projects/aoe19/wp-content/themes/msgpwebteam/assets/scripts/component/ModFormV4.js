import Foundation from 'foundation';
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/paste';
import Dropzone from 'dropzone';
import 'jquery-ui/ui/widgets/sortable';
import modForm from '../templates/modForm.html';
import modFormFile from '../templates/modFormFile.html';
import ajaxGet from '../util/ajaxGet';
import ajaxPost from '../util/ajaxPost';
import config from '../config';
import Loading from '../component/Loading';
import _ from 'underscore';
import SelectPure from "select-pure";

export default class ModForm {
  constructor($container, objOptions = {}) {
    this.init($container, objOptions);
  }

  /**
   * Initialize the mod form
   * @param  {Object} $container jQuery object containing DOM element form will be contained in
   * @param  {Object} objOptions Form options a user wants to customize
   */
  init($container, objOptions) {
    this.modId = window.wp_object.modId || null;
    this.dropzoneImages = null;
    this.dropzoneMod = null;
    this.disableUpload = config.hasTouch && !Foundation.MediaQuery.atLeast('medium') ? true : false;
    this.tagSelector = null;
    // set options
    this.options = Object.assign({
      retryCount      : 0,
      maxImages       : 5,
      maxImageSize    : 8, // MB
      imageMimeTypes  : 'image/jpeg,image/png,image/gif',
      maxFiles        : 1,
      maxFileSize     : 550, // MB
      fileMimeTypes   : '.zip,.sga',
      gameData        : null,
      modTypes        : null,
      modTags         : null,
      modDetails      : null,
    }, objOptions);

    // set ui elements
    this.ui = {
      $formContainer: $container,
      $form: null,
      $inputTitle: null,
      $selectGame: null,
      $selectType: null,
      $selectVisiblity: null,
      $checkboxGameVersion: null,
      $textareaDesc: null,
      $btnCancel: null,
    };

    // create loader instance
    this.loader = new Loading({
      container: this.ui.$formContainer,
    });

    // require tinymce dependencies
    require.context(
      'file?limit=1&name=vendor/tinymce/[path][name].[ext]&context=node_modules/tinymce!tinymce/skins',
      true,
      /\.*$/
    );

    // load data for form
    this._getModData();
  }

  /**
   * Get various data needed to display the mod create/edit form
   */
  _getModData() {
    let xhrs = [
      ajaxGet({ url: config.apiV4.games }), // get mod types for select input
      ajaxGet({ url: config.apiV4.modsTypes }), // get mod types for select input
      ajaxGet({ url: config.apiV4.modsTags }), // get mod tags for select input
    ];     

    // get mod data if we're in edit mode
    if (this.modId) {
      xhrs.push(ajaxPost({
        url: config.apiV4.modsDetail,
        data: JSON.stringify({
          modid: this.modId,
        }),
      }));
    }

    this.loader.show();
    Promise.all(xhrs).then((response) => {          
      if ((response.length === 3 && !this.modId) || (response.length === 4 && this.modId)) {
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
      this.options.retryCount ++;
      this._getModData();
    } else {
      console.warn('ERROR!', err);
    }
  }

  /**
   * Render the form based on the API response
   * @param  {Object} response Reponse object from API requests containing game, mod types and mod details data.
   */
  _render(response) {
    const formData = {
      modId: this.modId || null,
      title: null,
      gameTitleId: null,
      gameOutdated: null,
      modTypeId: null,
      games: null,
      modTypes: null,
      modTags: null,
      description: null,
      changeList: null,
      notifications: null,
      visibility: null,
      images: null, 
      disableUpload: this.disableUpload,
      formClass: this.modId ? 'mods-form--edit' : 'mods-form--create',
      modStatusId: null,
      modStatusMessage: null,
    };

    let $gameId = 1;
    if (this.ui.$selectGame && this.ui.$selectGame.children("option:selected")) {
      $gameId = this.ui.$selectGame.children("option:selected").val();
    }
      response[1] = $(response[1]).filter(function () { return $(this)[0].gameTitleId == $gameId; }).remove(); 
      response[2] = $(response[2]).filter(function () { return $(this)[0].gameTitleId == $gameId; }).remove().get(); 

    this.options.gameData = response[0];
    this.options.modTypes = response[1];
    this.options.modTags = response[2];
    if (response.length === 4) {
        this.options.modDetails = response[3];
    }
    if (this.modId != null && this.options.modDetails.metaData != null && this.options.modDetails.metaData.isOwner == false) {
      location.href = '/mods/details/' + this.modId;
      return;
    }
    // set form data values
    if (this.options.gameData) {
      formData.games = this.options.gameData;
    }
    if (this.options.modTypes) {
      formData.modTypes = this.options.modTypes;
    }
        
    if (this.options.modDetails) {
      formData.title = this.options.modDetails.modName;
      formData.gameTitleId = this.options.modDetails.gameTitleId;
      formData.gameTitleName = _.findWhere(this.options.gameData, {gameTitleId: parseInt(this.options.modDetails.gameTitleId)}).gameTitleName;
      //formData.gameOutdated = (this.options.modDetails.metaData.verifiedVersion !== _.findWhere(this.options.gameData, {gameTitleId: parseInt(this.options.modDetails.gameTitleId)}).gameVersion) ? true : false;
      
      formData.modTypeId = this.options.modDetails.modTypeId;        
      if (this.options.modDetails.modTags) {
        formData.modTagIds = this.options.modDetails.modTags.map(String);
      }
      formData.description = this.options.modDetails.description;
      formData.changeList = this.options.modDetails.changeList;
      
      //formData.notifications = this.options.modDetails.acceptNotifications;
      formData.images = this.options.modDetails.imageUrls;
      formData.modStatusId = this.options.modDetails.modStatusId;
      formData.modStatusMessage = this.options.modDetails.modStatusMessage;
    }
    // render the form and init foundation again
    this.ui.$formContainer.html(modForm(formData)).foundation();
    
    // set ui vars based on updated ui
    this.ui.$form = $('#mod-form');
    this.ui.$errorMessage = $('#mod-error');
    this.ui.$inputTitle = $('#mod-name');
    this.ui.$selectGame = $('#mod-game');
    this.ui.$selectType = $('#mod-type');    
    //this.ui.$checkboxGameVersion = $('#mod-game-version');
    this.ui.$textareaDesc = $('#mod-description');
    this.ui.$btnCancel = $('#form-cancel');
    // update game version display
    //this._updateGameVersion();
    if (this.options.modTags) {
      this.tagSelector = new SelectPure(".mod-tags", {
        options: this.options.modTags.map(this._map_options),
        value: formData.modTagIds || [],
        multiple: true,
        icon: "fa fa-times",
        autocomplete: true,
      });
    }
    if (this.options.modDetails) {
      let self = this;
      $('#mod-visibility option').filter(function () { return $(this).html() == self.options.modDetails.metaData.modVisibility; }).attr("selected", "selected");
    }
    // init wisywig editors
    //this._initTinyMCE('#mod-description');
    //this._initTinyMCE('#mod-change-list');
    // init file drop zone areas
    this._initDropzones(formData.images);
    this._initSortable();
    // listen for form events
    this._addEventListeners();
  }

  /**
   * Add event listeners to dom elements
   */
  _addEventListeners() {
    this.ui.$form.on('submit', (e) => {
      e.preventDefault();
      if (this._isValid()) {
        this._submitForm();
      }
    });

    this.ui.$selectGame.on('change', () => {
     this._updateModTypes();
    });

    this.ui.$btnCancel.on('click', () => {
      this._cancel();
    });

    this.ui.$form .on('click', '[data-sort-up]', (e) => {
      this._sortImage($(e.currentTarget), 'up');
    });

    this.ui.$form .on('click', '[data-sort-down]', (e) => {
      this._sortImage($(e.currentTarget), 'down');
    });
  }

    _updateModTypes(selectOption) {
        let self = this;
        let $gameId = 0;
        let $selectGame = $('#mod-game');
        let $selectType = $('#mod-type');
        if ($selectGame && $selectGame.children("option:selected")) {
            $gameId = $selectGame.children("option:selected").val();
        }
        if ($gameId > 0) {
            ajaxGet({ url: config.api.modsTypes }).done(function (data) {
                data = $(data).filter(function () { return $(this)[0].gameTitleId == $gameId; }).remove();
                $selectType.empty();
                $.each(data, function (idx, item) {
                    if (item.modTypeId == selectOption) {
                        $selectType.append('<option value="' + item.modTypeId + '" selected>' + item.modTypeName + '</option>');
                    }
                    else {
                        $selectType.append('<option value="' + item.modTypeId + '">' + item.modTypeName + '</option>');
                    }
                });
            });
            ajaxGet({ url: config.api.modsTags }).done(function (data) {
                $(".mod-tags").empty();
                data = $(data).filter(function () { return $(this)[0].gameTitleId == $gameId; }).remove().get();
                self.tagSelector = new SelectPure(".mod-tags", {
                    options: data.map(self._map_options),
                    value: [],
                    multiple: true,
                    icon: "fa fa-times",
                    autocomplete: true,
                });
            });
        }
  }

  /**
   * Update game version display inline within form
   */
  _updateGameVersion() {
    const selectedGameId = this.ui.$selectGame.val();
    const gameVersion = _.findWhere(this.options.gameData, {gameTitleId: parseInt(selectedGameId)});
    this.ui.$checkboxGameVersion.val(gameVersion.gameVersion);
    this.ui.$form.find('[data-game-version]').html(gameVersion.gameVersion);
    this.ui.$form.find('[data-game-name]').html(gameVersion.gameTitleName);
  }

  /**
   * Init TinyMCE editor
   * @param  {String} selector String element selector of tiny mce textarea target
   */
  _initTinyMCE(selector) {
    tinymce.init({
      selector: selector,
      theme: 'modern',
      height: 250,
      menubar: false,
      content: 'blah',
      convert_urls: false,
      skin_url: '/wp-content/themes/msgpwebteam/src/lib/Mods/skins/lightgray',
      plugins: [
        'lists link',
        'paste',
      ],
      toolbar1: 'formatselect | bold italic bullist link',
      paste_as_text: true,
      block_formats: 'Paragraph=p;Header 3=h3;Header 4=h4',
    });
  }

  /**
   * Setup file dropzones for images and mod files via Dropzone.js
   * More info: http://www.dropzonejs.com/
   */
  _initDropzones(existingImages) {
    let imageId = 1;
    // shared dropzone config
    const sharedSettings = {
      url: '#upload',
      uploadMultiple: true,
      autoProcessQueue: false,
      addRemoveLinks: false,
      previewTemplate: modFormFile(),
      init: function() {
        this.on('error', function(file){
          // remove file on error
          if (!file.accepted) this.removeFile(file);
        });
      },
    };
    // Image Dropzone
    this.dropzoneImages = new Dropzone("#dropzone-images", Object.assign({
      maxFiles: this.options.maxImages,
      maxFilesize: this.options.maxImageSize,
      acceptedFiles: 'image/*',
      dictDefaultMessage: 'Drop images here, or click to attach.',
      previewsContainer: '#dropzone-images-display',
      hiddenInputContainer: '#dropzone-images-hidden-input',
      thumbnailHeight: 180,
      thumbnailWidth: 320,
    }, sharedSettings));
    // track existing files that should be deleted
    this.dropzoneImages.filesToDelete = [];
    // add unique IDs to file items
    this.dropzoneImages.on('addedfile', (file) => {
      const fileId = `image-${imageId}`;
      const $el = $(file.previewElement);
      file.id = `image-${imageId}`;
      $el.attr('id', fileId);
      if (!file.size) {
        $el.addClass('no-size'); // add no-size class to elements already in db
      }
      imageId ++;
      this._sortDisplayUpdate();
    });
    // listen for removed files, if previously uploaded track their removal
    this.dropzoneImages.on('removedfile', (file) => {
      if (file.uploaded) {
        this.dropzoneImages.filesToDelete.push(file);
      }
      this._sortDisplayUpdate();
    });
    // add exisitng images if we have them    
    if (existingImages) {
      //console.table(existingImages);
      existingImages.forEach((existingImage) => {
        // cannot pass 'size' property because it tries to process thumbnails
        // user Dropzone.emit('thumbnail', x, x) instead
        let img = {
          uploaded: true, // used for tracking already uploaded files
          imageId: existingImage.imageId,
          imageName: existingImage.imageName.substring(0, existingImage.imageName.indexOf('?')),
          imageThumbnail: existingImage.imageThumbnail,
          name: /[^/]*$/.exec(existingImage.imageName.substring(0, existingImage.imageName.indexOf('?')))[0],
          accepted: false,
          serverID: 0,
          type: this.options.imageMimeTypes,
        };
        this.dropzoneImages.addFile(img);
        // process thumbnail manually
        this.dropzoneImages.emit('thumbnail', img, existingImage.imageThumbnail);
      });
    }
    // Mod Dropzone
    this.dropzoneMod = new Dropzone('#dropzone-mod', Object.assign({
      maxFiles: this.options.maxFiles,
      maxFilesize: this.options.maxFileSize,
      acceptedFiles: this.options.fileMimeTypes,
      dictDefaultMessage: 'Drop mod file here, or click to attach.',
      previewsContainer: '#dropzone-mod-display',
      hiddenInputContainer: '#dropzone-mod-hidden-input',
    }, sharedSettings));
    this.dropzoneMod.on('addedfile', (file) => {      
        if (file.size > 524288000) {
            this.ui.$form.addClass('error');
            this.ui.$errorMessage.html('Mod file exceeds the 500mb file size limit');
        } else {
            this.ui.$form.removeClass('error');
        }
    });
  }

  /**
   * Setup jQuery UI Sortable on image display
   */
  _initSortable() {
    $('#dropzone-images-display').sortable({
      axis: 'y',
      containment: '#images',
      items: '.dz-preview',
      opacity: 0.5,
    }).on('sortstop', () => {
      this._sortDisplayUpdate();
    });
  }

  /**
   * Check if form is valid
   * @return {Boolean} Return boolean representing if for is valid
   */
  _isValid() {
    let formIsValid = true;
    const requiredFields = {
      $title: this.ui.$inputTitle,
      $game: this.ui.$selectGame,
      $modType: this.ui.$selectType,
      $desc: this.ui.$textareaDesc,
    };
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
    var descBody = tinymce.get('mod-description').getBody(), descText = tinymce.trim(descBody.innerText || descBody.textContent);

    if (descText.length > 10000) {
      this.ui.$textareaDesc.parents('.form__item').addClass('error');
      formIsValid = false;
    }
    // only require game version checkbox on mod create
    //if (!this.modId && !this.ui.$checkboxGameVersion.is(':checked')) {
    //  this.ui.$checkboxGameVersion.parents('.mods-form__version').addClass('error');
    //  formIsValid = false;
    //} else {
    //  this.ui.$checkboxGameVersion.parents('.mods-form__version').removeClass('error');
    //}
    // check for required image files
    if (this.dropzoneImages.getAcceptedFiles().length === 0) {
      $('#dropzone-images').parents('.form__item').addClass('error');
      formIsValid = false;
    } else {
      $('#dropzone-images').parents('.form__item').removeClass('error');
    }
    // check for required mod files
    if (this.dropzoneMod.getAcceptedFiles().length === 0 && !this.modId) {
      $('#dropzone-mod').parents('.form__item').addClass('error');
      formIsValid = false;
    } else {
      $('#dropzone-mod').parents('.form__item').removeClass('error');
    }
    // return if form is valid or not
    return formIsValid;
  }

  /**
   * Gather and submit current form data
   */
  _submitForm() {
    let formData = new FormData(this.ui.$form[0]);
    let apiUrl = config.apiV4.modsPublish;
    // reset form
    this.ui.$form.removeClass('error');
    this.loader.show();
    //let selectedTags = [];
    //console.log('selected tags count: '+this.ui.$selectTags.length);
    $('#mod-tags i.fa.fa-times').map(function (index, item) {
      
      //console.log(item.getAttribute('data-value'));
      //selectedTags.push(parseInt(item.getAttribute('data-value')));
      formData.append('modTags', parseInt(item.getAttribute('data-value')));
    })
    //formData.append('modTags', JSON.stringify(selectedTags));
    // check game version, set to current if it isn't checked on edit
    //if (this.modId && !this.ui.$checkboxGameVersion.is(':checked')) {
    //  formData.append('GameVersion', this.options.modDetails.gameVersion);
    //}
    // get mod image data
    this.dropzoneImages.getAcceptedFiles().forEach((file) => {
      if (!file.uploaded) {
        formData.append('modImages', file); // only add new file data if file is not already uploaded
      }
    });
    // get mod file data
    //this.dropzoneMod.getAcceptedFiles().forEach((file) => {
      //formData.append('modFiles', file);
    //});
    // setup image meta data
    let imgMetaData = [];
    const sortArray = $('#dropzone-images-display').sortable('toArray');
    // get accepted files and create meta data
    this.dropzoneImages.getAcceptedFiles().forEach((file) => {
      imgMetaData.push({
        'imageId': file.imageId ? file.imageId : null,
        'displayIndex': sortArray.indexOf(file.id),
        'imageName': file.imageName ? file.imageName : file.name,
        'imageThumbnail': file.imageThumbnail ? file.imageThumbnail : '',
      });
    });
    // add deleted files to image meta data
    this.dropzoneImages.filesToDelete.forEach((file) => {
      imgMetaData.push({
        'imageId': file.imageId,
        'displayIndex': -1, // when set to -1, images will be marked for deletion
        'imageName': file.imageName,
        'imageThumbnail': file.imageThumbnail,
      });
    });
    formData.append("ImageMetaData", JSON.stringify(imgMetaData));
    // setup ajax request
    ajaxPost({
      url: apiUrl,
      data: formData,
      cache: false,
      contentType: false,
        processData: false,
        statusCode: {
            401: function () {
                $('#sign-in').foundation('open');
            },
        },
    }).then((response) => {
      if (response.resultKey && response.resultKey === 'ModId' && response.resultValue && response.resultValue !== '-1') {
        // valid response, redirect to created detail page
        //window.location.href = `/mods/details/${response.resultValue}/`;
          console.log(response.resultValue);
          this._submitFile(response.resultValue);
      } else {
        // error uploading mod
        this.ui.$form.addClass('error');
        this.ui.$errorMessage.html(response.errorMessage);
        this.loader.hide();
      }
    }).catch(() => {
      // error reaching api
      this.ui.$form.addClass('error');
      this.loader.hide();
    });
  }
    _submitFile(modId) {
        let modFile = null;
        this.dropzoneMod.getAcceptedFiles().forEach((file) => {
            modFile = file;
        });
        $.ajax(
            {
                type: 'PUT',
                url: config.apiV4.modsPublishFile + "?modId=" + modId + "&comp=block&blockid=" + modId,
                data: modFile,
                //dataType: 'json',
                contentType: 'application/octet-stream',
                cache: false,
                processData: false,
                xhrFields: {
                    withCredentials: true,
                },
            }
        ).then((response) => {
            if (response) {
                console.log(response);
                this._submitFileComplete(modId);
            } else {
                // error uploading mod
                this.ui.$form.addClass('error');
                this.ui.$errorMessage.html(response.errorMessage);
                this.loader.hide();
            }
        }).catch(() => {
            // error reaching api
            this.ui.$form.addClass('error');
            this.loader.hide();
        });
    }
    _submitFileComplete(modId) {
        $.ajax(
            {
                type: 'PUT',
                url: config.apiV4.modsPublishFile + "?modId=" + modId + "&comp=blocklist",
                data: '<?xml version="1.0" encoding="utf-8"?><BlockList><Latest>' + modId + '</Latest></BlockList>',
                ///dataType: 'jso',
                contentType: 'application/xml',
                cache: false,
                processData: false,
                xhrFields: {
                    withCredentials: true,
                },
            }
        ).then((response) => {
            if (response) {
                console.log(response);
                // valid response, redirect to created detail page
                window.location.href = `/mods/details/${modId}/`;
            } else {
                // error uploading mod
                this.ui.$form.addClass('error');
                this.ui.$errorMessage.html(response.errorMessage);
                this.loader.hide();
            }
        }).catch(() => {
            // error reaching api
            this.ui.$form.addClass('error');
            this.loader.hide();
        });
    }
  /**
   * Cancel the form editing and return to mods landing or details based on if we are creating or editing a mod
   */
  _cancel() {
    if (this.modId) {
      window.location.href = `/mods/details/${this.modId}/`;
    } else {
      window.location.href = '/mods/';
    }
  }

  /**
   * Sort images based on up/down arrows
   * @param  {Object} $el       jQuery element Object
   * @param  {String} direction String representing the direction, either 'up' or 'down'
   */
  _sortImage($el, direction) {
    const $preview = $el.parents('.dz-preview');
    const previewIndex = $preview.index();
    let $previews = $preview.parent().find('.dz-preview');
    const totalPreviews = $previews.length;
    if (direction === 'up') {
      // check if we can move the preview up
      if (previewIndex !== 0) {
        $($previews[previewIndex - 1]).before($preview);
      }
    } else {
      // check if we can move the preview down
      if (previewIndex !== totalPreviews - 1) {
        $($previews[previewIndex + 1]).after($preview);
      }
    }
    this._sortDisplayUpdate();
  }

  /**
   * Update the display of arrows in the sort listing
   */
  _sortDisplayUpdate() {
    const $previews = $('#dropzone-images-display .dz-preview');
    // disable arrows where needed
    $previews.each((index, element) => {
      const $el = $(element);
      const $sortUp = $el.find('[data-sort-up]');
      const $sortDown = $el.find('[data-sort-down]');
      // up arrow
      if (index === 0) {
        $sortUp.attr('disabled', 'disabled');
      } else {
        $sortUp.removeAttr('disabled', 'disabled');
      }
      // down arrow
      if (index === $previews.length - 1) {
        $sortDown.attr('disabled', 'disabled');
      } else {
        $sortDown.removeAttr('disabled');
      }
    });
  }

    _map_options(item, index) {
        return { label: item.modTypeName, value: item.modTypeId.toString() };
    }
}
