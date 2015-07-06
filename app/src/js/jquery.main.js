$(function(){
	//THIS IS THE JS USED ON ALL OF THE PAGES OF THE AFFILIATE AREA
	
	$("#reset_rss").click(function(){
		var btns= {};
		btns[$(this).attr('data-yes')]=true;
		btns[$(this).attr('data-no')]=false;
		
		$.prompt($(this).attr('data-prompt'),{
				buttons:btns,
				callback: function(v,m,f){
			    if(v){
						var url = "submit.php?submit_function=submit_reset_rss_pass&location=internal&page=account&variable_array[]=rss_reset&rss_reset[pass]=1";
						$(location).attr('href',url);
			    }
			    else return false;	    	
			  }  		
		});
	});
	
	//giv our admin links at the bottom a slide up action
	$('#footer .head, #footer .block').hover(function(){
		$("#footer .slide-block").animate({top: '-100px'},{duration:'fast', queue: false});
	}, function(){
		$("#footer .slide-block").animate({top: '0px'},{duration:'fast', queue: false});
	});
	
	//give our navigation menu a nice drop down
	$("#nav li").hover(function(){
		$(this).children(".sub-nav").each(function(){
			$(this).show();
		});
		$(this).children(".sub-nav-child").each(function(){
			var parwid = $(this).parent().width();
			$(this).css({ "left": parwid+"px" });
			$(this).show();
		});
	}, function(){
		$(this).children("ul").hide();
	});
	
	//let any element be hidden
	$(".heading .open-close").click(function(){
		var curId = $(this).attr('id');
		var idParts = curId.split('-');
		if(idParts[0] == 'tog'){
			$(".disp-"+idParts[1]).slideToggle(50);
		}
		var curbtn = $(">span", this);
		$(this).parent().parent().siblings(".content").slideToggle(50, function(){
			var curdisp = $(this).css('display');
			if(curdisp == 'none'){
				curbtn.addClass("open-plus");
				curbtn.html("+");
				var setVal = "1";
			}
			else{
				curbtn.removeClass("open-plus");
				curbtn.html("-");
				var setVal = "0";
			}
			if(curId){
				if(idParts[1]) curId = idParts[1];
				//ajax update the setting
				$.post('ajax_data.php', { 'function': 'ajax_update_affiliate_setting', 'setting': curId, 'value': setVal });
			}
		});
		return false;
	});
	
	$(".tools .button").hover(function(){
		$(this).children("ul").show();
	}, function(){
		$(this).children("ul").hide();
	});

	//allow the closing of an action message
	$(".close-action").click(function(){
		$(this).parent().parent().remove();
		return false;
	});

	//allow the minizing of a page description
	$(".min-page-desc").click(function(){
		var curId = $(this).attr('id');
		var curbtn = $(this);
		$(this).parent().siblings('p').slideToggle(50, function(){
			var curdisp = $(this).css('display');
			if(curdisp == 'none'){
				curbtn.addClass("min-page-desc-plus");
				curbtn.html("+");
				var setVal = "1";
			}
			else{
				curbtn.removeClass("min-page-desc-plus");
				curbtn.html("-");
				var setVal = "0";
			}
			if(curId){
				//ajax update the setting
				$.post('ajax_data.php', { 'function': 'ajax_update_affiliate_setting', 'setting': curId, 'value': setVal });
			}
		});
		return false;
	});
	
	//setup the hover affect for the table rows
	$('.hover-row, .last-row').hover(function(){
		var prevRow = $(this).prev();
		var nextRow = $(this).next();
		var prntRowHead = $(this).parent().prev('thead');
		$('.hover-row, .last-row').removeClass('hover-next-row hover-matched-highlight-row hover-matched-row');
		if(prevRow.hasClass('hover-row') || prevRow.hasClass('last-row')){
			prevRow.addClass('hover-next-row');
			if($(this).hasClass('two-layer-top')){
				if($(this).hasClass('light-highlight-row')) nextRow.addClass('hover-matched-highlight-row');
				else nextRow.addClass('hover-matched-row');
				prevRow.prev().addClass('hover-next-row');
			}
			else if($(this).hasClass('two-layer-bottom')){
				if($(this).hasClass('light-highlight-row')) prevRow.addClass('hover-matched-highlight-row');
				else prevRow.addClass('hover-matched-row');
				if(prevRow.prev().hasClass('hover-row')){
					prevRow.prev().addClass('hover-next-row');
					prevRow.prev().prev().addClass('hover-next-row');
				}
				else if(prntRowHead.children('.hover-row') || prntRowHead.children('.last-row')) {
					prntRowHead.children('.hover-row').addClass('hover-next-row');
				}
			}
		}
		else if(prntRowHead.children('.hover-row')) {
			prntRowHead.children('.hover-row').addClass('hover-next-row');
			if($(this).hasClass('two-layer-top')){
				if($(this).hasClass('light-highlight-row')) nextRow.addClass('hover-matched-highlight-row');
				else nextRow.addClass('hover-matched-row');
			}
			else if($(this).hasClass('two-layer-bottom')){
				if($(this).hasClass('light-highlight-row')) prevRow.addClass('hover-matched-highlight-row');
				else prevRow.addClass('hover-matched-row');
			}
		}
	}, function(){
		var prevRow = $(this).prev();
		var nextRow = $(this).next();
		var prntRowHead = $(this).parent().prev('thead');
		if(prevRow.hasClass('hover-row') || prevRow.hasClass('last-row')){
			prevRow.removeClass('hover-next-row');
			if($(this).hasClass('two-layer-top')){
				nextRow.removeClass('hover-matched-row hover-matched-highlight-row');
				prevRow.prev().removeClass('hover-next-row');
			}
			else if($(this).hasClass('two-layer-bottom')){
				prevRow.removeClass('hover-matched-row hover-matched-highlight-row');
				if(prevRow.prev().hasClass('hover-row')){
					prevRow.prev().removeClass('hover-next-row');
					prevRow.prev().prev().removeClass('hover-next-row');
				}
				else if(prntRowHead.children('.hover-row') || prntRowHead.children('.last-row')) {
					prntRowHead.children('.hover-row').removeClass('hover-next-row');
				}
			}
		}
		else if(prntRowHead.children('.hover-row')) {
			prntRowHead.children('.hover-row').removeClass('hover-next-row');
			if($(this).hasClass('two-layer-top')){
				nextRow.removeClass('hover-matched-row hover-matched-highlight-row');
			}
			else if($(this).hasClass('two-layer-bottom')){
				prevRow.removeClass('hover-matched-row hover-matched-highlight-row');
			}
		}
	});
	
	$(".hover-row input, .last-row input").hover(function(){
		var curRow = $(this).parents('.hover-row, .last-row');
		var prevRow = curRow.prev();
		var prntRowHead = curRow.parent().prev('thead');
		
		if(prevRow.hasClass('hover-row')){
			prevRow.addClass('hover-next-row');
			if(curRow.hasClass('two-layer-top')){
				if(curRow.hasClass('light-highlight-row')) curRow.next().addClass('hover-matched-highlight-row');
				else curRow.next().addClass('hover-matched-row');
				prevRow.prev().addClass('hover-next-row');
			}
			else if(curRow.hasClass('two-layer-bottom')){
				if(curRow.hasClass('light-highlight-row')) prevRow.addClass('hover-matched-highlight-row');
				else prevRow.addClass('hover-matched-row');
				if(prevRow.prev().hasClass('hover-row')){
					prevRow.prev().addClass('hover-next-row');
					prevRow.prev().prev().addClass('hover-next-row');
				}
				else if(prntRowHead.children('.hover-row') || prntRowHead.children('.last-row')) {
					prntRowHead.children('.hover-row').addClass('hover-next-row');
				}
			}
		}
		else if(prntRowHead.children('.hover-row')) {
			prntRowHead.children('.hover-row').addClass('hover-next-row');
			if(curRow.hasClass('two-layer-top')){
				if(curRow.hasClass('light-highlight-row')) curRow.next().addClass('hover-matched-highlight-row');
				else curRow.next().addClass('hover-matched-row');
			}
			else if(curRow.hasClass('two-layer-bottom')){
				if(curRow.hasClass('light-highlight-row')) prevRow.addClass('hover-matched-highlight-row');
				else prevRow.addClass('hover-matched-row');
			}
		}
	});

	var myTimer = {};
	/** 
	 * Function used to display an image on a mouse over
	 *  @params: obj: The dom object that was hovered over
	 *
	 * 8071		- Show the image faster to prevent firefox from always showing/hiding the image
	**/
	function start_mouse_over_images(obj){
		
		var myimagebox = obj;
		// Set the timer for 2 seconds
		// myTimer = $.timer(100,function(){	// (10507: TEMP REMOVAL) 
			myimagebox.children('.mouseover_image').children('img').show(100);
		// }); 									// (10507: TEMP REMOVAL) 
		
		if($(this).parents('.hover-row, .last-row')){
		
			var curRow = obj.parents('.hover-row, .last-row');
			var prevRow = curRow.prev();
			var prntRowHead = curRow.parent().prev('thead');
			
			if(prevRow.hasClass('hover-row') || prevRow.hasClass('last-row')){
				prevRow.addClass('hover-next-row');
				if(curRow.hasClass('two-layer-top')){
					if(curRow.hasClass('light-highlight-row')) curRow.next().addClass('hover-matched-highlight-row');
					else curRow.next().addClass('hover-matched-row');
					prevRow.prev().addClass('hover-next-row');
				}
				else if(curRow.hasClass('two-layer-bottom')){
					if(curRow.hasClass('light-highlight-row')) prevRow.addClass('hover-matched-highlight-row');
					else prevRow.addClass('hover-matched-row');
					if(prevRow.prev().hasClass('hover-row')){
						prevRow.prev().addClass('hover-next-row');
						prevRow.prev().prev().addClass('hover-next-row');
					}
					else if(prntRowHead.children('.hover-row') || prntRowHead.children('.last-row')) {
						prntRowHead.children('.hover-row').addClass('hover-next-row');
					}
				}
			}
			else if(prntRowHead.children('.hover-row')) {
				prntRowHead.children('.hover-row').addClass('hover-next-row');
				if(curRow.hasClass('two-layer-top')){
					if(curRow.hasClass('light-highlight-row')) curRow.next().addClass('hover-matched-highlight-row');
					else curRow.next().addClass('hover-matched-row');
				}
				else if(curRow.hasClass('two-layer-bottom')){
					if(curRow.hasClass('light-highlight-row')) prevRow.addClass('hover-matched-highlight-row');
					else prevRow.addClass('hover-matched-row');
				}
			}
		}
		return false;
	}
	
	/** 
	 * Function used to remove a mouse over image
	 *  @params: obj: The dom object that was hovered over
	 *
	 * 8071		- Hide the image faster to prevent firefox from always showing/hiding the image
	**/
	function end_mouse_over_images(obj){
		obj.children('.mouseover_image').children('img').hide(100);
		$.clearTimer(myTimer);
		return false;
	}
	
	/**
	 *  JQuery Function to redeclare the mouse over event listeners
	 *  	Used to have mouse over images after an ajax call
	**/
	$.fn.redeclare_mouseover = function(){
		$(".mouseover_display_image").hover(function(){
			start_mouse_over_images($(this));
		}, function(){
			end_mouse_over_images($(this));
		});
	};
	
	//display mouseover images
	$(".mouseover_display_image").hover(function(){
		start_mouse_over_images($(this));
	}, function(){
		end_mouse_over_images($(this));
	});
	
	//allow help box tooltips	
	$(".helpbtn").tooltip({
		offset: [-20, 97],
		delay: 100,
		layout: '<div><div class="tooltip-arrow-border"></div><div class="tooltip-arrow"></div><div class="tooltip-hover-helper"></div></div>'
	}).dynamic({left: {offset: [-20,67]}});

	// 7380 - Start
	//	 - Remove the actual link / target / href from all the helpbtn links.
	//	 	This will ensure that you can not click through to the support tabs
	// 9272 - Added the ability to override a helpbtn link from being hidden
	$("a.helpbtn")
	   .each(function()
	   { 
		  if(!$(this).hasClass("nohide")){
			  this.href = "#";
			  $(this).attr("target","_self");
			  $(this).attr("onClick","return false;");
			}
	   });

	// 7380 - End
	
	if ($('.shared-selectAll').length) {
	    setTimeout(function() {
			$(".shared-selectAll").focus(function() { $(this).select() });
			$(".shared-selectAll").mouseup(function(e){
				e.preventDefault();
			});
	    }, 10);
	}
	
	// This will select all the content of an input box
	// Ex: <div class="fn-select-all-text-in-element">Some Text</div>
	$(document.body).delegate('.fn-select-all-text-in-element', 'click', function(e){ selectElementText(this); });
	
});

/**
 * Custom JQuery function to parse variables after a hash in the query string (#var1=asd&var2=asd)
 *  - Also sets given variables to be included after the hash
 *
 *
 example:
 
 	// loads variables from the hash string
 	var data = $.hashParser();    // returns an array of key => value from the query string
 	
 	// sets data into the hash url:
 	$.hashParses({
 		command: 'update',
 		data: 'var1=asdfasdf&var2=asdfasdf&var3=qwe123'
 	});
 
 *
 * So you can load the URL Data and manipulate any variables on the page accordingly.  
 * Then after the pages JS runs, you can update the hash string.
 *
 * @author: Adam Ciesla
**/
(function( $ ){

	var variables = {};
	var defaults = {};

	/**
	 * Function to parse a hash and set the variable values in the variable array
	 * @return: The variable array after the hash string has been parsed out
	**/
	function parseHash() {
		var hash = document.location.hash.substring(1);
		var hashParts = hash.split("&");
		var values = {};
		
		// Loop through the values of the has and store them in our values array
		$.each(hashParts, function(key, value){
			var valueParts = value.split("=");
			values[valueParts[0]] = valueParts[1];
		});
		
		// our mapping of values to variables
		//Loop through our values and update the variables accordingly
		$.each(values, function(key, value){
			variables[key] = value;
		});
		
		return variables;
	}
	
	/**
	 * Function to update our variables array with the new values given
	 * @param: vars: The array of variables to set in the hash
	 * @return: The variable array after it has been updated with new values
	**/
	function updateHash(vars){
		$.each(variables, function(key, value){
			if(vars[key])
				variables[key] = vars[key];
			else
				variables[key] = value;
		});
		return variables;
	}
	
	/**
	 * Function to build the new hash URL
	 * @params: vars: the variable array you would like a hash string created from
	 * @return: The full URL including the hash string
	**/ 
	function buildHashString(vars){
		var url = document.location.href.split("#")[0];
		var values = variables;
		var newHash = '';
		var first = 1;
		
		$.each(values, function(key, value){	

			// If this is in our defaults array, don't add it. 
			if(defaults[key] == value)
				return true;  // Move onto the next variable
			
			// separate vars in hash by '&'
			if(!first)
				newHash += "&";
				
			// add the variable if it exists
			if(vars[key])
				newHash += key + "=" + vars[key];
			
			first = 0; // Set first to 0 so we can add '&' between vars
		});
			
		// return the new hash string
		return url + "#" + newHash;
	}
	
	/**
	 * Function to update the hash data variables to the newest values
	 * @param: vars: The variables to set into our main data array
	 *
	**/
	function updateData(vars){
		var data = vars.split("&");
		$.each(data, function(key, value){
			var dataParts = value.split("=");
			variables[dataParts[0]] = dataParts[1];
		});
	}


	/**
	 * Function to take the entered default values and store them
	 *  - These values are used so we do not place default values into the query string
	 * @param: vars: The array of variables and their default values (variable => default_val)
	**/
	function setDefaults(vars){
		$.each(vars, function(key, value){
			defaults[key] = value;
		});
	}

	/**
	 * main function that is called to run commands
	 *
	**/
	$.fn.hashParser = function(options) {
		
		// if no options are passed in, set the array
		if(!options) options = {};
		
		// if data is entered, update it
		if(options['data']){
			updateData(options['data']);
		}
		
		// set the users defaults
		if(options['defaults']){
			setDefaults(options['defaults']);
		}
		
		// Check if we have a command
		if(options['command']){
			
			// command to update the hash url and send the user there
			if(options['command'] == "update"){
				variables = updateHash(variables);
				url = buildHashString(variables);
				window.location = url;
				return true;
			}
			else{
				return "Unrecognized Command";
			}
			
		}
		else{
			// initialize
			variables = parseHash();
			return variables;
		}
		
	};
  
})( jQuery );

// Original Source: http://stackoverflow.com/questions/985272/selecting-text-in-an-element-akin-to-highlighting-with-your-mouse/2838358#2838358
// Examples:
//	 selectElementText(document.getElementById("someElement"));
//	 selectElementText(elementInIframe, iframe.contentWindow);
function selectElementText(el, win) {
	console.log("selectElementText called");
    win = win || window;
    var doc = win.document, sel, range;
    if (win.getSelection && doc.createRange) {
		console.log("win.getSelection");
        sel = win.getSelection();
        range = doc.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (doc.body.createTextRange) {
		console.log("doc.body.createTextRange");
        range = doc.body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
}