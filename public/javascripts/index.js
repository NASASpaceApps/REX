$(document).ready(function() {
$(".get_started_button").bind("click", function(e) {
	e.preventDefault();
	console.log('clicked')
	$.ajax({
		type: 'get',
		url: '/overview',
		success: function(data) {
			$(".landingMain").html(data)
		}
	});
});
console.log("test");
});