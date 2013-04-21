$(document).ready(function() {
	$(".get_started_button").bind("click", function(e) {
		e.preventDefault();
		console.log(coordinates)
		var ratings = {};


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
						$("body").css({"background-color": "#EEEEEE", "background-image": "none"})

						setTimeout(function() {
							$('.overview_columns').addClass("animate_left_no3d");
						
							var count = 1;
							$("#wind_column").find(".rating_circle").each(function() {
								if (count <= ratings.windRating) {
									$(this).css("background-color", "#9FCE62");
									console.log("ffff")
								} 
								count += 1;
							})
							count = 1;
							$("#solar_column").find(".rating_circle").each(function() {
								if (count <= ratings.solarRating) {
									$(this).css("background-color", "#9FCE62");
									console.log("ffff")
								}
								count += 1;
							})
							count = 1;
							$("#geo_column").find(".rating_circle").each(function() {
								if (count <= ratings.geoRating) {
									$(this).css("background-color", "#9FCE62");
									console.log("ffff")
								}
								count += 1;
							})
						}, 100);

						$(".location_home").bind("click", function(e) {
							e.preventDefault();
							$("body").css({"background-image": "/images/background.png", "background-color": "none"});
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
							var resource = "";
							if (e.target.id == "wind_column")
								resource = "wind"
							else if (e.target.id == "solar_column")
								resource = "solar"
							else if (e.target.id == "geo_column")
								resource = "geo"
							console.log(resource)


							var id = e.target.id;
							console.log(id)
							var left = $("#" + id).position().left;
							var top = $("#" + id).position().top;
							$("#" + id).clone().appendTo(".overview_columns").css({"position": "absolute", "top": top + "px", "left": left + "px",
								"-webkit-transition": "all 1s ease"}).addClass("slide_column")
							
							setTimeout(function() {
							}, 100)

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
										setTimeout(function() {
											$(".slide_column").css({"left": "12.5%", "margin-left": "3%", "margin-right": "3%"});
											$(".summaryContainer").css("left", "29.4%");
											$(".slide_column").find(".next_container").find("img").css("-webkit-transform", "rotateY(180deg)");
											console.log(resource)
											if (resource == "wind") {
												$("#kwhTitle").html(ratings.windInfo[0].unit / 1000 + " kwh/m&#178;");
												$("#fun_fact").html("Between 2008 and 2012, wind power has provided 36.5% of all new generating capacity in the United States.")
												$(".prof_links").html("<a href='http://www.advancedgreenbuilders.com'>Advanced Green Builders</a> <br> <br><a href='http://www.awstruepower.com/'>AWS True Power</a>")
											} else if (resource == "solar") {
												$("#kwhTitle").html(ratings.solarInfo[0].unit + " kwh");
												$("#fun_fact").html("Every hour the sun beams onto Earth more than enough energy to satisfy global energy needs for an entire year.")
											} else if (resource == "geo") {
												$("#kwhTitle").html(ratings.geoInfo[0].unit + " units");
												$("#fun_fact").html("At the core of the Earth, thermal energy is created by radioactive decay and temperatures may reach over 5000 degrees Celsius (9,000 degrees Fahrenheit).")
											}
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