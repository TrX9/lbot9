'use strict';
var express  = require('express'),
bodyParser   = require('body-parser'),
http         = require('http'),
config       = require('./Config.js'),
server       = express(),
mongoose     = require('mongoose'),
TeamInfo     = require('./API/Models/TeamInfo.js'), //created model loading here
GameSchedule = require('./API/Models/GameSchedule.js');
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.set('port', (process.env.PORT || 80))
var routes = require('./API/Routes/Routes.js'); //importing route
routes(server); //register the route
server.listen(server.get('port'), function () {
    console.log("Server is up and listening on port" + server.get('port'));
});