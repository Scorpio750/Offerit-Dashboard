$(document).ready(function() {

		//////////////////////////////////
		//                              //
		//   FLOT RENDERING FUNCTIONS   //
		//                              //
		//////////////////////////////////

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

		var metrices = {
			'Hourly Data': ['impression', 'conv_count', 'payout', 'EPC'],
			'Period Data': ['raw_hits', 'conv_count', 'total_payout', 'EPC']
		};
		var plots = {
				'#h_chart': undefined,
				'#p_chart': undefined
			},
			series_data;


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
		function call_data(queryVars, url) {
			var function_type = queryVars['function'];
			var loader;

			// determine which function is being called to place appropriate loader
			// not very DRY, but I'm not sure how else to implement this considering
			// we evaluate function type upon completion of ajax call as well
			if (function_type == 'ajax_get_affiliate_top_offers' 
				|| function_type == 'ajax_get_network_top_offers'
				|| function_type == 'ajax_get_new_offers') {
				loader = $('#offer-box').find('.loader');
			}
			else if (function_type == 'offerit_display_stats') {
				if (typeof queryVars['dashboard_multi'] !== "undefined") {
					loader = $('#period-graph').find('.loader');
				}
				else if (typeof queryVars['dashboard_summary'] !== "undefined") {
					loader = $('#stats-panel').find('.loader');
				}
			}
			else if (function_type == 'offerit_display_hourly_hits') {
				loader = $('#hourly-graph').find('.loader');
			}

			$.ajax({
				dataType: 'json',
				url: url,
				data: queryVars,
				beforeSend: function loading() {
					$(loader).fadeIn('fast');
				},
				complete: function unloading() {
					$(loader).fadeOut('fast');
				},
				success: function store_data(data) {
					if (data) {
						console.log(data);
						series_data = {
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
						// add subseries for each metric option
						label_series(series_data['Hourly Data']);
						for (var i in series_data['Period Data']) {
							label_series(series_data['Period Data'][i]);
						}
						var timespan,
							state_change = false;
						switch (function_type) {
							// Offers panel data
							case 'ajax_get_affiliate_top_offers':
								// check to see if either the words 'New' or 'Network' are already displayed
								console.log($('#swap2 > span').text() + ': ' + $('#swap2 > span').css('display'));
								if ($('#swap2 > span').css('display') != 'none'/* || $('#swap1').find('span').eq(0).css('display') != 'none'*/) {
									console.log('changing state to user');
									state_change = true;
								}
								display_offers(data, queryVars['type'], 'user', state_change);
								break;

							case 'ajax_get_network_top_offers':
								console.log($('#swap2 > span').css('display'));
								console.log($('#swap2').find('span').eq(0).css('display'));
								if ($('#swap2 > span').css('display') == 'none'/* || $('#swap1').find('span').eq(0).css('display') != 'none'*/) {
									console.log('changing state to network');
									state_change = true;
								}
								display_offers(data, queryVars['type'], 'network', state_change);
								break;

							case 'ajax_get_new_offers':
								if ($('#swap1 > span').eq(1).css('display') == 'none') {
									state_change == true;
								}
								display_offers(data, 'new', '', state_change);
								break;

							case 'offerit_display_stats':
								// period graph data
								if (typeof queryVars['dashboard_multi'] !== "undefined") {
									timespan = 'Period Data';

									// loop through and fill each metric subindex
									for (var subindex in metrices[timespan]) {
										series_data[timespan][period][subindex] = create_axes(
											data['stats']['date'],
											series_data[timespan][period][subindex],
											metrices[timespan][subindex]);
									}
									plot_name = "#p_chart";
									plot_graph(plot_name, series_data[timespan][period]);
									break;
								}

								// stats-box data
								else if (typeof queryVars['dashboard_summary'] !== "undefined") {
									fill_stats(data.total, queryVars['period_index']);
									return;
								}
								break;

								// If we request hits, we build the whole graph,
								// calling hourly_sales internally
							case 'offerit_display_hourly_hits':
								timespan = 'Hourly Data';
								build_hourly_series(data, timespan, queryVars, url);
								break;
						}
					}
				}
			});
		}



		function build_hourly_series(hits_data, timespan, queryVars, url) {
			// build series for Hits	
			series_data[timespan][0] = create_axes(
				hits_data,
				series_data[timespan][0],
				metrices[timespan][0]);

			queryVars.function = 'offerit_display_hourly_sales';
			$.getJSON(url, queryVars, function store_hourly_data(data) {
				if (data) {

					// build conversions series
					for (var i = 1; i < 4; i++) {
						series_data[timespan][i] = create_axes(
							data,
							series_data[timespan][i],
							metrices[timespan][i]);
					}
					plot_name = '#h_chart';
					plot_graph(plot_name, series_data[timespan]);
				}
			});
		}


		// creates the axes from the ajax data and stores them in the appropriate series object
		function create_axes(ajax_data, series, identifier) {

			// EPC has to be all *special*
			// making me do a fucking edgecase and shit
			// Fuck you, EPC... fuck you.
			if (identifier == 'EPC') {
				var epc_val;
				for (var i in ajax_data) {
					if (!ajax_data[i]['total_payout']) {
						epc_val = 0;
					} else if (ajax_data[i]['total_payout'] &&
						!ajax_data[i]['raw_hits']) {
						epc_val = Number(ajax_data[i]['total_payout']);
					} else if (ajax_data[i]['total_payout'] &&
						ajax_data[i]['raw_hits']) {
						epc_val = Number(ajax_data[i]['total_payout']) / Number(ajax_data[i]['raw_hits']);
					}
					series.data.push([ajax_data[i]['name'] * 1000, epc_val]);
				}
			}
			// Everyone else who is not a goddamn special snowflake
			else {
				for (var i in ajax_data) {
					if (typeof ajax_data[i][identifier] === "undefined") {
						ajax_data[i][identifier] = 0;
					}
					series.data.push([ajax_data[i]['name'] * 1000, Number(ajax_data[i][identifier])]);
				}
			}
			return series;
		}

		function plot_graph(plot_name, data) {
			var series_options = {
				series: {
					lines: {
						show: true,
						fill: true
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
				yaxes: [{
					/* first y-axis */
				}, {
					/* second y-axis */
					position: "right"
				}],
				yaxis: {
					min: 0
				},
				grid: {
					color: "slategray",
					borderWidth: 0,
					backgroundColor: "#E6E6E6",
					hoverable: true,
					clickable: false,
					autoHighlight: true,
					markings: weekendAreas
				},
				legend: {
					position: "se",
					backgroundOpacity: 0.5
				}
			}

			// first correct the timestamps - they are recorded as the daily
			// midnights in UTC+0100, but Flot always displays dates in UTC
			// so we have to add one hour to hit the midnights in the plot

			for (var i = 0; i < data.length; ++i) {
				data[i][0] += 60 * 60 * 1000;
			}

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
						},
						color: '#DFDFDF'
					});
					i += 7 * 24 * 60 * 60 * 1000;
				} while (i < axes.xaxis.max);
				return markings;
			}

			// clear data before replotting
			data[2].yaxis = 2;
			data[3].yaxis = 2;
			if (typeof plots[plot_name] === 'undefined') {
				plots[plot_name] = $.plot(plot_name, data, series_options);
			}
			plots[plot_name].setData(data);
			plots[plot_name].setupGrid();
			plots[plot_name].draw();
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
