var solarReturnFun;
var solarDatabaseConn;

var solar = (function() {
	// constructor
	function solar(){
		var database = require("../models/database.js");
		solarDatabaseConn = new database();
		var energy = require("./energy.js");
		this._parent = new energy("solar");
	};

	// Returns whole database content
	solar.prototype.getEverything = function(callback) {
		console.log("solar: getEverything");
		this._parent.getEverything(callback)
	};

	

	// Returns whole database content
	solar.prototype.get = function(userLongitude, userLatitude, callback) {
		console.log("solar: get");
		this._parent.get(userLongitude, userLatitude, callback)
	};

	// Returns the closest matching point based on the simple algorithm documented on wiki
	solar.prototype.getRating = function(userLongitude, userLatitude, callback) {
		console.log("solar: getRating", userLongitude, userLatitude);
		solarReturnFun = callback;
		this._parent.get(userLongitude, userLatitude, this.getRatingCallback)
	}
	/**
	 * kWh/m2/day    Resource Potential
	 * < 1 - 2         Not Available            
	 * > 3 - 4         Possible             
	 * > 5             Highly Probable      
	 **/
	solar.prototype.getRatingCallback = function(data) {
		console.log("solar: getRatingCallback ", data);
		if(!data[0]){ // Data not available
			console.log("solar: getRatingCallback: input data is empty")
			solarReturnFun(-1);
		}else if(data[0].unit < 4000){
			solarReturnFun(1);
		}else if(data[0].unit < 5000){
			solarReturnFun(2);
		}else{
			solarReturnFun(5);
		}
	};

	solar.prototype.getPrediction = function(userLongitude, userLatitude, callback) {
		console.log("solar: getPrediction ", userLongitude, userLatitude);
		solarReturnFun = callback;
		solarDatabaseConn.query("SELECT (ABS(" + solarDatabaseConn.escape(userLongitude) + " - solar_prediction_coordinates.longitude) + ABS(" + solarDatabaseConn.escape(userLatitude) + " - solar_prediction_coordinates.latitude)) AS closeness, solar_prediction_coordinates.longitude, solar_prediction_coordinates.latitude FROM `solar_prediction_coordinates` ORDER BY closeness ASC LIMIT 1", this.getPredictionCallback)
	};
	solar.prototype.getPredictionCallback = function(data) {
		console.log("solar: getPredictionCallback ", data);
		if(!data[0]){
			console.log("solar: getPredictionCallback: input data is empty")
			solarReturnFun(-1);
		}else{
			solarDatabaseConn.query("SELECT solar_prediction_data.week, solar_prediction_data.year, solar_prediction_data.unit FROM `solar_prediction_data` JOIN `solar_prediction_coordinates` ON solar_prediction_coordinates.id = solar_prediction_data.coordinates WHERE solar_prediction_coordinates.longitude=\""+data[0].longitude+"\" and solar_prediction_coordinates.latitude=\""+data[0].latitude+"\" ORDER BY solar_prediction_data.week ASC, solar_prediction_data.year ASC", solarReturnFun)
		}
	};
	
	return solar;
})();

module.exports = solar;
