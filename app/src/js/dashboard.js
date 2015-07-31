// add nicescroll to all bottom-boxes
$('#offer-box > .bottom-box').niceScroll({
	cursoropacitymax: .5,
	cursorwidth: '10px',
	cursorcolor: '#555',
	cursorborder: '0px',
	railpadding: {
		top: 0,
		right: 0,
		left: 0,
		bottom: 0
	}
});
$('.three-box > .bottom-box').niceScroll({
	cursoropacitymax: .5,
	cursorwidth: '10px',
	cursorcolor: '#555',
	cursorborder: '0px',
	railpadding: {
		top: 0,
		right: 0,
		left: 0,
		bottom: 0
	}
});

// Offer Panel functions
var txt = ['Top ', 'New ', ' by Hits', ' by Convs', ' by Payout', ' by EPC', ' (Network)'],
	n = txt.length + 1;
$swap = [$('#swap1'), $('#swap2'), $('#swap3'), $('#metric-btn-wrapper')],
$span = [];

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
	switch (flag) {
		case 0:
			$width = 0;
			break;
		case 1:
			$width = currentPrefix.width();
			break;
	}

	if (n != 3) {
		$swap[n].animate({
			width: $width
		});
	}

	switch (n) {
		case 0:
			var otherPrefix = $span[n].eq((k + 1) % 2);
			// if selected prefix is not displayed, swap it in
			otherPrefix.stop().fadeOut('options')
			currentPrefix.delay(400).fadeIn('options');
			break;
		case 1:
			var otherPrefix;
			for (var i = 0; i < 4; i++) {
				if ($span[n].eq(i).css('display') == 'inline') {
					otherPrefix = $span[n].eq(i);
				}
				if (typeof otherPrefix !== "undefined") {
					otherPrefix.stop().fadeOut('fast')
				}
				currentPrefix.delay(400).fadeIn('fast');
			}
			break;
		default:
			(flag == 1) ? $span[n].delay(400).fadeIn('fast') : $span[n].stop().fadeOut('fast');
			break;
	}
}

// load top user offers by default
shift(0, 1, 0);
shift(3, 1, 0);
var currentFocus = 'ajax_get_affiliate_top_offers';
toggleTopMetric('by Hits');

// triggers subnavs to open upon hovering over a menu item
$('.dropdown-item').click(function slide() {
	/* Finding the drop down list that corresponds to the current section: */
	var dropDown = $(this).next('.subnav');
	$('.subnav').not(dropDown).slideUp();
	dropDown.slideToggle();
});

$('.offer-type').click(function switch_offers() {
	var id = $(this).attr('id');
	var list;
	switch (id[0]) {
		case 't':
			shift(0, 1, 0);
			shift(3, 1, 0);
			switch (id[1]) {
				case 'u':
					list = $('#top-offer-list-user')
					currentFocus = 'ajax_get_affiliate_top_offers';
					toggleTopMetric('by Hits');
					shift(2, 0, 0);
					break;
				case 'n':
					list = $('#top-offer-list-network')
					currentFocus = 'ajax_get_network_top_offers';
					$('#swap3').css('vertical-align', '88%');
					shift(2, 1, 0);
					toggleTopMetric('by Hits');
					break;
			}
			break;
		case 'n':
			list = $('#new-offer-list')
			currentFocus = 'ajax_get_new_offers';
			shift(0, 1, 1);
			shift(3, 0, 0);
			shift(2, 0, 0);
			toggleNewMetric();
			break;
	}
	$('.offer-list').not(list).fadeOut();
	$(list).delay(400).fadeIn();
});

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
// $('#metric-btn > ul > li').click(toggleTopMetric($(this).text()));

// hacky as fuck, remove whenever possible
$('#metric-btn > ul > li').click(function() {
	url = 'http://jamesdev.offerit.com/ajax_data.php';
	var tag;
	console.log($(this).text());
	switch ($(this).text()) {
		case 'by Hits':
			tag = 'impression';
			break;
		case 'by Convs':
			tag = 'conversion';
			break;
		case 'by Payout':
			tag = 'commission';
			break;
		case 'by EPC':
			tag = 'epc';
			break;
	}
	var queryVars = {
		'function': currentFocus,
		'return_type': 'json',
		'type': tag
	};
	call_data(queryVars, url);
});

function toggleTopMetric(type) {
	url = 'http://jamesdev.offerit.com/ajax_data.php';
	var tag;
	switch (type) {
		case 'by Hits':
			tag = 'impression';
			break;
		case 'by Conversions':
			tag = 'conversion';
		case 'by Payout':
			tag = 'commission';
			break;
		case 'by EPC':
			tag = 'epc';
			break;
	}
	var queryVars = {
		'function': currentFocus,
		'return_type': 'json',
		'type': tag
	};
	call_data(queryVars, url);
}

function toggleNewMetric() {
	url = 'http://jamesdev.offerit.com/ajax_data.php';
	queryVars = {
		'function': currentFocus,
	}
	call_data(queryVars, url);
}

function display_offers(offers, type, scope) {
	console.log('--------------------');
	console.log(type);
	var $list = $('#offer-list');
	var target_list,
		list_class = '.' + scope + '-list',
		value;

	switch (type) {
		case 'impression':
			target_list = 'Hits';
			value = 'hits';
			break;
		case 'conversion':
			target_list = 'Convs';
			value = 'amount';
			break;
		case 'commission':
			target_list = 'Payouts';
			value = 'amount';
			break;
		case 'epc':
			target_list = 'Epc';
			value = 'amount';
			break;
		case 'new':
			// new offers list
			target_list = 'new-offer-list';
			value = 'visitor';
			break;
		case undefined:
			alert('Error: cannot build list; type undefined.');
	}
	target_list = '#' + scope + target_list;
	$(target_list).empty();
	for (var i in offers) {
		$(target_list).append($('<li />', {
			text: offers[i]['name']
		}));
	}
	console.log($(target_list).width());
	console.log($(target_list).height());
	$('#offers-area').animate({
		height: 114,
		width: $(target_list).width()
	});
	$(list_class).not(target_list).fadeOut('fast');
	$(target_list).delay(400).fadeIn('fast');
}

$('.period-menu li').each(function getPeriod(index) {
	$(this).click(function() {
		console.log('?????????????????????');
		url = 'http://jamesdev.offerit.com/internal_data.php';
		queryVars = {
			'function': 'offerit_display_stats',
			'period_index': index,
			'period': period_map[index],
			'dashboard_multi': undefined,
			'dashboard_summary': undefined
		}

		console.log($(this).parent().attr('id'));	
		switch ($(this).parent().attr('id')) {
			case 'hs-menu':
				queryVars['dashboard_summary'] = 1;
				break;
			case 'p_graph-menu':
				queryVars['dashboard_multi'] = 1;
				break;
		}
		console.log(queryVars);
		call_data(queryVars, url);
	});
});

});