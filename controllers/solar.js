var returnFun;

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
		returnFun = callback;
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
	solar.prototype.getRatingCallback = function(data) {
		console.log("solar: getRatingCallback ");
		if(!data[0]){ // Data not available
			console.log("solar: getRatingCallback: input data is empty")
			returnFun(-1);
		}else if(data[0].unit < 2000){ // Low
			returnFun(1);
		}else if(data[0].unit < 4000){ // Moderate
			returnFun(2);
		}else if(data[0].unit < 5000){ // Good
			returnFun(3);
		}else if(data[0].unit < 6000){ // Very Good
			returnFun(4);
		}else{ // Excellent
			returnFun(5);
		}
	};
	
	return solar;
})();

module.exports = solar;
