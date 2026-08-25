/**
 * GetUrlParam
 * @description  pull out a specific URL param
 */

const getUrlParam = function(sParam, sUrl) {
    var urlVars;
    var pageUrl;
    var paramName;

    if ( sUrl ) {
        pageUrl = sUrl;
    } else {
        pageUrl = window.location.search.substring(1);
    }

    urlVars = pageUrl.split('&');

    for (var i = 0; i < urlVars.length; i++)
    {
        paramName = urlVars[i].split('=');
        if (paramName[0].toLowerCase() === sParam.toLowerCase()) {
            return paramName[1];
        }
    }
};

export default getUrlParam;
