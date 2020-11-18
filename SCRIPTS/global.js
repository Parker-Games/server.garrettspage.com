const express = require('express'),
	socket = require('socket.io'),
	mysql = require('mysql'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	cors = require('cors');

var app = express();
var server = app.listen(8443, function () {
	console.log("Started Listening");
});

const options = {
 cors:true,
 origins:["https://private.garrettspage.com"],
}

exports.db = mysql;
exports.socket = socket;
exports.mysql = mysql;
exports.cookieParser = cookieParser;
exports.app = app;
exports.session = session;
exports.io = socket(server, options);