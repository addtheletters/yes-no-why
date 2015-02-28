
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

function initGame(){
	var game = {name:"IS GAME"};

	game.dt = 1000 / 1000; // in seconds, time between ticks
	game.users = [];
	game.entities = [];
	game.state = "DEFAULT_STATE";

	game.recieveControl = function(user, input){
		console.log("game (" + this.name + ") recieved input control [" + input + "] from user (" + user + ")");
		// make control input do something
	}

	game.getDisplayData = function(){
		// get game info, displayable by client
		return this.entities;
	}

	game.tick = function(){
		// update game state
		console.log("game state updated");
		var abla = this.name;
		io.emit("game data", abla);
	}

	game.startGame = function(){
		// start game lol
		setInterval(this.tick, this.dt*1000);
	}

	return game;
}


var game = initGame();
game.startGame();

var sockets = {};
var allUserIDs = [];

function getAllDictElms( tag, dictionary ){
	var retelms = []
	for (elm in dictionary) {
	    if (!dictionary.hasOwnProperty(elm)) {
	        continue;
	    }
	    retelms.push(elm);
	}
	return retelms;
}

function removeFromArray(arr, elm){
	var dex = arr.indexOf(elm);
	if(dex > -1){
		array.splice(index, 1);
		return true;
	}
	else{
		return false;
	}
}


app.get('/', function(req, res){
	res.sendFile(__dirname + '/ballclient.html');
});

io.on('connection', function(socket){

	socket.broadcast.emit("your connection has been acknowledged");
  	console.log('a user connected');
	console.log("# open sockets: "+getAllDictElms(sockets).length);

  	socket.on('disconnect', function(){
    	console.log('user disconnected');
    	if(!sockets.remove(this)){
    		console.log("something went wrongly. failed to remove socket");
    	}
		console.log("# open sockets: "+sockets.length);
  	});

	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});

	socket.on('say to someone', function(id, msg){
	    socket.broadcast.to(id).emit('my message', msg);
	});

	socket.on('control', function(input){
		console.log('control input recieved: ' + input);
		game.recieveControl(input);
	});

	socket.on('set id', function(id){
		if(connected.indexOf(id) >= 0){
			console.log("user attempted to set id to " + id + " but id is already connected");
			console.log("connected user IDs: " + connectedUserIDs);
			console.log("all time user IDs: " + allUserIDs);
		}
		else{
			currentUserIDs.push(id);
			if(allUserIDs.indexOf(id) < 0){
				allUserIDs.push(id);
			}
		}
	});


});


http.listen(5000, function(){
	console.log('listening on *:5000');
});





