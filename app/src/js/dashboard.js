$(document).ready(function() {
	// Offer Panel functions
	var txt = ['Top ', 'New ', ' (Network)'],
		n = txt.length + 1;
	$swap = [$('#swap1'), $('#swap2')],
	$span = [],
	c = 0;
	// create spans inside span
	for (var i = 0; i < 2; i++) {
		$swap[0].append($('<span />', {
			text: txt[i]
		}));
	}
	$swap[1].append($('<span />', {
		text: txt[i]
	}));
	$swap[1].css('font-size', '.75em');

	// hide and collect spans
	$span[0] = $('span', $swap[0]).hide();
	$span[1] = $('span', $swap[1]).hide();

	// shifts header base 
	// @params:
	// n - index in span array
	// k - boolean option
	// flag - if 0, fades in, else fades out
	function shift(n, flag, k) {
		var $width;
		var options = {
			duration: 300
		};
		switch (flag) {
			case 0:
				$width = 0;
				break;
			case 1:
				$width = $span[n].eq(k).width();
				break;
		}
		$swap[n].animate({
			width: $width
		});
		if (n == 0) {
			$span[0].stop().fadeOut('fast').eq(k).delay(200).fadeIn('fast');
		} else {
			(flag == 1) ? $span[n].stop().fadeIn(options) : $span[n].stop().fadeOut(options);
		}
	}
	// Initialize initial prefix before header base
	/*$swap[0].animate({
		width: $span[0].eq(0).width()
	});
      $span[0].eq(0).delay(200).fadeIn('fast');
      */

	$('.dropdown').click(function() {
		/* Finding the drop down list that corresponds to the current section: */
		var dropDown = $(this).find('.subnav');
		$('.subnav').not(dropDown).slideUp('slow');
		dropDown.slideToggle('slow');
	});

	$('.dropdown-item').click(function() {
		switch ($(this).attr('id')) {
			case 'tu':
				$('#new-offer-list').addClass('hidden');
				$('#top-offer-list').removeClass('hidden');
				$(this).closest('.offer-box').removeClass('network');
				shift(0, 1, 0);
				shift(1, 0, 0);
				break;
			case 'tn':
				$('#new-offer-list').addClass('hidden');
				$('#top-offer-list').removeClass('hidden');
				$(this).closest('.offer-box').addClass('network');
				shift(0, 1, 0);
				shift(1, 1, 0);
				break;
			case 'nu':
				$('#new-offer-list').removeClass('hidden');
				$('#top-offer-list').addClass('hidden');
				$(this).closest('.offer-box').removeClass('network');
				shift(0, 1, 1);
				shift(1, 0, 0);
				break;
			case 'nn':
				$('#new-offer-list').removeClass('hidden');
				$('#top-offer-list').addClass('hidden');
				$(this).closest('.offer-box').addClass('network');
				shift(0, 1, 1);
				shift(1, 1, 0);
				break;

		}
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
			$(this).closest('.offer-box').addClass('network');
			shift(1, 1);
		} else {
			console.log('removing network');
			$(this).closest('.offer-box').removeClass('network');
			shift(1, 0);
		}
		$('#top-offer-list').toggleClass('hidden');
		$('#new-offer-list').toggleClass('hidden');
	}

	$('.menu-btn').click(function() {
		var notThisOne = $(this).next();
		$('.menu').not(notThisOne).slideUp();
		notThisOne.slideToggle();
	});
});