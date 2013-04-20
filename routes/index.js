
/*
 * GET home page.
 */
//var solarjs = require("../controllers/solar.js");
//solarjs.solar.getEverything(function(message) {
//	console.log(message);
//})
var solar = require("../controllers/solar.js");
var solarObject = new solar();
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
	solarObject.getRating(req.body.data[0], req.body.data[1], function(a) {
		console.log(a);
	});
}
exports.summary = function(req, res) {
	res.render("summary", {});
}