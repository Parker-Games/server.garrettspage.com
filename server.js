const express = require('express'),
	socket = require('socket.io'),
	mysql = require('mysql'),
	cookieParser = require('cookie-parser'),
	session = require('express-session');
var app = express();

var server = app.listen(8443, function () {
	console.log("Started Listening");
	dbHandler();
});

/*app.get('/', (req, res) => {
	res.redirect('https://garrettspage.com');
});*/

var io = socket(server);

var sessionMiddleware = session({
  secret: process.env.SIO_Secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
});

io.use(function (socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});
app.use(sessionMiddleware);
app.use(cookieParser());

const config = {
  "host": process.env.SQL_Host,
  "user": process.env.SQL_User,
  "password": process.env.SQL_Pass,
  "base": process.env.SQL_Base
};

var db = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.base
});

function dbHandler(){
	db.connect(function (error) {
		if (!!error)
			throw error;

		console.log('MySQL Connected');
	});

	db.on('error', function onError(err) {
		console.log('db error', err);
		if (err.code == 'PROTOCOL_CONNECTION_LOST') {
			dbHandler();
		} else {
			throw err;
		}
	});
}

io.on('connection', function (socket) {
	var req = socket.request;
	socket.on("acc_send", function(data){
	if (data.user == "")
		return;
	const user = data.user, pass = data.pass;
	db.query("SELECT * FROM users WHERE Username=?", [user], function(err, rows, fields){
		if(rows.length == 0){
			/*
			db.query("INSERT INTO users(`Username`, `Password`) VALUES(?, ?)", [user, pass], function(err, result){
			if(!!err)
				throw err;

			//console.log(result);
			socket.emit("logged_in", {user: user});
		});*/
		} else {
			if (rows[0].Status == 0)
				socker.emit("acc_disabled");
			const dataUser = rows[0].Username, dataPass = rows[0].Password;
			if(dataPass == null || dataUser == null){
				socket.emit("acc_error");
			}
			if(user == dataUser && pass == dataPass){
				socket.emit("acc_authed", {user: user});
				req.session.userID = rows[0].id;
				req.session.save();
			}else{
				socket.emit("acc_invalid");
			}
		}
	});
});
});