// 
var returnFun;

var solar = (function() {
	// constructor
	function solar(){
		var database = require("../models/database.js");
		this._databaseConn = new database();
	};
	
	// add the methods to the prototype so that all of the 
	// Foo instances can access the private static
	solar.prototype.getEverything = function(callback) {
		console.log("solar: getEverything");
		returnFun = callback;
		this._databaseConn.query("SELECT longitude, latitude, unit FROM `solar`", this.getEverythingCallback)
	};
	solar.prototype.getEverythingCallback = function(rows) {
		console.log("solar: getEverythingCallback");
	    returnFun(rows);
	};
	
	return solar;
})();

module.exports = solar;