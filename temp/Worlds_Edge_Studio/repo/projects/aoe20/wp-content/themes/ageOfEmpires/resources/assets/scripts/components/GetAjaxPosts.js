export default class GetAjaxPosts {
  constructor() {
    this.init();
  }
  init() {
    this._getAjaxPosts();
  }

  _getAjaxPosts() {

    var data = {
      post_type: 'learn_to_play',
    }

    $.ajax({
      type: 'POST',
      dataType: 'JSON',
      data: {
        action: 'get_ajax_posts',
        data: data,
      },
      url: window.wp_object.ajaxurl,
      error: function (response) {
       console.log('error: ' + response);
      },
      success: function (response) {
        console.log(response)
      },
    });
  }
}