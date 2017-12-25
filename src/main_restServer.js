var express = require('express');
var mongoose = require('mongoose'); // mongoose is ODM (Object Data Mapper) nodeJS module for mongodb
var bodyParser = require('body-parser'); // bodyParser used to serialize incoming request body to objects. This puts incoming JSON, x-www-form-urlencoded, ... inputs to request.body
var cors = require('cors'); // cors is to allow cross origin requests

var teacherRestRouter = require('./rest/route/teacherRestRouter');

var teacherMongodbCollection = mongoose.connect("mongodb://localhost/TeachersDb");

// Set CORS variables 
var corsWhiteListDomains = ['http://localhost:4200']; // let an angular app running on default port 4200 come through
var corsOptionsDelegate = function(req, callback) {
    var corsOptions;
    if (corsWhiteListDomains.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }; // ALLOW - enable the requested origin in CORS response for this request
    } else {
        corsOptions = { origin: false }; // STOP - disable CORS for this request.
    }
    callback(null, corsOptions); // 1st arg is error, 2nd options
};

var app = express();
app.use(cors(corsOptionsDelegate)); // Allow cross origin requests coming from domains in corsWhiteListDomains
app.use(bodyParser.urlencoded({ extended: true })); // To parse application/x-www-form-urlencoded, coming from form POSTs
app.use(bodyParser.json()); // To parse application/json coming from REST clients
app.use('/api/v1/teachers', teacherRestRouter);
app.use('/fdu/api/v1/teachers', teacherRestRouter);

var portNumber = 9016;
app.listen(portNumber, function() {
    console.log("REST server running on port %s", portNumber);
});