$.ajax({
	type: 'get',
	url: '/ajax',
	success: function(data) {
		$(".button").html(data)
	}
});
console.log("test");