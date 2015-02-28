
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

	socket.broadcast.emit("your connection has been acknowledged");

  	console.log('socket established');
  	socket.on('disconnect', function(){
    	console.log('socket disconnected');
  	});

	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});

});

http.listen(5000, function(){
	console.log('listening on *:5000');
});
