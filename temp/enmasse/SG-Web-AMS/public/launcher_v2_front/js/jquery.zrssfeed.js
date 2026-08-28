/**
 * Plugin: jquery.zRSSFeed
 * 
 * Version: 1.1.5
 * (c) Copyright 2010-2011, Zazar Ltd
 * 
 * Description: jQuery plugin for display of RSS feeds via Google Feed API
 *              (Based on original plugin jGFeed by jQuery HowTo. Filesize function by Cary Dunn.)
 * 
 * History:
 * 1.1.5 - Target option now applies to all feed links
 * 1.1.4 - Added option to hide media and now compressed with Google Closure
 * 1.1.3 - Check for valid published date
 * 1.1.2 - Added user callback function due to issue with ajaxStop after jQuery 1.4.2
 * 1.1.1 - Correction to null xml entries and support for media with jQuery < 1.5
 * 1.1.0 - Added support for media in enclosure tags
 * 1.0.3 - Added feed link target
 * 1.0.2 - Fixed issue with GET parameters (Seb Dangerfield) and SSL option
 * 1.0.1 - Corrected issue with multiple instances
 *
 **/

(function($) {

    $.fn.rssfeed = function(url, options, fn) {

        // Set pluign defaults
        var defaults = {
            limit: 10,
            header: true,
            titletag: 'p',
            date: true,
            content: true,
            snippet: true,
            media: true,
            showerror: true,
            errormsg: '',
            key: null,
            ssl: false,
            linktarget: '_self'
        };
        var options = $.extend(defaults, options);

        // Functions
        return this.each(function(i, e) {
            var $e = $(e);
            var s = '';

            // Check for SSL protocol
            if (options.ssl) s = 's';

            // Add feed class to user div
            if (!$e.hasClass('rssFeed')) $e.addClass('rssFeed');

            // Check for valid url
            if (url == null) return false;

            // Send request
            $.get(url, function(xmldata) {
                var data = $.xml2json(xmldata);

                // Process the feeds
                _process(e, data, xmldata, options);

                // Optional user callback function
                if ($.isFunction(fn)) fn.call(this, $e);
            }).error(function() {
                // Handle error if required
                var msg = "";
                if (options.showerror)
                    if (options.errormsg != '') {
                    var msg = options.errormsg;
                }
                $(e).html('<div class="rssError"><p>' + msg + '</p></div>');
            });
        });
    };

    // Function to create HTML result
    var _process = function(e, data, xml, options) {

        // Get JSON feed data
        var feeds = data.channel;
        if (!feeds) {
            return false;
        }
        var html = '';
        var row = 'odd';

        // Get XML data for media (parseXML not used as requires 1.5+)
        if (options.media) {
            var xmlEntries = xml.getElementsByTagName('item');
        }

        // Add header if required
        if (options.header)
            html += '<div class="rssHeader">' +
				'<a href="' + feeds.link + '" title="' + feeds.description + '">' + feeds.title + '</a>' +
				'</div>';

        // Add body
        html += '<div class="rssBody">' +
			'<ul>';

        // Add feeds
        for (var i = 0; i < data.channel.item.length; i++) {
            if (options.limit != null) {
                if (i >= options.limit)
                    break;
            }

            // Get individual feed
            var entry = data.channel.item[i];
            var pubDate;

            // Format published date
            if (entry.publishedDate) {
                var entryDate = new Date(entry.publishedDate);
                var pubDate = entryDate.toLocaleDateString() + ' ' + entryDate.toLocaleTimeString();
            }

            // Add feed row
            html += '<li class="rssRow ' + row + '">';
            if (options.date && pubDate) html += '<p class="blogDate">' + pubDate + '</p>'
            if (options.content) {
                if (entry.encoded) {
                    html += '<p>' + entry.encoded + '</p>';
                } else {
                    html += '<p>' + entry.description + '</p><p class="slide-tagline"><a ng-click="openWebNoSession(' + entry.link + ')">' + entry.title + '</a></' + options.titletag + '>'
                }
            }

            // Add any media
            if (options.media && xmlEntries.length > 0) {
                var xmlMedia = xmlEntries[i].getElementsByTagName('enclosure');
                if (xmlMedia.length > 0) {
                    html += '<div class="rssMedia"><ul>'
                    for (var m = 0; m < xmlMedia.length; m++) {
                        var xmlUrl = xmlMedia[m].getAttribute("url");
                        var xmlType = xmlMedia[m].getAttribute("type");
                        var xmlSize = xmlMedia[m].getAttribute("length");
                        html += '<li><a href="' + xmlUrl + '">' + xmlUrl.split('/').pop() + '</a> (' + xmlType + ', ' + formatFilesize(xmlSize) + ')</li>';
                    }
                    html += '</ul></div>'
                }
                html += '</li>';
            }

            // Alternate row classes
            if (row == 'odd') {
                row = 'even';
            } else {
                row = 'odd';
            }
        }

        html += '</div></ul></div>';

        $(e).html(html);

        // Apply target to links
        $('a', e).attr('target', options.linktarget);
    };

    function formatFilesize(bytes) {
        var s = ['bytes', 'kb', 'MB', 'GB', 'TB', 'PB'];
        var e = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    }
})(jQuery);


	
