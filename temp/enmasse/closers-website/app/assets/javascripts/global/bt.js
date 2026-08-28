;BT = function(obj) {
  var self = this;
      res = obj.res,
      uid = obj.uid,
      game = obj.game,
      delay = 250;
  self.url = (obj.url || 'https://bt.enmasse.com') + "/cast";

  if(uid != null && uid != undefined && uid != ""){
    if(obj.add) {
      self.add = obj.add
    }

    self.t = function(data, success){
      data['res'] = res;
      data['uid'] = uid;
      data['game'] = game;
      $.ajax({ type: "POST", url: self.url, data: data, success: success, crossDomain: true });
    };

    $('.bt-submit').on('submit', function(event) {
      var md = $(this).serialize(),
          theForm = this;
      event.preventDefault();
      var subFunc = function () {
        if(typeof submitProcess == "number") {
          window.clearTimeout(submitProcess);
          delete submitProcess;
          theForm.submit();
        }
      };
      var submitProccess = setTimeout( subFunc, delay);
      self.t({md: md, act: 'submit', label: $(this).data('bt-label')}, subFunc);
    });

    $('.bt-click').on('click', function(event){
      if($(this).data('delay') == "true") {
        return
      }
      $(this).data('delay', "true");
      event.preventDefault();
      var theLink = this;
      var clickFunc = function () {
        if(typeof clickProccess == "number") {
          window.clearTimeout(clickProccess);
          delete clickProccess;
          theLink.click();
        }
      };
      var clickProccess = setTimeout( clickFunc, delay);
      self.t({md: $(this).data('bt-md'), act: 'click', label: $(this).data('bt-label')}, clickFunc);
    });

    $('.bt-load').each(function(i, loaded){
      self.t({md: $(loaded).data('bt-md'), act: 'load', label: $(loaded).data('bt-label')});
    });
  }
};
