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
	// k - span array subindex
	// flag - if 0, fades in, else fades out
	function shift(n, flag, k) {
		var $width;
		var options = {
			duration: 200
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
		console.log('------------\n\nThe value of n is ' + n);
		if (n == 0) {
			/* retrieves swap element from document
			 * if different than requested swap elem,
			 * swap the two */
			var $spanVisible = [];
			var dispNoneCounter = 0;
			for (var $i of $swap) {
				console.log('The value of $i is ' + $i.text());
				if ($i.text() == ' (Network') break;

				if ($i.find('span').css('display') == 'none') {
					dispNoneCounter++;
					$spanVisible.push($i);
					console.log($spanVisible);
				}
			}

			switch (dispNoneCounter) {
				case 2:
					$span[n].eq(k).fadeIn(options);
					return;
				case 1:
					if ($spanVisible[0].text() != $span[n].eq(k).text()) {
						console.log('The value of k is ' + k);
						$span[n].stop().fadeOut(options).eq(k).delay(200).fadeIn(options);
					}
					return;
				case 0:
					$('*').css('color', 'red');
					return;
			}
		} else {
			(flag == 1) ? $span[n].delay(200).fadeIn(options) : $span[n].stop().fadeOut(options);
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
		var dropDown = $(this).next('.subnav');
		$('.subnav').not(dropDown).slideUp();
		dropDown.slideToggle();
	});

	$('.dropdown-item').click(function() {
		switch ($(this).attr('id')) {
			case 'tu':
				$('#new-offer-list').addClass('hidden');
				$('#top-offer-list').removeClass('hidden');
				shift(0, 1, 0);
				shift(1, 0, 0);
				break;
			case 'tn':
				$('#new-offer-list').addClass('hidden');
				$('#top-offer-list').removeClass('hidden');
				shift(0, 1, 0);
				shift(1, 1, 0);
				break;
			case 'nu':
				$('#new-offer-list').removeClass('hidden');
				$('#top-offer-list').addClass('hidden');
				shift(0, 1, 1);
				shift(1, 0, 0);
				break;
			case 'nn':
				$('#new-offer-list').removeClass('hidden');
				$('#top-offer-list').addClass('hidden');
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