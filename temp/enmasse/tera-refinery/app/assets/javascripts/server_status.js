$(document).ready(function() {
  if($('#server-status-table').length) {


    $('#server-status-table').dataTable({ 
      "bPaginate": false,
      "bRetrieve": true,
      "bAutoWidth": false,
      "oLanguage": {
        "sEmptyTable": "No results matching filter text."
      },
      "aaSorting": [[1, "asc"]],
      "aoColumns": [
        { "sSortDataType": "data-value" },
        null,
        { "sSortDataType": "data-value" },
        { "sSortDataType": "data-value" },
        { "sSortDataType": "data-value" }
      ]
    });
  }
}); 

$.fn.dataTableExt.afnSortData['dom-select'] = function  ( oSettings, iColumn )
{
  var aData = [];
  $( 'td:eq('+iColumn+') select', oSettings.oApi._fnGetTrNodes(oSettings) ).each( function () {
    aData.push( $(this).attr('data-value') );
  } );
  return aData;
};