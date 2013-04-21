
/**
 * Module dependencies.
 */

var express = require('express')
  , solar = require('./controllers/solar.js')
  , wind = require('./controllers/wind.js')
  , geothermal = require('./controllers/geothermal.js')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');


var app = express();

app.configure(function(){
//// Testing of output only
//  var myEnergy = new solar();
//  myEnergy.getPrediction(1,1,function(message){console.log("SOLAR-BB-TEST: ",message);});
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  //app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/ajax', routes.ajax);
app.get('/overview', routes.overview);
app.get('/summary', routes.summary);
app.post('/sendCoordinates', routes.sendCoordinates)


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
