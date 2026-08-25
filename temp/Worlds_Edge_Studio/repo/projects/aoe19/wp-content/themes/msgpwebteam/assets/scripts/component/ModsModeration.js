import config from '../admin-config';
import ajaxPost from '../util/ajaxPost';

export default class ModsModerate {
   
    constructor() {      
        this.init();
    }

    init() {     

        this.ui = {
            $window: $(window),
            $filters: $('#mods-filters'),
            $paginav: $('#mods-paginav'),
            $listing: $('#mods-listing'),
            $delete_mod: $('.delete_mod'),
            delete_mod: '.delete_mod',
            $unflag_mod: $('.unflag_mod'),
            unflag_mod: '.unflag_mod',
            $get_details: $('.get_details'),
            get_details: '.get_details',
            $detail_output: $('.js-mod-detail-output'),
            $close_details: $('.js-modal-close'),
            $details_modal: $('.js-details-dialog'),
            $overlay: $('.js-overlay'),
            $loadingMessage: $('.js-loading-message'),
        };

        this._addEventListeners();
    }   

    _fetchModDetails(modId) {
        let url = config.api.modsFlaggedDetail;

        let data = {
            id: modId,
        };

        let xhr = ajaxPost({
            url: url,
            data: JSON.stringify(data),
        });

        Promise.resolve(xhr).then((response) => {
          this._renderModDetails(response);
        }).catch(() => {
          console.log("could not resolve request");
        });
    }

    _formatDate(string) {
        let split = string.split('-');
        let year = split[0];
        let month = split[1];
        let day = split[2].split('T')[0];

        return month + "/" + day + "/" + year;
    }
  
    _addEventListeners() {
        let self = this;
        this.ui.$close_details.hide();

        $(document).on('click', self.ui.delete_mod, function(e) {
            e.preventDefault();
            let id = $(this).parents('tr').data('modid');
            let data = {
                "modid": id,
                "action": "delete_mod",
            };
            self.send_action(data);
        });

        $(document).on('click', self.ui.unflag_mod, function(e) {
            e.preventDefault();
            let id = $(this).parents('tr').data('modid');
            let data = {
                "modid": id,
                "action": "unflag_mod",
            };
            self.send_action(data);
        });

        $(document).on('click', self.ui.get_details, function(e) {
            e.preventDefault();
            self.ui.$loadingMessage.show();
            self.ui.$overlay.show();
            self.ui.$details_modal.show();

            let id = $(this).parents('tr').data('modid');
            let modName = $(this).attr('data-mod-name');

            $('.js-mod-name').html(modName);

            self._fetchModDetails(id);
        });

        this.ui.$close_details.on('click', function(e) {
            self.ui.$overlay.hide();
            self.ui.$details_modal.hide();
            self.ui.$detail_output.html('');
        });
    }

    _renderModDetails(response) {
        let self = this;
        let details = response;

        self.ui.$loadingMessage.hide();
        self.ui.$close_details.show();

        if (details.length == 0) {
            self.ui.$detail_output.append('<p>No details available, or user unflagged.</p><hr />');
        } else {
            $.each(details, function(index, value) {  
                let gamertag = value.gamertag ? value.gamertag : "unknown user";
                let flagDate = value.flagDate ? self._formatDate(value.flagDate) : "unknown date";
                let reason = value.flagReason ? value.flagReason : "unknown reason";

                self.ui.$detail_output.append('<p><b>' + gamertag + '</b> flagged on <b>' + flagDate + '</b> for <b>' + reason + '</b>.</p><hr />');
            });
        }
    }

    send_action(data) {
        $.ajax({
            url: './admin-ajax.php',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (response) {
                if (response.successful && data.action == 'delete_mod') {
                    $("[data-modid='" + data.modid + "']").fadeOut();
                } else if (response.successful && data.action == 'unflag_mod') {
                    $("[data-modid='" + data.modid + "']").fadeOut();
                } else {
                    alert(response.error);
                }
            },
        });
    }
}

