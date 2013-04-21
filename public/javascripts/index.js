google.load('visualization', '1.0', {'packages':['corechart']})
$(document).ready(function() {
	$("#location").focus();
	//Clicking the get started button
	$(".get_started_button").bind("click", function(e) {
		//Stopping the default mouse behaviour
		e.preventDefault();

		var ratings = {};

		//Don't allow a transition if the coordinates aren't set (user hasn't hit enter)
		if (!coordinates[0] && !coordinates[1]) {
			$("#location").attr("placeholder", "Please enter a location first.")
			return
		}

		//Sending the coordinates to the server
		$.ajax({
			type: 'post',
			url: '/sendCoordinates',
			data: {data: coordinates},
			success: function(data) {
				console.log(data);
				console.log('sent');

				//Receiving all kinds of information
				ratings.windRating = data.windRating;
				ratings.solarRating = data.solarRating;
				ratings.geoRating = data.geoRating;
				ratings.windInfo = data.windInfo;
				ratings.solarInfo = data.solarInfo;
				ratings.geoInfo = data.geoInfo;

				//Just in case google maps didn't pick up a location name fast enough.
				if (typeof locationName == 'undefined'){
					locationName='Previous Page';
				}

				//Now  the slide-in of the columns and slide-out of the landing.
				$.ajax({
					type: 'get',
					url: '/overview',
					success: function(data) {
						//Get rid of the old stuff
						$(".title").addClass("animate_left");
						$(".map_bar").addClass("animate_left");

						//Make the bg transparent
						$("body").prepend("<a class='location_home' href='#'><div class='location_name'>"+locationName+"</div><img src='images/location white.png'></a>")
						$(".location_home").addClass("location_home_animate");
						$(".landingMain").append(data);
						$(".background_image").css("opacity", "0");

						setTimeout(function() {
							$('.overview_columns').addClass("animate_left_no3d");
							var highest = 0;
							var best = ""
							var count = 1;
							$("#wind_column").find(".rating_circle").each(function() {
								if(highest < count) {
									highest = count;
									best = "WIND POWER"
								}
								if (count <= ratings.windRating) {
									$(this).css("background-color", "#9FCE62");
									console.log("ffff")
								} 
								count += 1;
							})
							count = 1;
							$("#solar_column").find(".rating_circle").each(function() {
								if(highest < count) {
									highest = count;
									best = "SOLAR POWER"
								}
								if (count <= ratings.solarRating) {
									$(this).css("background-color", "#9FCE62");
									console.log("ffff")
								}
								count += 1;
							})
							count = 1;
							$("#geo_column").find(".rating_circle").each(function() {
								if(highest < count) {
									highest = count;
									best = "GEOTHERMAL"
								}
								if (count <= ratings.geoRating) {
									$(this).css("background-color", "#9FCE62");
									console.log("ffff")
								}
								count += 1;
							})
							$(".winner_large").html(best)
						}, 100);

						$(".location_home").bind("click", function(e) {
							e.preventDefault();
							$(".background_image").css("opacity", "1");
							console.log("cliiiiicked")
							$(".location_home").remove();
							$(".overview_columns").removeClass("animate_left_no3d");
							$(".title").removeClass("animate_left")
							$(".map_bar").removeClass("animate_left")
							setTimeout(function() {
								$(".overview_columns").remove();
							}, 1000)
						})

						$(".column").click(function(e) {
							if (!($(e.target).hasClass("column"))) {
								$(e.target).parent().trigger("click");
								return
							}
							if ($(e.target).hasClass("disabled"))
								return
							$(e.target).append("<div class='loading_spinner'><img src='images/loading.gif'></img></div>");
							var resource = "";
							if (e.target.id == "wind_column") {
								resource = "wind"
							}else if (e.target.id == "solar_column"){
								resource = "solar"
							}else if (e.target.id == "geo_column"){
								resource = "geo"
							}
							console.log(resource)


							var id = e.target.id;
							console.log(id)
							var left = $("#" + id).position().left;
							var top = $("#" + id).position().top;
							$("#" + id).clone().appendTo(".overview_columns").css({"position": "absolute", "top": top + "px", "left": left + "px",
								"-webkit-transition": "all 1s ease"}).addClass("slide_column")
						

							$(".column").each(function() {
								if (!($(this).hasClass("slide_column")))
									$(this).addClass("disabled");
							})

							$(".slide_column").click(function(e2) {
								if (!($(e2.target).hasClass("column"))) {
									$(e2.target).parent().trigger("click");
									return
								}
								$(e2.target).remove();
								$(".summaryContainer").remove();
								$(".column").each(function() {
									$(this).removeClass("disabled");
								})
							})

							setTimeout(function() {
								$.ajax({
									type: "get",
									url: "/summary",
									success: function(data) {
										$(".overview_columns").append(data);
										$(".loading_spinner").remove();
										setTimeout(function() {
											$(".slide_column").css({"left": "12.5%", "margin-left": "3%", "margin-right": "3%"});
											$(".summaryContainer").css("left", "29.4%");
											$(".slide_column").find(".next_container").find("img").css("-webkit-transform", "rotateY(180deg)");
											//$("#predict_button").find("img").click(function() {
											
											//})
							       
											console.log(resource)
											if (resource == "wind") {
												$("#kwhTitle").html((ratings.windInfo[0].unit / 1000).toFixed(2) + " kwh/m&#178;");
												$("#fun_fact").html("Between 2008 and 2012, wind power has provided 36.5% of all new generating capacity in the United States.")
												//$(".prof_links").html("<a href='http://www.advancedgreenbuilders.com'>Advanced Green Builders</a> <br> <br><a href='http://www.awstruepower.com/'>AWS True Power</a>")
											} else if (resource == "solar") {
												$("#kwhTitle").html(ratings.solarInfo[0].unit + " kwh");
												$("#fun_fact").html("Every hour the sun beams onto Earth more than enough energy to satisfy global energy needs for an entire year.")
												//$(".prof_links").html("<a href='http://www.suntreksolar.com/'>Suntrek</a> <br> <br><a href='http://www.planitsolar.com/ '>Plan It Solar</a>") 
											} else if (resource == "geo") {
												$("#fun_fact").html("At the core of the Earth, thermal energy is created by radioactive decay and temperatures may reach over 5000 degrees Celsius (9,000 degrees Fahrenheit).")
												//$(".prof_links").html("<a href='http://www.silverstaterenewables.com/'>Silver State Renewables, Inc</a> <br> <br><a href='http://www.quantumgeothermal.com/'>Quantum Geothermal</a>")
												$("#kwhTitle").html(ratings.geoInfo[0].unit + " &#186;C/m");
											}
											function closemap() {
												$(".prof_map").html("");
												$("#close_map").css("display", "none");
											}
											$("#close_map").click(closemap);
											$(".prof_links").find("a").click(function() {
												if ($(".prof_map").html() != "") {
													closemap();
												} else {
													$("#close_map").css("display", "inline-block");
													$(".prof_map").html('<iframe frameborder="no" height="325" scrolling="no" src="https://www.google.com/fusiontables/embedviz?viz=MAP&amp;q=select+col1+from+1uoGR-vX4Wmm76QExw446TXqKqr2oWGu8X1MQmew&amp;h=false&amp;lat=' + coordinates[1]+'&amp;lng=' + coordinates[0] + '&amp;z=11&amp;t=1&amp;l=col1&amp;y=2&amp;tmplt=2" width="200%"></iframe>')
												}
											})
											$("#graph_container").append("<div class='graph_loading'><img src='images/loading3.gif'></img></div>")
										}, 1);
										setTimeout(function() {
											$.ajax({
												type: 'post',
												url: '/predict',
												data: {data: coordinates},
												success: function(d) {
													var yearlyAverages = processData(d);
													console.log(yearlyAverages);
													$("#graph_container").html("");
									        var data = new google.visualization.DataTable();
									        data.addColumn('string', 'Year');
					                data.addColumn('number', 'kwh');
					                var rows = [];
					                for(var i =0; i < yearlyAverages.length; i++) {
					                	rows.push([2005 + i +"", yearlyAverages[i]]);
					                }
					                data.addRows(rows);

					                // Set chart options
					                var options = {'title':'Resource Potential Over Time',
					                               'width':$("#graph_container").width(),
					                               'height':$("#graph_container").height() + 50,
					                             		'colors': ['#9FCE62', '#5eb38c'],
					                             		backgroundColor: '#434343',
					                             		animation: {duration: 3, easing: 'in'},
					                             		hAxis: {title: "Year", titleTextStyle: {color: 'white'}, textStyle: {color: "white"}, baselineColor: 'white', gridlines: {color: 'white'}},
					                             		vAxis: {title: "kwh", titleTextStyle: {color: 'white'}, textStyle: {color: "white"}},
					                             		titleTextStyle: {color: "white"},
					                             		legend: {position: 'none'}
																				};

					                // Instantiate and draw our chart, passing in some options.
					                var chart = new google.visualization.LineChart(document.getElementById('graph_container'));
					                chart.draw(data, options);
					                $("#graph_container").addClass("graph_animate");
												}
											})
										}, 1000)
									}
								});
							}, 1000);

							})
						}
					});
			}
		});
	});

	//var items = (0,9)
	//items[0][0] = 1;
	//items[1][2] =2;

	//console.log(items[0][0]);





});