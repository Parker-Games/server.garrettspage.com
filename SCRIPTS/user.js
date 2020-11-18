const global = require('./global.js'),
	sql = require('./sql.js');

exports.socketHandler = function (io) {
	global.io.on('connection', function (socket) {
		var req = global.socket.request;
		socket.on("acc_send", function(data){
			if (data.user == "")
				return;
			const user = data.user, pass = data.pass;
			sql.query("SELECT * FROM users WHERE Username=?", [user], function(err, rows, fields){
				if(rows.length == 0){
				/* ADD ACCOUNT - DISABLE
					db.query("INSERT INTO users(`Username`, `Password`) VALUES(?, ?)", [user, pass], function(err, result){
					if(!!err)
						throw err;

					//console.log(result);
					socket.emit("logged_in", {user: user});
				});*/
				} else {
					if (rows[0].Status == 0) {
						socket.emit("acc_disabled");
					} else {
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
				}
			});
		});
	});
}