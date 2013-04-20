$(document).ready(function() {
	$(".get_started_button").bind("click", function(e) {
		e.preventDefault();
		console.log(coordinates)

		$.ajax({
			type: 'post',
			url: '/sendCoordinates',
			data: {data: coordinates},
			success:function() {
				console.log('sent');
			}
		});

		$.ajax({
			type: 'get',
			url: '/overview',
			success: function(data) {
				$(".title").addClass("animate_left");
				$(".map_bar").addClass("animate_left");

				$("body").prepend("<a class='location_home' href='#'><div class='location_name'>Waterloo, On</div></a>")
				$(".landingMain").append(data);
				setTimeout(function() {
					$('.overview_columns').addClass("animate_left_no3d");
				}, 100);
				$("body").css({"background-color": "#EEEEEE", "background-image": "none"})

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
					if ($(e.target).hasClass("disabled"))
						return
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
									$(".summaryContainer").css("left", "29.5%");
								}, 1);
							}
						});
					}, 1000);

				})
			}
		});
	});

	console.log("test");


});