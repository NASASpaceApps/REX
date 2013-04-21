
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
  res.render('index', { title: 'REX-Renewable Energy Explorer' });
};
exports.ajax = function(req, res){ 
	res.render('ajax', {});
}
exports.overview = function (req, res) {
	res.render('overview', {});
}
exports.sendCoordinates = function (req, res){
	console.log(req.body);
	//solarObject.getEverything(function(a) {
	//	console.log(a);
	//});
}