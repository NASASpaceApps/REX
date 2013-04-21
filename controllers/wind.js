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
		console.log("wind: getRating");
		windReturnFun = callback;
		this._parent.get(userLongitude, userLatitude, this.getRatingCallback)
	}
	/**
	 * Wind Power Class	 | Wind Power Density (W/m2) | Resource Potential   
	 * -----------------|---------------------------|-----------------------
	 *       1          |           0 - 200         |         Poor          
	 *       2          |         200 - 300         |       Marginal        
	 *       2          |         300 - 400         |         Fair          
	 *       3          |         400 - 500         |         Good            
	 *       3          |         500 - 600         |       Excellent           
	 *       4          |         600 - 800         |      Outstanding          
	 *       5          |           > 800           |        Superb               
	 **/
	wind.prototype.getRatingCallback = function(data) {
		console.log("wind: getRatingCallback ");
		if(!data[0]){ // Data not available
			console.log("wind: getRatingCallback: input data is empty")
			windReturnFun(-1);
		}else if(data[0].unit < 200){ // Poor
			windReturnFun(1);
		}else if(data[0].unit < 400){ // Marginal, Fair
			windReturnFun(2);
		}else if(data[0].unit < 600){ // Good, Excellent
			windReturnFun(3);
		}else if(data[0].unit < 800){ // Outstanding
			windReturnFun(4);
		}else{ // Superb
			windReturnFun(5);
		}
	};
	
	return wind;
})();

module.exports = wind;
