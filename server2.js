var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');


var User = function(args){
	var self = this;

	self.socket = args.socket;
	self.username = args.username;
}

var Server = function(options){
	var self = this;

	self.io = options.io;
	self.users = [];

	self.init = function(){
		self.io.on('connection', function(socket){
			self.handleConnection(socket);
		});
	}

	self.handleConnection = function(){
		 socket.on('login', function(user_name) {
	     	var nameBad = !user_name;// || username.length < 3 || username.length > 10;

		    // check for badname
		    if (nameBad) {
		    	socket.emit('loginNameBad', user_name);
		        return;
		    }

		    var nameExists = _.some(self.users, function(item) {
		   		return item.username == user_name;
		    });
		 
		    // check for already existing name
		    if (nameExists) {
		        socket.emit('loginNameExists', user_name);
		    } else {
		        // create a new user model
		        var newUser = new User({ username: user_name, socket: socket });
		        // push to users array
		        self.users.push(newUser);
		        // set response listeners for the new user
		        self.setResponseListeners(newUser);
		        // send welcome message to user
		        socket.emit('welcome');
	        	// send user joined message to all users
		        self.io.sockets.emit('userJoined', newUser.username);
		    }
    	}
    	);
	}

	self.setResponseListeners = function(user){
		user.socket.on('disconnect', function(){
			// remove user
			self.users.splice(self.users.indexOf(user), 1);
			self.io.sockets.emit('userLeft', user.username);
		});

		// socket asks who is online
		user.socket.on('onlineUsers', function(){
			var user = _.map(self.users, function(item){
				return item.user;
			});

			user.socket.emit('onlineUsers', users);
		});

		// socket sends message
		user.socket.on('chat', function(chat){
			if(chat){
				self.io.sockets.emit('chat', {sender:user.username, message:chat});
			}
		});
	}
}

var Sssnake = new Server({io:io}).init();

http.listen(5000, function(){
	console.log('listening on *:5000');
});
