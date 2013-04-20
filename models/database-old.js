
// OBSOLETE since we use sequalize
// Using db-mysql driver for nodejs
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
		_connection = new mysql.Database({
			hostname: 'localhost',
			user: 'root',
			password: 'xampp',
			database: 'rex'
		}).on('error', function(error) {
			console.log('ERROR: ' + error);
		}).on('ready', function(server) {
			console.log('Connected to ' + server.hostname + ' (' + server.version + ')');
		}).connect();
	}
	
	database.prototype.escape = function(data) {
		return _connection.escape(data);
	};
	
	database.prototype.query = function(query) {
		return _connection.query(query);
	};
	
	return Foo;
})();


lattitue 
longitue 
watts/m^2
type
