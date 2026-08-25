import config from '../admin-config';
import ajaxPost from '../util/ajaxPost';

export default class ShortUrlAdmin {
   
    constructor() {      
        this.init();
    }

    init() {     

        this.ui = {
            $window: $(window),
            $filters: $('#mods-filters'),
            $paginav: $('#mods-paginav'),
            $listing: $('#mods-listing'),
            $delete_url: $('.delete_url'),
            delete_url: '.delete_url',
            $edit_url: $('.edit_url'),
            edit_url: '.edit_url',
            $add_url: $('.add_urls'),
            add_url: '.add_url',
            $detail_output: $('.js-mod-detail-output'),
            $close_details: $('.js-modal-close'),
            close_details: '.js-modal-close',
            $save_details: $('.js-modal-save'),
            save_details: '.js-modal-save',
            $details_modal: $('.js-add-edit-dialog'),
            $overlay: $('.js-overlay'),
            $urlResult: $('#UrlResult'),
            urlResult: '#UrlResult',
            longUrl: '#LongUrl',
            shortUrl: '#ShortUrl',
            $longUrl: $('#LongUrl'),
            $isEditable: $('#isEditable'),
            $shortUrl: $('#ShortUrl'),
            $urlId: $('#UrlId'),
            copy_url: '.copy_url',
        };

        this._addEventListeners();
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

        $(document).on('click', self.ui.delete_url, function(e) {
            e.preventDefault();
            if (confirm("Are you sure you wish to delete this url?")) {
                let id = $(this).parents('tr').data('urlid');
                let data = {
                    "shortUrl": id,
                    "action": "delete_url",
                };
                self.send_action(data);
            }
        });
        $(document).on('click', self.ui.copy_url, function (e) {
            e.preventDefault();
            var input = $(this).siblings('.ShortUrlCopy');
            var copyUrl = $(this).siblings('.ShortUrlCopy')[0];
            input.show();
            copyUrl.select();
            copyUrl.setSelectionRange(0, 99999); /*For mobile devices*/

            /* Copy the text inside the text field */
            document.execCommand("copy");
            input.hide();
            $(this).siblings(".urlCopyMessage").text(" Copied!");
            
        });
        $(document).on('click', self.ui.edit_url, function(e) {
            e.preventDefault();

            let id = $(this).parents('tr').data('urlid');
            let longUrl = $(this).parents('tr').find('td').eq(1).text();

            self.ui.$urlId.val(id);
            self.ui.$shortUrl.val(id);
            self.ui.$longUrl.val(longUrl);

            self.ui.$overlay.show();
            self.ui.$details_modal.show();
            self.ui.$close_details.show();
            self.ui.$close_details.data('is-edit', 'false');
        });

        $(document).on('click', self.ui.add_url, function(e) {
            e.preventDefault();
            self.ui.$overlay.show();
            self.ui.$details_modal.show();            
            self.ui.$close_details.show();
            self.ui.$close_details.data('is-edit', 'false');
        });

        $(document).on('click', self.ui.save_details, function(e) {

            let data = {
                "urlId": self.ui.$urlId.val(),
                "shortUrl": self.ui.$shortUrl.val(),
                "longUrl": self.ui.$longUrl.val(),
                "isEditable": self.ui.$isEditable.prop("checked"),
                "action": "save_aoe_url",
            };

            self.send_action(data); 
        });
        $(document).on('click', self.ui.close_details, function (e) {
            if (self.ui.$close_details.data('is-edit') == 'false') {
                self.ui.$overlay.hide();
                self.ui.$details_modal.hide();
            } else {
                location.href = location.href;
            }
        });
        $(document).on('blur', self.ui.longUrl, function (e) {
            try {
                var url = new URL(self.ui.$longUrl.val());
                self.ui.$save_details.show();
                self.ui.$urlResult.html('');
            } catch (err) {
                self.ui.$urlResult.html("Long Url incorrect.  Must include http/https.");
                self.ui.$save_details.hide();
            }
        });
    }

    send_action(data) {
        let self = this;
        $.ajax({
            url: './admin-ajax.php',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (response) {
                var result = response.response;
                if (response.successful && data.action == 'delete_url') {                    
                    $("[data-urlid='" + data.shortUrl + "']").fadeOut();
                } else if (response.successful && data.action == 'save_aoe_url') {  
                    self.ui.$longUrl.val('');
                    self.ui.$shortUrl.val('');
                    self.ui.$urlId.val('');
                    self.ui.$close_details.data('is-edit', 'true');
                    self.ui.$urlResult.html('Url updated for ' + result.shortUrl);                    
                } else {
                    self.ui.$urlResult.html(response.error);
                }
            },
        });
    }
}

