function call_data(queryVars, retrieved_data) {
		$.getJSON('http://demo.offerit.com/internal_data.php', queryVars, function(data) {
			if (data) {
				if (queryVars['function'] == 'offerit_display_stats') {
					retrieved_data = data.total;
				} else {
					retrieved_data = data;
				}
			}
		});
		console.log(retrieved_data);
		return retrieved_data;
	}