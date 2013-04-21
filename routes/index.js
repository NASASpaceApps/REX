
/*
 * GET home page.
 */
//var solarjs = require("../controllers/solar.js");
//solarjs.solar.getEverything(function(message) {
//	console.log(message);
//})
var wind = require("../controllers/wind.js");
var windObject = new wind();
var solar = require("../controllers/solar.js");
var solarObject = new solar();
var geo = require("../controllers/geothermal.js");
var geoObject = new geo();
exports.index = function(req, res){
  res.render('index', { title: 'Somethingrather' });
};
exports.ajax = function(req, res){ 
	res.render('ajax', {});
}
exports.overview = function (req, res) {
	res.render('overview', {});
}
exports.sendCoordinates = function (req, res){
	console.log(req.body);
	var windRating = 1;
	var solarRating = 1;
	var geoRating = 1;
	var geoInfo;
	var windInfo;
	var solarInfo;
	windObject.getRating(req.body.data[0], req.body.data[1], function(a) {
		console.log(a);
		windRating = a;
		solarObject.getRating(req.body.data[0], req.body.data[1], function(a) {
			console.log(a);
			solarRating = a;
			geoObject.getRating(req.body.data[0], req.body.data[1], function(a) {
				console.log(a);
				geoRating = a;
				geoObject.get(req.body.data[0], req.body.data[1], function(a) {
					geoInfo = a;
					solarObject.get(req.body.data[0], req.body.data[1], function(a) {
						solarInfo = a;
						windObject.get(req.body.data[0], req.body.data[1], function(a) {
							windInfo = a;
							res.send({"windInfo": windInfo, "windRating": windRating, "solarInfo": solarInfo, "geoInfo": geoInfo, "solarRating": solarRating, "geoRating": geoRating});
						})
					})
				})
			});
		});

	});
	
	
}
exports.summary = function(req, res) {
	res.render("summary", {});
}