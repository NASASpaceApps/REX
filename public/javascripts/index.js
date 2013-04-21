google.load('visualization', '1.0', {'packages':['corechart']})
$(document).ready(function() {
	$("#location").focus();
	//Clicking the get started button
	$("#about").bind("click", function(e) {
		e.preventDefault();
		if ($(".about_picture").css("display") == "none")
			$(".about_picture").css("display", "inline-block");
		else
			$(".about_picture").css("display", "none");
	})
	$(".get_started_button").bind("click", function(e) {
		//Stopping the default mouse behaviour
		e.preventDefault();

		var ratings = {};

		//Don't allow a transition if the coordinates aren't set (user hasn't hit enter)
		if (!coordinates[0] && !coordinates[1]) {
			if ($("#location").val() != "")
				codeAddress($("#location").val(), $(".map_canvas"));
			else {
				$("#location").attr("placeholder", "Please enter a location first.")
				return
			}
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
						$(".landingMain").append(data);
						$(".background_image").css("opacity", "0");


						//Now animate the stuff from the right inwards
						setTimeout(function() {
							$(".location_home").addClass("location_home_animate");
							$('.overview_columns').addClass("animate_left_no3d");
							//initializing some rankings
							var highest = 0;
							var best = ""
							var count = 1;
							var highcount = 0;

							//Now we fill in all of these rankings (the circles) and determine whos best
							$("#wind_column").find(".rating_circle").each(function() {
								
								if (count <= ratings.windRating) {
									$(this).css("background-color", "#9FCE62");
									highcount += 1;
								} 
								if(highest < highcount) {
									highest = highcount;
									best = "WIND POWER"
								}
								count += 1;
							})

							//Solar info
							count = 1;
							highcount = 0;
							$("#solar_column").find(".rating_circle").each(function() {
								
								if (count <= ratings.solarRating) {
									$(this).css("background-color", "#9FCE62");
									highcount += 1;
								}
								if(highest < highcount) {
									highest = highcount;
									best = "SOLAR POWER"
								}
								count += 1;
							})

							//Geo info
							count = 1;
							highcount = 0;
							$("#geo_column").find(".rating_circle").each(function() {
								
								if (count <= ratings.geoRating) {
									$(this).css("background-color", "#9FCE62");
									highcount += 1;
								}
								if(highest < highcount) {
									highest = highcount;
									best = "GEOTHERMAL"
								}
								count += 1;
							})
							//Yay! Show who is the bestest.
							$(".winner_large").html(best)
						}, 100);

						//Returning to landing page

						//Just reverse what we did to show this stuff. animate out and in.
						$(".location_home").bind("click", function(e) {
							e.preventDefault();
							$("#location").focus();
							$("#location").val("");
							$(".background_image").css("opacity", "1");
							$(".location_home").remove();
							$(".overview_columns").removeClass("animate_left_no3d");
							$(".title").removeClass("animate_left")
							$(".map_bar").removeClass("animate_left")
							setTimeout(function() {
								$(".overview_columns").remove();
							}, 1000)
						})

						//Clicking on an information column.
						$(".column").click(function(e) {
							if (!($(e.target).hasClass("column"))) {
								$(e.target).parent().trigger("click");
								return
							}


							if ($(e.target).hasClass("disabled"))
								return
							//$(e.target).addClass("disabled");
							//$(e.target).css("opacity", "1");
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

							//Sliding the summary block n.
							var id = e.target.id;
							console.log(id)
							var left = $("#" + id).position().left;
							var top = $("#" + id).position().top;
							$("#" + id).clone().appendTo(".overview_columns").css({"position": "absolute", "top": top + "px", "left": left + "px",
								"-webkit-transition": "all 1s ease"}).addClass("slide_column")
						
							//Disable the functionality of the other columns
							$(".column").each(function() {
								if (!($(this).hasClass("slide_column")))
									$(this).addClass("disabled");
							})

							//Clicking the back button during the summary
							$(".slide_column").click(function(e2) {
								if (!($(e2.target).hasClass("column"))) {
									$(e2.target).parent().trigger("click");
									return
								}

								//Remove the summary container
								$(e2.target).css("left", "-150%");
								$(".summaryContainer").css("left", "150%");

								$(".column").each(function() {
									$(this).removeClass("disabled");
								})
								setTimeout(function() {
									$(e2.target).remove();
									$(".summaryContainer").remove();
								
								}, 1000)
								
							})

							//This is getting the data we pull in for the summary
							setTimeout(function() {
								$.ajax({
									type: "get",
									url: "/summary",
									success: function(data) {
										$(".overview_columns").append(data);

										//Done loading!
										$(".loading_spinner").remove();
										setTimeout(function() {
											//$(".slide_column").css({"left": "12.5%", "margin-left": "3%", "margin-right": "3%"});
											$(".slide_column").css({"left": "4.7%", "margin-left": "3%", "margin-right": "3%"});

											//$(".summaryContainer").css("left", "29.4%");
											$(".summaryContainer").css("left", "21.6%");

											$(".slide_column").find(".next_container").find("img").css("-webkit-transform", "rotateY(180deg)");
											$(".slide_column").find(".next_container").html("BACK" + $(".slide_column").find(".next_container").html().slice(4));
											//$("#predict_button").find("img").click(function() {
											console.log(resource)
											if (resource == "wind") {
												$("#kwhTitle").html((ratings.windInfo[0].unit / 1000).toFixed(2) + " kwh/m&#178;");
												//$("#fun_fact").html("Between 2008 and 2012, wind power has provided 36.5% of all new generating capacity in the United States.")
												$("#enviro_text").html("<div class='powFactor'> 0 </div> <br> CO2 emissions")
												$("#money_text").html("<div class='powFactor'>30% </div> <br> Tax Rebate in Nevada <br> ")
												//$(".prof_links").html("<a href='http://www.advancedgreenbuilders.com'>Advanced Green Builders</a> <br> <br><a href='http://www.awstruepower.com/'>AWS True Power</a>")
											} else if (resource == "solar") {
												$("#kwhTitle").html(ratings.solarInfo[0].unit + " kwh");
												//$("#fun_fact").html("Every hour the sun beams onto Earth more than enough energy to satisfy global energy needs for an entire year.")
												$("#enviro_text").html("<div class='powFactor'>80,000</div> <br> Lbs Less Carbon Dioxide Emissions")
												$("#money_text").html("<div class='powFactor'>50%</div> <br> Tax Invencentives & Rebates")

												//$(".prof_links").html("<a href='http://www.suntreksolar.com/'>Suntrek</a> <br> <br><a href='http://www.planitsolar.com/ '>Plan It Solar</a>") 
											} else if (resource == "geo") {
												//$("#fun_fact").html("At the core of the Earth, thermal energy is created by radioactive decay and temperatures may reach over 5000 degrees Celsius (9,000 degrees Fahrenheit).")
												$("#enviro_text").html("<div class='powFactor'>72%</div> <br> Lower Energy Consumption")
												$("#money_text").html("<div class='powFactor'>$1.00</div>  <br> To Heat or Cool a 2000sq ft home for a day")

												//$(".prof_links").html("<a href='http://www.silverstaterenewables.com/'>Silver State Renewables, Inc</a> <br> <br><a href='http://www.quantumgeothermal.com/'>Quantum Geothermal</a>")
												$("#kwhTitle").html(ratings.geoInfo[0].unit + " &deg;C/m");
											}

											//Close the map. Make it fancy. Slide.
											function closemap() {
												$(".prof_map").html("");
												$("#close_map").css("display", "none");
												$("#map_legend").css("display", "none");
											}
											$("#close_map").click(closemap);
											$(".prof_links").find("a").click(function() {
												if ($(".prof_map").html() != "") {
													closemap();
												} else {
													$("#close_map").css("display", "inline-block");
													$("#map_legend").css("display", "inline-block");
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
								}); //timeout
							}, 1000);

							})
						}
					});
			}
		});
	});


});