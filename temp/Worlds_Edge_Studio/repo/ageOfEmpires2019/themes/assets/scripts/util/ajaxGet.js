const ajaxGet = function(options) {
  let ajaxObj = Object.assign({
    type: 'GET',
    url: null,
    data: null,
    dataType: 'json',
    xhrFields: {
      withCredentials: true,
    },
  }, options);

  if (!ajaxObj.url) {
    return;
  }

  return $.ajax(ajaxObj);
};

export default ajaxGet;
