const global = require('./SCRIPTS/global.js');
	jsSql = require('./SCRIPTS/sql.js'),
	jsUser = require('./SCRIPTS/user.js');

var sessionMiddleware = global.session({
	secret: process.env.SIO_Secret,
	resave: false,
	saveUninitialized: true,
	cookie: { secure: true }
});

global.io.use(function (socket, next) {
	sessionMiddleware(socket.request, socket.request.res, next);
});
global.app.use(sessionMiddleware);
global.app.use(global.cookieParser());

global.app.get('/', (req, res) => {
	res.redirect('https://garrettspage.com');
});

jsUser.socketHandler();