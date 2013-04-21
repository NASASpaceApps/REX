var geothermalReturnFun;

var geothermal = (function() {
	// constructor
	function geothermal(){
		var database = require("../models/database.js");
		this._databaseConn = new database();
		var energy = require("./energy.js");
		this._parent = new energy("geothermal");
	};

	// Returns whole database content
	geothermal.prototype.getEverything = function(callback) {
		console.log("geothermal: getEverything");
		this._parent.getEverything(callback)
	};

	// Returns whole database content
	geothermal.prototype.get = function(userLongitude, userLatitude, callback) {
		console.log("geothermal: get");
		this._parent.get(userLongitude, userLatitude, callback)
	};

	// Returns the closest matching point based on the simple algorithm documented on wiki
	geothermal.prototype.getRating = function(userLongitude, userLatitude, callback) {
		console.log("geothermal: getRating", userLongitude, userLatitude);
		geothermalReturnFun = callback;
		this._databaseConn.query("SELECT (ABS(" + this._databaseConn.escape(userLongitude) + " - longitude) + ABS(" + this._databaseConn.escape(userLatitude) + " - latitude)) AS closeness, longitude, latitude, minDepth, unit FROM `geothermal` ORDER BY closeness ASC LIMIT 1", this.getRatingCallback)
	}
	/**
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 **/
	geothermal.prototype.getRatingCallback = function(data) {
		console.log("geothermal: getRatingCallback ", data);
		if(!data[0]){ // Data not available
			console.log("geothermal: getRatingCallback: input data is empty")
			geothermalReturnFun(-1);
		}else{
			var minDepthRating;
			if(data[0].minDepth < 6){
				minDepthRating = 3;
			}else if(data[0].minDepth <= 10){
				minDepthRating = 2;
			}else{
				minDepthRating = 1;
			}
			var gradientRating;
			if(data[0].unit < 20){
				gradientRating = 1;
			}else if(data[0].unit < 50){
				gradientRating = 2;
			}else{
				gradientRating = 3;
			}
			if(minDepthRating < gradientRating){
				geothermalReturnFun(minDepthRating);
			}else{
				geothermalReturnFun(gradientRating);
			}
		}
	};
	
	return geothermal;
})();

module.exports = geothermal;
