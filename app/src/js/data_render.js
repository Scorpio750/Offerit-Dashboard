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
		var metrices = {
			'Hourly Data': ['impression', 'conv_count', 'payout', 'EPC'],
			'Period Data': ['raw_hits', 'conv_count', 'total_payout', 'EPC']
		};
		var plots = {
			'#h_chart': undefined,
			'#p_chart': undefined
		};
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
		// counter for # of active series for period plot
		var activeSeries = {
			'#h_chart': undefined,
			'#p_chart': undefined
		};

		// AJAX calls for plot data
		function call_data(queryVars, url) {
			var function_type = queryVars['function'];
			var loader, error_panel;
			// determine which function is being called to retrieve appropriate subpanels
			if (function_type == 'ajax_get_affiliate_top_offers' || function_type == 'ajax_get_network_top_offers' || function_type == 'ajax_get_new_offers') {
				loader = $('#offer-box').find('.loader');
				error_panel = $('#error-offers');
				success_panel = $('#offers-area');
			} else if (function_type == 'offerit_display_stats') {
				if (typeof queryVars['dashboard_multi'] !== "undefined") {
					loader = $('#period-graph').find('.loader');
					error_panel = $('#error-period-graph');
					success_panel = $('#p_chart');
				} else if (typeof queryVars['dashboard_summary'] !== "undefined") {
					loader = $('#stats-panel').find('.loader');
					error_panel = $('#error-stats');
					success_panel = $('#stats-container')
				}
			} else if (function_type == 'offerit_display_hourly_hits') {
				loader = $('#hourly-graph').find('.loader');
				error_panel = $('#error-hourly-graph');
				success_panel = $('#h_chart');
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
					if (data || data.length > 0) {
						console.log('=======================');
						console.log('QUERYVARS:');
						console.log(queryVars);
						console.log('DATA:');
						console.log(data);
						error_panel.addClass('hidden');
						success_panel.removeClass('hidden');

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
								if ($('#swap2 > span').css('display') != 'none' /* || $('#swap1').find('span').eq(0).css('display') != 'none'*/ ) {
									console.log('changing state to user');
									state_change = true;
								}
								display_offers(data, queryVars['type'], 'user', state_change);
								break;
							case 'ajax_get_network_top_offers':
								console.log($('#swap2 > span').css('display'));
								console.log($('#swap2').find('span').eq(0).css('display'));
								if ($('#swap2 > span').css('display') == 'none' /* || $('#swap1').find('span').eq(0).css('display') != 'none'*/ ) {
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
										var identifier = metrices[timespan][subindex];
										if (identifier == 'conv_count' || identifier == 'EPC') {
											// continue;
										}
										series_data[timespan][period][subindex] = create_axes(
											data['stats']['date'],
											series_data[timespan][period][subindex],
											identifier
										);
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
						return;
					}
					// data is null or empty, call error handler
					error_handler(success_panel, error_panel);
				}
			});
		}

		function error_handler(success_panel, error_panel) {
			console.log('Error Panel: ' + error_panel + '\nSuccess Panel' + success_panel);
			success_panel.addClass('hidden');
			error_panel.removeClass('hidden');
		}

		function build_hourly_series(hits_data, timespan, queryVars, url) {
			// build series for Hits
			series_data[timespan][0] = create_axes(
				hits_data,
				series_data[timespan][0],
				metrices[timespan][0]
			);
			queryVars.function = 'offerit_display_hourly_sales';
			$.getJSON(url, queryVars, function store_hourly_data(data) {
				if (data) {
					// build conversions series
					for (var i = 1; i < 4; i++) {
						series_data[timespan][i] = create_axes(
							data,
							series_data[timespan][i],
							metrices[timespan][i]
						);
					}
					plot_name = '#h_chart';
					plot_graph(plot_name, series_data[timespan]);
				}
			});
		}
		// creates the axes from the ajax data and stores them in the appropriate series object
		function create_axes(ajax_data, series, identifier) {
			// EPC has to be all *special*
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
			console.log('plotting data...');
			console.log(data);
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

			// add index for each series
			for (var i in data) {
				data[i].idx = i;
			}
			// clear data before replotting
			data[2].yaxis = 2;
			data[3].yaxis = 2;
			if (typeof plots[plot_name] === 'undefined') {
				plots[plot_name] = $.plot(plot_name, data, {
					series: {
						lines: {
							show: true,
							fill: true
						},
						points: {
							show: false
						}
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
						backgroundOpacity: 0.7,
						labelFormatter: function format_label(label, series) {
							return '<a style="color: #555; font-weight: light;" href="" class="legendIndex" data-index="' + series.idx + '">' + label + '</a>';
						}
					}
				});
			}
			plots[plot_name].setData(data);
			plots[plot_name].setupGrid();
			plots[plot_name].draw();
			default_series_setup(plot_name);
		}

		// default display is Hits and Payouts
		function default_series_setup(plot_name) {
			console.log('rendering default display...');
			var $labels = $(plot_name + ' .legend').find('.legendIndex');
			activeSeries[plot_name] = 2;
			$labels.each(function render_default_display() {
				console.log($(this));
				console.log($(this).data('index'));
				console.log($(this).data('index') % 2);
				console.log('activeSeries: ' + activeSeries[plot_name]);
				switch ($(this).data('index') % 2) {
					case 0:
						// make active
						$(this).addClass('selected');
						break;
					case 1:
						// make inactive
						console.log('making ' + $(this).text() + ' inactive');
						togglePlot(plot_name, $(this));
						console.log($(this));
						$(this).addClass('inactive');
						break;
				}
			});
		}

		//////////////////////////////////////
		//                                  //
		//     PLOT AUXILIARY FUNCTIONS     //
		//                                  //
		//////////////////////////////////////

		// chart tooltip
		$("<div id='tooltip' style='font-weight: bold'></div>").css({
			position: "absolute",
			display: "none",
			border: ".1em solid #fdd",
			padding: ".5em",
			backgroundColor: "aliceblue",
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

		highlightPlot = function(plot_name, seriesIdx) {
			var someData = plots[plot_name].getData();
			$.each(someData, function(index, series) {
				someData[index].lines.lineWidth = (index == seriesIdx ? 4 : 2);
			});
			plots[plot_name].setData(someData);
			plots[plot_name].draw();
		}

		// series toggle functions
		togglePlot = function(plot_name, $label) {
			console.log('toggling data...');
			console.log(plot_name);
			console.log($label);
			var $labels = $(plot_name + ' .legend').find('.legendIndex'),
				seriesIdx = $label.data('index'),
				someData = plots[plot_name].getData(),
				series = someData[seriesIdx],
				plotTypes = ['lines', 'points', 'bars'];

			$.each(plotTypes, function(index, plotType) {
				if (series[plotType]) {
					if (series[plotType].show) {
						series[plotType].show = false;
						series[plotType].hidden = true;
						if ($label.hasClass('selected')) {
							$label.removeClass('selected');
						}
						activeSeries[plot_name]--;
						// reactivate inactive plots
						if (activeSeries[plot_name] < 2) {
							$labels.each(function makeActive() {
								if ($(this).hasClass('inactive')) {
									$(this).removeClass('inactive');
								}
							});
						}
						return;
					} else if (series[plotType].hidden) {
						series[plotType].show = true;
						series[plotType].hidden = false;
						$label.addClass('selected');
						activeSeries[plot_name]++;
						// fade out inactive labels if there are two active series
						if (activeSeries[plot_name] == 2) {
							$labels.each(function makeInactive() {
								if (!$(this).hasClass('selected')) {
									$(this).addClass('inactive');
								}
							});
						}
						return;
					}
				}
			});

			// redrawing the graph will render $label useless, so we save the state of the legend
			// and replace the new legend with the old one after redraw
			var $cachedLegend = $(plot_name).find('.legend').clone();
			plots[plot_name].setData(someData);
			plots[plot_name].setupGrid();
			plots[plot_name].draw();

			// nuke label
			$(plot_name).find('.legend').remove();
			console.log($cachedLegend);
			$cachedLegend.appendTo(plot_name);
		}

		$(document).on({
			click: function() {
				togglePlot('#p_chart', $(this));
				return false;
			},
			mouseover: function() {
				highlightPlot('#p_chart', $(this).data('index'));
			},
			mouseout: function() {
				highlightPlot('#p_chart', -1);
			},
		}, '#p_chart a.legendIndex');

		$(document).on({
			click: function() {
				togglePlot('#h_chart', $(this));
				return false;
			},
			mouseover: function() {
				highlightPlot('#h_chart', $(this).data('index'));
			},
			mouseout: function() {
				highlightPlot('#h_chart', -1);
			},
		}, '#h_chart a.legendIndex');