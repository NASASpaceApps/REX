var solarReturnFun;

var solar = (function() {
	// constructor
	function solar(){
		var database = require("../models/database.js");
		this._databaseConn = new database();
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
		console.log("solar: getRating");
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
		}else if(data[0].unit < 2000){
			solarReturnFun(1);
		}else if(data[0].unit < 4000){
			solarReturnFun(2);
		}else{
			solarReturnFun(5);
		}
	};
	
	return solar;
})();

module.exports = solar;
