import TextModeration from "./TextModeration";

export default class fieldlKit {

    characterCount() {
        if ($('.counted').length) {
            $.each($('.counted'), function (i, value) {
                let max = $(value).attr('maxlength');
                let curCount = $(value).val().length;

                if ($(value).siblings('.characterCount').length) {
                    $(value).next('.characterCount').find('.curCount').text(curCount);
                } else {
                    $(value).after("<span class='characterCount'><span class='curCount'>" + curCount + "</span> / " + max + " Characters</span>");
                }

            });
        }
    }

    // Check input for emoji or bad words
    checkContent(val, theSource) {
        console.log('checking content');
        let contentValid = true;
        let returnedValid;

        let content = val.val().toString().toLowerCase();

        // Blocked characters
        var pattern = /^[\x20-\x7E]*$/;

        if (!pattern.test(content) && !pattern.test('U+23CE')) {
            contentValid = false;
        }

        if (contentValid != false) {
            $(val).parents('.form__item').removeClass('error');
            $(val).siblings('.field_error').remove();
            returnedValid = true;
        } else {
            $(val).parents('.form__item').addClass('error');
            returnedValid = false;
            if ($(val).siblings('.field_error').length) {
                $(val).siblings('.field_error').remove();
            }
        }

        if ($("#clans-create .error")[0]) {
            theSource.options.contentValid = false;
        } else {
            theSource.options.contentValid = true;
        }

        // Clan Page. Add Message of the day
        if (theSource.ui.saveMotd.length) {
            if ($(theSource.ui.saveMotd).parents('.form__item').hasClass('error') && theSource.ui.saveMotd.length) {
                $(theSource.ui.saveMotd).prop('disabled', 'disabled');
            } else {
                $(theSource.ui.saveMotd).removeAttr('disabled');
            }
        }

        // Check Field for profanity
        if (contentValid != false) {
            TextModeration._TextModeration(window.wp_object.post_ID, 'clans', content, val);
        }

        return returnedValid;
    }

}