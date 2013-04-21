$(document).ready(function() {
	$(".get_started_button").bind("click", function(e) {
		e.preventDefault();
		console.log(coordinates)
		var ratings = {};

		if (!coordinates[0] && !coordinates[1]) {
			return
		}

		$.ajax({
			type: 'post',
			url: '/sendCoordinates',
			data: {data: coordinates},
			success: function(data) {
				console.log(data);
				console.log('sent');
				ratings.windRating = data.windRating;
				ratings.solarRating = data.solarRating;
				ratings.geoRating = data.geoRating;
				ratings.windInfo = data.windInfo;
				ratings.solarInfo = data.solarInfo;
				ratings.geoInfo = data.geoInfo;

				if (typeof locationName == 'undefined'){
					locationName='Previous Page';
				}

				$.ajax({
					type: 'get',
					url: '/overview',
					success: function(data) {
						$(".title").addClass("animate_left");
						$(".map_bar").addClass("animate_left");

						$("body").prepend("<a class='location_home' href='#'><div class='location_name'>"+locationName+"</div></a>")
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
												$("#kwhTitle").html(ratings.geoInfo[0].unit + " units");
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

										}, 1);
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