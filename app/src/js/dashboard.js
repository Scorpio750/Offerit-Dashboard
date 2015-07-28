//
$(document).ready(function() {
	// Offer Panel functions
	if (undefined == 1) {
		console.log('damn undefined is still broken');
	}
	var txt = ['Top ', 'New ', ' by Hits', ' by Convs', ' by Payout', ' by EPC', ' (Network)'],
		n = txt.length + 1;
	$swap = [$('#swap1'), $('#swap2'), $('#swap3'), $('#metric-btn-wrapper')],
	$span = [],
	c = 0;
	// create spans inside span
	for (var i = 0; i < 2; i++) {
		$swap[0].append($('<span />', {
			text: txt[i]
		}));
	}
	for (i = 2; i < 7; i++) {
		var k;

		(i < 6) ? k = 1 : k = 2;
		$swap[k].append($('<span />', {
			text: txt[i]
		}));
	}
	// hide and collect spans
	for (i in $swap) {
		$span[i] = $('span', $swap[i]).hide();
	}

	/*	shifts header base 
	 *	@params:
	 *	n - index in span array
	 *	flag - if 0, fades in, else fades out
	 *	k - span array subindex */
	function shift(n, flag, k) {
		var $width;
		var currentPrefix = $span[n].eq(k);
		var options = {
			duration: 200
		};
		switch (flag) {
			case 0:
				$width = 0;
				break;
			case 1:
				$width = currentPrefix.width();
				break;
		}

		$swap[n].animate({
			width: $width
		});
		switch (n) {
			case 0:
				var otherPrefix = $span[n].eq((k + 1) % 2);
				// if selected prefix is not displayed, swap it in
				otherPrefix.stop().fadeOut('options')
				currentPrefix.delay(400).fadeIn('options');

				/*// if selected prefix is 'Top'
				if (k == 0) {
					// if there is no set metric prefix, set 'Hits' as default

					console.log($metric.width());
					$metric.animate({
						width: $metric.width()
					});
					if ($metric.css('display') == 'none') {
						$metric.delay(500).fadeIn('options');
					}
				}
				if (k == 1) {
					console.log($metric.width());
					$metric.animate({
						width: 0
					});
						$metric.fadeOut('options');
				}*/
				break;
			case 1:
				var otherPrefix;
				for (var i = 0; i < 4; i++) {
					if ($span[n].eq(i).css('display') == 'inline') {
						otherPrefix = $span[n].eq(i);
					}
					if (typeof otherPrefix !== "undefined") {
						console.log('fuck me');
						otherPrefix.stop().fadeOut('options')
					}
					currentPrefix.delay(400).fadeIn('options');
				}
				break;
			default:
				(flag == 1) ? $span[n].delay(400).fadeIn(options) : $span[n].stop().fadeOut(options);
				break;

		}
	}

	// triggers subnavs to open upon hovering over a menu item
	$('.dropdown-item').click(function slide() {
		/* Finding the drop down list that corresponds to the current section: */
		var dropDown = $(this).next('.subnav');
		$('.subnav').not(dropDown).slideUp();
		dropDown.slideToggle();
	});

	$('.offer-type').click(function switch_offers() {
		var id = $(this).attr('id');

		switch (id[0]) {
			case 't':
				$('#new-offer-list').addClass('hidden');
				$('#top-offer-list').removeClass('hidden');
				shift(0, 1, 0);
				shift(3, 1, 0);
				break;
			case 'n':
				$('#new-offer-list').removeClass('hidden');
				$('#top-offer-list').addClass('hidden');
				shift(0, 1, 1);
				shift(3, 0, 0);
				break;
		}

		switch (id[1]) {
			case 'u':
				shift(2, 0, 0);
				break;
			case 'n':
				shift(2, 1, 0);
				break;
		}
	});

	// swaps metric type identifiers in header
	$('.metric-type').click(function metric_switch() {
		var id = $(this).attr('id');
		shift(1, 1, id[0]);
	});

	function offerSwitch() {
		c = ++c % n;
		console.log(c);
		$swap[0].animate({
			width: $span[0].eq(c % 2).width()
		});
		$span[0].stop().fadeOut('fast').eq(c % 2).delay(200).fadeIn('fast');
		if (c > 1) {
			// change color of offer panel to red
			console.log('adding network');
			$(this).closest('#offer-box').addClass('network');
			shift(1, 1);
		} else {
			console.log('removing network');
			$(this).closest('#offer-box').removeClass('network');
			shift(1, 0);
		}
		$('#top-offer-list').toggleClass('hidden');
		$('#new-offer-list').toggleClass('hidden');
	}

	$('.menu-btn').click(function() {
		var notThisOne = $(this).next('.menu');
		// closes any open subnavs upon opening the main nav
		if ($(this).hasClass('dropdown-toggle')) {
			$(this).next('.menu').find('.subnav').slideUp();
		}

		$('.menu').not(notThisOne).slideUp();
		notThisOne.slideToggle();
	});

	// toggle graphs
	$('.metric-btn > ul > li').click(function toggleMetric() {
		var queryVars = {
			'function': undefined,
			'period': 8,
			'return_type': 'json',
			'time_format': 'hour',
			'identifier': 'impression'
		};
		var tag;
		switch ($(this).text()) {
			case 'Hits':
				tag = 'display_hourly_hits';
				break;	
			case 'Conversions':
				tag = 'display_hourly'
			case 'Payout':
				tag = 'display_hourly_sales';
				break;	
			case 'EPC':
				tag = 'display_hourly_epc';
				break;	
		}
		queryVars.function = 'display_hourly_' + tag;
		call_data(queryVars);
	})
});