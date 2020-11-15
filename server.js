var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
	res.redirect('https://garrettspage.com');
});

io.on('connection', (socket) => {
  console.log('A user connected');
});

http.listen(8080, () => {
  console.log('Started Server');
});