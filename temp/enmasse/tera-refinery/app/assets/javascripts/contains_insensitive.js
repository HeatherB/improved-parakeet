$(function () {
	$.extend($.expr[':'], {
		containsInsensitive: function (obj, index, meta, stack) {
			var objText = $.trim((obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase());
			var matchText = $.trim(meta[3].toLowerCase());
			var rx = new RegExp(matchText);
			return rx.test(objText);
		}
	});
});
