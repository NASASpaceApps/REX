
/*
 * GET home page.
 */
//var solarjs = require("../controllers/solar.js");
//solarjs.solar.getEverything(function(message) {
//	console.log(message);
//})

//Pull in all the database scripts
var wind = require("../controllers/wind.js");
var windObject = new wind();
var solar = require("../controllers/solar.js");
var solarObject = new solar();
var geo = require("../controllers/geothermal.js");
var geoObject = new geo();
exports.index = function(req, res){
  res.render('index', { title: 'REX-Renewable Energy Explorer' });
};

//ajax!
exports.ajax = function(req, res){ 
	res.render('ajax', {});
}

//The overview (3 columns)
exports.overview = function (req, res) {
	res.render('overview', {});
}
exports.sendCoordinates = function (req, res){
	console.log(req.body);
	//Setting default ratings
	var windRating = 1;
	var solarRating = 1;
	var geoRating = 1;
	//The information tied to the technology.
	var geoInfo;
	var windInfo;
	var solarInfo;

	//The callback waterfall. This is just making sure we have all the data
	//before moving on. I assure you this is O(1) or so....

	//Just runs through all the callbacks to get all of the ratings.
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
							//Now send it back to the callback function.
							res.send({"windInfo": windInfo, "windRating": windRating, "solarInfo": solarInfo, "geoInfo": geoInfo, "solarRating": solarRating, "geoRating": geoRating});
						})
					})
				})
			});
		});

	});
	
	
}

//The summary slide
exports.summary = function(req, res) {
	res.render("summary", {});
}

//Getting the prediction information
exports.predict = function(req, res) {
	var coordinates = [req.body.data[0], req.body.data[1]];
	console.log(coordinates)
	solarObject.getPrediction(coordinates[0], coordinates[1], function(a) {
		//back to the callback with you
			res.send(a)

	});
}