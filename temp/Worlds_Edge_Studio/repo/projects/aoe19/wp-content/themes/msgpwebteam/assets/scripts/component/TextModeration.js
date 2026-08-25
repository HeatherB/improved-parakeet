export default class TextModeration {

  static _TextModeration(conversationId, textType, textContent, element) {
    $.ajax({
      type: 'POST',
      dataType: 'JSON',
      data: {
        action: "profanityFilter",
        conversationId: conversationId,
        textContent: textContent,
        textType: textType,
      },
      url: window.wp_object.ajaxurl,
      success: function(response){
        if (response.validationPass) {
          $(element).siblings('.field_error').remove();
          $(element).parents('.form__item').removeClass('error');
        } else {
          $(element).siblings('.field_error').remove();
          if(!$(element).parents('.form__item').hasClass('error')) {
            $(element).parents('.form__item').addClass('error');
            $(element).after("<span class='field_error'>Contains Profanity</span>");
          }
        }
      },
    });
  }

}