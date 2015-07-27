{ literal }
$(document).ready(function() {
	// Flot rendering functions
	var queryVars, period;
	/* creating data array to hold series information
	 * 1st element is hourly graph data
	 * 2nd element is period graph data
	 * Period graph elements are indexed in the following manner:
	 * [0] This Period
	 * [1] Last Period
	 * [2] This Month
	 * [3] Last Month
	 * [4] Past 30 Days
	 * [5] Past 60 Days
	 * [6] Past 90 Days
	 * [7] This Year
	 * [8] All Time
	 */
	var series_data = {
		'Hourly Data': [],
		'Period Data': [
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			['']
		]
	};

	label_series(series_data['Hourly Data']);
	for (var i in series_data['Period Data']) {
		label_series(series_data['Period Data'][i]);
	}

	// maps menu period indices to database period indices
	var period_map = [0, 1, 5, 11, 13, 12, 13, 6, 7];

	// constructs each series element
	function label_series(series) {
		var names = ['Hits', 'Conversions', 'Payout', 'EPC'];
		for (var i in names) {
			series[i] = {
				label: names[i],
				data: []
			};
		}
		return series;
	}

	// AJAX calls for plot data
	function call_data(queryVars) {
		$.getJSON('http://jamesdev.offerit.com/internal_data.php',
			queryVars, function store_data(data) {
				if (data) {
					var target_series, index, identifier, plot_name;
					switch (queryVars['function']) {
						case 'offerit_display_stats':
							// period graph data
							if (typeof queryVars['dashboard_multi'] !== "undefined") {
								identifier = 'raw_hits';
								series_data['Period Data'][0][0] = create_axes(data['stats']['date'], series_data['Period Data'][0][0], identifier);
								plot_name = '#p_chart';
								plot_graph(plot_name, series_data['Period Data'][0][0].data);
								break;
							}
							// stats-box data
							else if (typeof queryVars['dashboard_summary'] !== "undefined") {
								console.log('entering fill_stats...');
								fill_stats(data.total);
								return;
							}
							break;
						case 'offerit_display_hourly_hits':
							identifier = 'raw_hits';
							series_data['Hourly Data'][0] = create_axes(data, series_data['Hourly Data'][0], identifier);
							plot_name = '#h_chart';
							plot_graph(plot_name, series_data['Hourly Data'][0].data);
							break;
						case 'offerit_display_hourly_sales':
							identifier = 'raw_hits';
							series_data['Hourly Data'][1] = create_axes(data, series_data['Hourly Data'][1], identifier);
							plot_name = '#h_chart';
							plot_graph(plot_name, series_data['Hourly Data'][1].data);
							break;
					}
				}
			});
	}

	// creates the axes from the ajax data and stores them in the appropriate series object
	function create_axes(ajax_data, series, identifier) {
		console.log('================\ncreating axes');
		console.log(ajax_data);
		for (var date in ajax_data) {
			// if (typeof ajax_data[date][identifier] !== undefined) {
				series.data.push([ date * 1000, ajax_data[date][identifier] ]);
			// }
		}
		console.log('plot data:');
		console.log(series);
		return series;
	}

	function plot_graph(plot_name, data) {
		var series_options = {
			series: {
				stack: true,
				group: true,
				groupInterval: 1,
				lines: {
					show: true,
					fill: false
				},
				points: {
					show: false
				},
			},
			xaxis: {
				mode: "time",
				timezone: "browser",
				tickLength: 5
			},
			selection: {
				mode: "x"
			},
			grid: {
				color: "slategray",
				borderWidth: 0,
				backgroundColor: "#E6E6E6",
				hoverable: true,
				clickable: false,
				autoHighlight: true
			}
		}
		if (plot_name == '#p_chart') {
			// helper for returning the weekends in a period
			function weekendAreas(axes) {

				var markings = [],
					d = new Date(axes.xaxis.min);

				// go to the first Saturday

				d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7));
				d.setUTCSeconds(0);
				d.setUTCMinutes(0);
				d.setUTCHours(0);

				var i = d.getTime();

				// when we don't set yaxis, the rectangle automatically
				// extends to infinity upwards and downwards
				do {
					markings.push({
						xaxis: {
							from: i,
							to: i + 2 * 24 * 60 * 60 * 1000
						}
					});
					i += 7 * 24 * 60 * 60 * 1000;
				} while (i < axes.xaxis.max);

				return markings;
			}
			series_options.markings = weekendAreas;
		}
		return ($.plot(plot_name, data, series_options));
	}

	// Initially, display only hourly data 
	// and data from this pay period

	// Stats Data
	period = 1;
	queryVars = {
		'function': 'offerit_display_stats',
		'period': period,
		'dashboard_summary': 1,
		'dashboard_multi': undefined
	};
	var stats_data = call_data(queryVars);
	// Graph Data
	// Period data
	queryVars = {
		'function': 'offerit_display_stats',
		'period': period,
		'dashboard_summary': undefined,
		'dashboard_multi': 1
	};
	var summary_data = call_data(queryVars);

	// Hourly data
	period = 8;
	queryVars = {
		'function': 'offerit_display_hourly_hits',
		'period': period,
		'return_type': 'json',
		'time_format': 'hour'
	};
	var hourly_hits = call_data(queryVars);
	/*queryVars['function'] = 'offerit_display_hourly_sales';
	var hourly_sales = call_data(queryVars);
*/

	// Object.keys(series_data['p_series']).forEach(function(key, index) {
	// 	label_series(series_data['p_series'], names);
	// }, series_data['p_series']);

	/////////////////////////////////////
	//                                 //
	//  stats-box rendering functions  //
	//                                 //
	/////////////////////////////////////
	function fill_stats(data) {
		console.log('Filling stats-box...');
		console.log(data);
		var container = $('.stats-container');
		var boxes = container.find('.stats-box');
		var target_text, target_data, extracted_data;
		$.each(boxes, function insert_data() {
			console.log($(this));
			console.log($(this).find('.right-stats-box>h3:nth-child(1)'));
			console.log($(this).find('.right-stats-box>h3:nth-child(2)'));
			target_text = $(this).find('.right-stats-box>h3:nth-child(1)');
			target_data = $(this).find('.right-stats-box>h3:nth-child(2)');
			switch (target_text.text()) {
				case 'Hits':
					extracted_data = data['raw_hits'];
					break;
				case 'Convs':
					extracted_data = data['conv_count'];
					break;
				case 'Payout':
					extracted_data = data['total_payout'];
					extracted_data = add_decimals(extracted_data);
					extracted_data = '$ ' +  extracted_data;
					break;
				case 'EPC':
					extracted_data = data['total_payout'] / data['raw_hits'];
					extracted_data = add_decimals(extracted_data);
					extracted_data = '$ ' +  extracted_data;
					break;
			}
			target_data.text(extracted_data);
		});
	}

	function add_decimals(n) {
		if (!isInt(n)) {
			n = n.toFixed(2);
		}
		return n;
	}

	function isInt(n) {
		return n % 1 === 0;
	}
}); 
{ /literal }