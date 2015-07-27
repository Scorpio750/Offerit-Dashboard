{literal}
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
	var metrices = ['raw_hits', 'conv_count', 'total_payout', 'EPC'];

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
					var target_series, plot_name;
					switch (queryVars['function']) {
						case 'offerit_display_stats':

							// period graph data
							if (typeof queryVars['dashboard_multi'] !== "undefined") {

								// loop through and fill each metric subindex
								for (var subindex in metrices) {
									series_data['Period Data'][period][subindex] = create_axes(
										data['stats']['date'],
										series_data['Period Data'][period][subindex],
										metrices[subindex]);
								}
								plot_name = '#p_chart';
								plot_graph_p(plot_name, series_data['Period Data'][period]);
								break;
							}

							// stats-box data
							else if (typeof queryVars['dashboard_summary'] !== "undefined") {
								fill_stats(data.total);
								return;
							}
							break;
						case 'offerit_display_hourly_hits':
							series_data['Hourly Data'][0] = create_axes(
								data,
								series_data['Hourly Data'][0],
								queryVars['identifier']);
							plot_name = '#h_chart';
							plot_graph_h(plot_name, series_data['Hourly Data'][0]);
							break;
						case 'offerit_display_hourly_sales':
							series_data['Hourly Data'][2] = create_axes(
								data,
								series_data['Hourly Data'][2],
								queryVars['identifier']);
							plot_name = '#h_chart';
							plot_graph_h(plot_name, series_data['Hourly Data'][2]);
							break;
					}
				}
			});
	}

	// map identifier string to appropriate metric subindex
	function map_identifier(identifier) {
		var ident_index;
		switch (identifier) {
			case 'impression':
				ident_index = 0;
				break;
			case 'raw_hits':
				ident_index = 0;
				break;
			case 'conv_count':
				ident_index = 1;
				break;
			case 'total_payout':
				ident_index = 2;
				break;
			case 'EPC':
				ident_index = 3;
				break;
		}
		return ident_index;
	}

	// creates the axes from the ajax data and stores them in the appropriate series object
	function create_axes(ajax_data, series, identifier) {
		console.log('================\ncreating axes');
		console.log(ajax_data);
		console.log("identifier: " + identifier);

		// EPC has to be all *special*
		// making me do a fucking edgecase and shit
		// Fuck you, EPC... fuck you.
		if (identifier === 'EPC') {
			var epc_val;
			for (var i = 0; i < ajax_data.length; i++) {
				if (typeof ajax_data[i]['total_payout'] === "undefined") {
					epc_val = 0;
				} else if (typeof ajax_data[i]['total_payout'] !== "undefined" &&
					typeof ajax_data[i]['raw_hits'] === "undefined") {
					epc_val = Number(ajax_data[i]['total_payout']);
				} else if (typeof ajax_data[i]['total_payout'] !== "undefined" &&
					typeof ajax_data[i]['raw_hits'] !== "undefined") {
					epc_val = Number(ajax_data[i]['total_payout']) / Number(ajax_data[i]['raw_hits']);
				}
				series.data.push([ajax_data[i]['name'] * 1000, epc_val]);
			}
		}

		// Everyone else who is not a goddamn special snowflake
		for (var i in ajax_data) {
			if (typeof ajax_data[i][identifier] === "undefined") {
				ajax_data[i][identifier] = 0;
			}
			series.data.push([ajax_data[i]['name'] * 1000, Number(ajax_data[i][identifier])]);
		}
		console.log('series data:');
		console.log(series);
		return series;
	}

	function plot_graph_h(plot_name, data) {
		console.log('plotting data...');
		console.log(data);
		var series_options = {
			series: {
				stack: true,
				group: true,
				groupInterval: 1,
				lines: {
					show: true,
					fill: true
				},
				curvedLines: {
					active: false,
					apply: true,
					monotonicFit: true
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
		
		$.plot /*Animator*/ (plot_name, [{
			data: data.data,
			label: data.label,
			animator: {
				start: 1000,
				steps: 200,
				duration: 1000
			}
		}], series_options);
	}

	function plot_graph_p(plot_name, data) {
		console.log('plotting data...');
		console.log(data);

		var series_options = {
			series: {
				stack: true,
				group: true,
				groupInterval: 1,
				curvedLines: {
					active: false,
					apply: true,
					monotonicFit: true
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
			yaxes: [
				{
					/* first y-axis */
				},
				{
					/* second y-axis */
					position: "right"
				}
			],
			grid: {
				color: "slategray",
				borderWidth: 0,
				backgroundColor: "#E6E6E6",
				hoverable: true,
				clickable: false,
				autoHighlight: true
			}
		}

		// first correct the timestamps - they are recorded as the daily
		// midnights in UTC+0100, but Flot always displays dates in UTC
		// so we have to add one hour to hit the midnights in the plot

		for (var i = 0; i < data.length; ++i) {
			data[i][0] += 60 * 60 * 1000;
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
				console.log(markings);
				return markings;
			}
			series_options.markings = weekendAreas;
		}
		$.plot/*Animator*/(plot_name, [
		{
			label: data[0].label,
			data: data[0].data,
			lines: {
				show: true,
				fill: true
			}
		},
		/*{
			label: data[1].label,
			data: data[1].data,
			points: { show: true }
		},*/
		{
			label: data[2].label,
			data: data[2].data,
			lines: {
				show: true,
				fill: true
			},
			yaxis: 2
		},
		/*{
			label: data[3].label,
			data: data[3].data,
			yaxis: 4,
			points: { show: true }
		}*/], series_options);
	}

	// chart tooltip
	$("<div id='tooltip' style='font-weight: bold'></div>").css({
		position: "absolute",
		display: "none",
		border: ".1em solid #fdd",
		padding: ".5em",
		backgroundColor: "slategray",
		opacity: 0.80
	}).appendTo("body");

	$("#h_chart").bind("plotclick", function(event, pos, item) {
		console.log(item);
		// axis coordinates for other axes, if present, are in pos.x2, pos.x3, ...
		// if you need global screen coordinates, they are pos.pageX, pos.pageY
		if (item) {
			h_plot.highlight(item.series, item.datapoint);
			alert("You clicked a point!");
		}
	});

	$("#p_chart").bind("plothover", plot_hover);
	$("#h_chart").bind("plothover", plot_hover);

	function plot_hover(event, pos, item) {
		if (item) {
			var x = item.datapoint[0];
			y = item.datapoint[1];
			$("#tooltip").html(y + " " + item.series.label)
				.css({
					top: item.pageY + 5,
					left: item.pageX + 5
				})
				.fadeIn(200);
		} else {
			$("#tooltip").hide();
		}
	}
	// Initially, display only hourly data 
	// and data from this pay period

	// Stats Data
	period = 0;
	queryVars = {
		'function': 'offerit_display_stats',
		'period_index': period,
		'period' : period_map[period],
		'dashboard_summary': 1,
		'dashboard_multi': undefined
	};
	var stats_data = call_data(queryVars);
	// Graph Data
	// Period data
	queryVars = {
		'function': 'offerit_display_stats',
		'period_index': period,
		'period' : period_map[period],
		'dashboard_summary': undefined,
		'dashboard_multi': 1,
		'identifier': 'raw_hits'
	};
	var summary_data = call_data(queryVars);

	// Hourly data
	period = 8;
	queryVars = {
		'function': 'offerit_display_hourly_hits',
		'period' : period, 
		'return_type': 'json',
		'time_format': 'hour',
		'identifier': 'impression'
	};
	var hourly_hits = call_data(queryVars);
	/*queryVars['function'] = 'offerit_display_hourly_sales';
	var hourly_sales = call_data(queryVars);
*/

	// Object.keys(series_data['p_series']).forEach(function(key, index) {
	// 	label_series(series_data['p_series'], metrices);
	// }, series_data['p_series']);

	/////////////////////////////////////
	//                                 //
	//  stats-box rendering functions  //
	//                                 //
	/////////////////////////////////////
	function fill_stats(data) {
		var container = $('.stats-container');
		var boxes = container.find('.stats-box');
		var target_text, target_data, extracted_data;
		$.each(boxes, function insert_data() {
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
					extracted_data = '$ ' + extracted_data;
					break;
				case 'EPC':
					extracted_data = data['total_payout'] / data['raw_hits'];
					extracted_data = add_decimals(extracted_data);
					extracted_data = '$ ' + extracted_data;
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
{/literal}