var energyenergyReturnFun;

var energy = (function() {
	// constructor
	function energy(energyType){
		this._energyType = energyType;
		var database = require("../models/database.js");
		this._databaseConn = new database();
	};
	
	// Returns whole database content
	energy.prototype.getAll = function(callback) {
		console.log("energy: getAll");
		energyReturnFun = callback;
		this._databaseConn.query("SELECT longitude, latitude, unit FROM `" + this._energyType + "`", callback)
	};

	// Returns the closest matching point based on the simple algorithm documented on wiki
	energy.prototype.get = function(userLongitude, userLatitude, callback) {
		console.log("energy: get");
		energyReturnFun = callback;
		this._databaseConn.query("SELECT (ABS(" + this._databaseConn.escape(userLongitude) + " - longitude) + ABS(" + this._databaseConn.escape(userLatitude) + " - latitude)) AS closeness, longitude, latitude, unit FROM `" + this._energyType + "` ORDER BY closeness ASC LIMIT 1", callback)
	};
	
	return energy;
})();

module.exports = energy;