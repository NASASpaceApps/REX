var windReturnFun;

var wind = (function() {
	// constructor
	function wind(){
		var database = require("../models/database.js");
		this._databaseConn = new database();
		var energy = require("./energy.js");
		this._parent = new energy("wind");
	};

	// Returns whole database content
	wind.prototype.getEverything = function(callback) {
		console.log("wind: getEverything");
		this._parent.getEverything(callback)
	};

	// Returns whole database content
	wind.prototype.get = function(userLongitude, userLatitude, callback) {
		console.log("wind: get");
		this._parent.get(userLongitude, userLatitude, callback)
	};

	// Returns the closest matching point based on the simple algorithm documented on wiki
	wind.prototype.getRating = function(userLongitude, userLatitude, callback) {
		console.log("wind: getRating", userLongitude, userLatitude);
		windReturnFun = callback;
		this._parent.get(userLongitude, userLatitude, this.getRatingCallback)
	}
	/**
	 * Wind Power Class  | Wind Power Density (W/m2) | Resource Potential   
	 * -----------------|---------------------------|-----------------------
	 *       1          |           0 - 200         |     Not Available          
	 *       2          |         200 - 300         |       Possible        
	 *       2          |           > 300           |    Highly Probable          
	 **/  
	wind.prototype.getRatingCallback = function(data) {
		console.log("wind: getRatingCallback ", data);
		if(!data[0]){ // Data not available
			console.log("wind: getRatingCallback: input data is empty")
			windReturnFun(-1);
		}else if(data[0].unit < 500){
			windReturnFun(1);
		}else if(data[0].unit < 700){
			windReturnFun(2);
		}else{
			windReturnFun(3);
		}
	};
	
	return wind;
})();

module.exports = wind;
