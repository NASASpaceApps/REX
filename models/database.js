
var mysql = require('db-mysql');

var database = (function() {
	// "private" variables 
	var _isConnected = false;
	var _connection;

	// constructor
	function database(){
		if(!_isConnected){
			this.connect();
		}
		
	};
	
	// add the methods to the prototype so that all of the 
	// Foo instances can access the private static
	database.prototype.connect = function()
		_connection = new Sequelize('rex', 'root'[, 'xampp'])
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
	database.prototype.query = function(onSuccessFun)
		_connection.query('select 1 as `foo.bar.baz`').success(onSuccessFun})
	}
	
	return database;
})();

