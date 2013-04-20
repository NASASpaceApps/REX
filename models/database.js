var database = (function() {
	// "private" variables 
	var _isConnected = false;
	var _connection;
	
	// constructor
	function database(){
		if(!this._isConnected){
			this.connect();
			this._isConnected = true;
		}
		
	};
	
	// add the methods to the prototype so that all of the 
	// Foo instances can access the private static
	database.prototype.connect = function(){
		var Sequelize = require("sequelize");
		this._connection = new Sequelize('rex', 'root', 'xampp', {
			host: "localhost",
			port: 3306
		})
	}
	
	// Content of first parameter to callback function is below
		  /*
		    [{
		      "foo": {
		        "bar": {
		          "baz": 1
		        }
		      }
		    }]
		  */
	database.prototype.query = function(query, onSuccessFun){
		console.log("database: query: "+query);
		this._connection.query(query).success(onSuccessFun);
	}
	
	return database;
})();

module.exports = database;