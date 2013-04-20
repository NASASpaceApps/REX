var solar = (function() {
	// constructor
	function solar(){
	};
	
	// add the methods to the prototype so that all of the 
	// Foo instances can access the private static
	solar.prototype.getEverything = function(returnFun) {
	    this._getEverythingReturnFun = returnFun;
	    returnFun("solar: testing");
	};
	solar.prototype.getEverythingCallback = function(rows) {
	    this._getEverythingReturnFun(rows);
	};
	
	return solar;
})();

module.exports = solar;