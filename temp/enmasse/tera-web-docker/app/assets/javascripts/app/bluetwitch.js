if($('#twitch_section').length > 0) {

	
	var player = null;
	var _streams = new Array();
	
	function playTwitch(channelName, videoId, clipId, width, height, autoplay) {
		// get stream object
		var stream = null;
		$(_streams).each(function(i) {
			if (
				(this.channel_name == channelName && this.type == 'stream') ||
				(this.video_id == videoId && this.type == 'video') ||
				(this.clip_id == clipId && this.type == 'clip')
			) {
				stream = this;
			}
		});
		if (stream == null) {
			return;
		}
		
		$('#screen').html("");
		$('.stream_info').html("");
		$('#streamInfoTemplate').tmpl(stream).appendTo('.stream_info');
		
		if (stream.type == 'clip') {
			var embedHtml = '<iframe src="https://clips.twitch.tv/embed?autoplay=' + autoplay + '&clip=' + stream.clip_id + '" height="' + height + '" width="' + width + '" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>';
			$('#screen').html(embedHtml);
			return;
		}
 		player = new Twitch.Player("screen", {
 			width: width,
 			height: height,
 			autoplay:autoplay
 		});
 		if (stream.type == 'video') {
 			player.setVideo(stream.video_id);
 		} else {
 			player.setChannel(stream.channel_name);
 		}
	}

	$(document).ready(function() {
		var partnerPromise = $.ajax({
			url: 'https://d2r215f9ht53uz.cloudfront.net/twitch_1_partner.json',
			method: 'GET',
			dataType: 'json',
			cache: false,
		}).done(function(response) {
	 		var streams = response.streams;
	 		if (streams.length > 0) {
		 		_streams = _streams.concat(streams);
		 		$("#streamTemplate").tmpl(streams).appendTo('#partnerStreams');
 		 		playTwitch(streams[0].channel_name, streams[0].video_id, streams[0].clip_id, 640, 360, true);
	 		}
		}).fail(function(jqXHR, textStatus) {
			alert("Load error : /streams/partners");
		}).always(function() {
			$.ajax({
				url: 'https://d2r215f9ht53uz.cloudfront.net/twitch_1.json',
				method: 'GET',
				dataType: 'json',
				cache: false,
			}).done(function(response) {
		 		var streams = response.streams;
		 		if (streams.length > 0) {
			 		_streams = _streams.concat(streams);
			 		$('#streamTemplate').tmpl(streams).appendTo('#streams');
			 		$('#totalStreams').text(response.total_streams);
			 		$('.btn_live_view').show();
		 		}
			}).fail(function(jqXHR, textStatus) {
				alert("Load error : /streams");
			}).always(function() {
			});
		});
	});
	
	function changeStreamTab(obj) {
		if ($(obj).hasClass("on")) {
			return;
		}
		$(".tab_area button").removeClass("on");
		$(obj).addClass("on");
		if ($(obj).hasClass("partners")) {
			$("#partnerStreams").show();
			$("#streams").hide();
		}
		if ($(obj).hasClass("streamers")) {
			$("#streams").show();
			$("#partnerStreams").hide();
		}
	}
}
