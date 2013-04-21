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
		console.log("geothermal: getRating");
		geothermalReturnFun = callback;
		this._parent.get(userLongitude, userLatitude, this.getRatingCallback)
	}
	/**
	 * kWh/m2/day    Resource Potential
	 * < 1 - 3         Low        
	 * < 3 - 4         Moderate        
	 * > 4 - 5         Good           
	 * > 5 - 6         Very Good      
	 * > 6             Excellent      
	 **/
	geothermal.prototype.getRatingCallback = function(data) {
		console.log("geothermal: getRatingCallback ");
		if(!data[0]){ // Data not available
			console.log("geothermal: getRatingCallback: input data is empty")
			geothermalReturnFun(-1);
		}else if(data[0].unit < 2000){ // Low
			geothermalReturnFun(1);
		}else if(data[0].unit < 4000){ // Moderate
			geothermalReturnFun(2);
		}else if(data[0].unit < 5000){ // Good
			geothermalReturnFun(3);
		}else if(data[0].unit < 6000){ // Very Good
			geothermalReturnFun(4);
		}else{ // Excellent
			geothermalReturnFun(5);
		}
	};
	
	return geothermal;
})();

module.exports = geothermal;
