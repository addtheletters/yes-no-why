var Ball = function(x, y, radius, color, id, parent){
	this.fabricObj = new fabric.Circle({
		radius: radius, fill: color, left: x - radius, top: y - radius
	});
	this.pos = vec.createVec(x, y);
	this.vel = vec.createVec(0, 0);
	this.rad = radius;
	this.id = id;
	this.color = color;

	this.drag = 0.1;

	this.parent = parent;
}
	Ball.prototype.update = function(delta){
		this.pos = vec.sum(this.pos, vec.scale(this.vel, delta));
		var mag = vec.magnitude(this.vel);
		if(mag > 0.001){
			this.vel = vec.scale(this.vel, 1-this.drag); //drag
		}
		else{
			this.vel = vec.createVec();
		}
	}
	Ball.prototype.getTopLeft = function(){
		return vec.createVec(this.pos.x - this.rad, this.pos.y - this.rad);
	}
	Ball.prototype.updateFabric = function(){
		var topleft = this.getTopLeft();
		this.fabricObj.left = topleft.x;
		this.fabricObj.top  = topleft.y;
	}
	Ball.prototype.getMass = function(){
		return Math.pi*Math.pow(this.rad, 2);
	}
	Ball.prototype.isHittingBall = function(other_ball){
		return vec.distSquared(this.pos, other_ball.pos) <= Math.pow( this.rad + other_ball.rad, 2 );
	}
	Ball.prototype.addVelocity = function( plusvel ) {
		this.vel = vec.sum(this.vel, plusvel);
	};

function Game(canvas, topleft, size, killFunc){
	var self = this;

	self.canvas = canvas;
	self.name = "Bounce";
	self.dt = 20 / 1000; // in seconds, time between ticks
	self.users = [];
	self.balls = [];
	self.inputs = {};

	self.defaultRad = 10;
	self.bounciness = .5;
	self.splitPenalty = 0.7;
	
	self.minCoords = vec.createVec(topleft.x, topleft.y);
	self.maxCoords = vec.createVec(size.x, size.y);

	self.killFunc = killFunc;

	self.borderAllowance = 0; // how far out you are allowed to go from the border before getting killed. negative = killed before reaching border

	self.getCenter = function(){
		return vec.scale( vec.sum(self.minCoords, self.maxCoords), 0.5 );
	}

	self.addBall = function(x, y, radius, color, id, parent){
		var theBall = new Ball(x, y, radius, color, id, parent);
		self.balls.push(theBall);
		self.canvas.add(theBall.fabricObj);
		theBall.fabricObj.hasControls = false;
		return theBall;
	}

	self.removeBall = function(id){
		var ball = self.balls.splice( self.balls.indexOf(self.findBallById(id)), 1 )[0];
		canvas.remove(ball.fabricObj);
		return ball;
	}

	self.findBallById = function(id){
		for(var i = 0; i < self.balls.length; i++){
			if(id == self.balls[i].id){
				return self.balls[i];
			}
		}
		return null;
	}

	self.pushInput = function(id, accel){
		self.inputs[id] = accel;
	}

	self.applyInputs = function(){
		// inputs is structure {id:accel}
		for(possibleID in self.inputs){
			if (self.inputs.hasOwnProperty(possibleID)) {
		        var ball = self.findBallById(possibleID);
				if(ball){
					ball.addVelocity(self.inputs[possibleID]);
				}
				else{
					//console.log("Failed to apply input to ball id " + possibleID);
				}
		    }
		}

		self.inputs = {};
	}

	self.getCurrentCollisions = function(){
		var ret = [];
		for(var i = 0; i < self.balls.length; i++){
			self.balls[i].hit = {};
			for(var j = 0; j < self.balls.length; j++){
				self.balls[i].hit[j] = false;
			}
		}
		for(var i = 0; i < self.balls.length; i++){
			for(var j = 0; j < self.balls.length; j++){
				if(i == j){
					continue;
				}
				if(self.balls[i].isHittingBall(self.balls[j]) && !self.balls[j].hit[i]){
					self.balls[i].hit[j] = true;
					self.balls[j].hit[i] = true;
					ret.push([i, j]);
				}
			}
		}
		return ret;
	}

	self.handleCollisions = function(collisions){
		//console.log("handling collisions " + collisions);
		for(var i = 0; i < collisions.length; i++){
			self.applyCollision(self.balls[collisions[i][0]], self.balls[collisions[i][1]]);
		}
	}

	self.shouldKill = function(ball){
		if( ball.pos.x < self.minCoords.x - self.borderAllowance || ball.pos.x > self.maxCoords.x + self.borderAllowance ){
			return true;
		}
		if( ball.pos.y < self.minCoords.y - self.borderAllowance || ball.pos.y > self.maxCoords.y + self.borderAllowance ){
			return true;
		}
		return false;	
	}

	self.updateWorld = function(){
		self.handleCollisions(self.getCurrentCollisions());
		for(var i = 0; i < self.balls.length; i++){
			if(self.shouldKill(self.balls[i])){
				killFunc(self.balls[i].id);
				continue;
			}
			self.balls[i].update(self.dt);
		}
	}

	self.renderGame = function(){
		for(var i = 0; i < self.balls.length; i++){
			self.balls[i].updateFabric();
		}
		self.canvas.renderAll();
	}

	self.tick = function(){
		self.applyInputs();
		self.updateWorld();
		self.renderGame();
	}

	self.startGame = function(){
		return setInterval(self.tick, self.dt*1000);
	}

	self.applyCollision = function(body1, body2){
		// elastic collision!
		var deltapos = vec.subtract(body1.pos, body2.pos);
		while( vec.magnitudeSquared(deltapos) == 0 ){
			deltapos = vec.createVec(Math.random()-0.5, Math.random()-0.5);
		}
		deltapos = vec.normalize(deltapos); // to a unit direction vector
		// getting components of velocity parallel to collision direction
		var parallel1mag = vec.dotProd(body1.vel, deltapos); 
		var parallel2mag = vec.dotProd(body2.vel, deltapos);

		var u1 = vec.normalize(deltapos, -parallel1mag);
		var u2 = vec.normalize(deltapos, parallel2mag);

		var v1 = vec.scale( vec.sum( vec.scale(u1, body1.getMass() - body2.getMass()) , vec.scale( u2, 2*body2.getMass() ) ),
			self.bounciness* 1/(body1.getMass() + body2.getMass()) );

		var v2 = vec.scale( vec.sum( vec.scale(u2, body2.getMass() - body1.getMass()) , vec.scale( u1, 2*body1.getMass() ) ),
			self.bounciness* 1/(body1.getMass() + body2.getMass()) );
		body1.addVelocity(  vec.scale( deltapos,  vec.magnitude(vec.subtract(v1, u2) )*1.5) );
		body2.addVelocity(  vec.scale( deltapos, -vec.magnitude(vec.subtract(v2, u1) )*1.5)  );
	}
}

var game;
var gameinterval;

var pss;
var socketToBallID ;//= {}; //{PSC:ball}
var ballIDToSocket ;//= {}; //{ball:PSC}

var colors;//= ['blue', 'green', 'red', 'yellow', 'magenta', 'cyan'];
var colorUses;// = [0, 0, 0, 0, 0, 0];
var splitBufferSize;

function randStartPos(){
	var dcoords = vec.subtract( game.maxCoords, game.minCoords );
	return vec.createVec( game.minCoords.x + Math.random()*dcoords.x, game.minCoords.y + Math.random()*dcoords.y );
}

function randRareColor(){
	var ind = colorUses.indexOf(Math.min.apply(null, colorUses));
	colorUses[ind] += 1;
	return colors[ind];
}

function invalidParent(parent){
	return !parent || parent=="null";
}

function addPlayer(parent, PSC, UID){
	var pos;
	var ball;
	var color;
	var rad;
	var vel = vec.createVec();

	if(invalidParent(parent)){
		pos = randStartPos();
		color = randRareColor();
		rad = game.defaultRad;
		console.log(rad);
	}
	else{
		var parball = game.findBallById(parent);
		console.log("parent at id " + parent);
		console.log(parball);
		pos  = parball.pos;
		color= parball.color;
		// puts ball next to original, in direction of the center
		parball.rad = parball.rad * game.splitPenalty;
		rad  = parball.rad;

		var distCenter = vec.subtract( game.getCenter() , pos );
		if(vec.magnitudeSquared(distCenter) == 0){
			pos = vec.sum( pos,  vec.createVecPolar(parball.rad * 2 + splitBufferSize, Math.random() * 2 * Math.PI ) );
		}
		else{
			pos = vec.sum( pos, vec.normalize( distCenter, parball.rad * 2 + splitBufferSize ) );
		}
		
		parball.fabricObj.radius = parball.rad;
		
		vel = vec.createVec(parball.vel.x, parball.vel.y);

		console.log("parball");
		console.log(parball.pos);
	}
	console.log("childball");
	console.log(pos);

	ball = game.addBall( pos.x, pos.y, rad, color, UID, parent);
	socketToBallID[PSC] = UID;
	ballIDToSocket[UID] = PSC;
	return ball;
}

function removePlayer(playerID){
	game.removeBall(playerID);
	if(pss.clients[playerID]){
		pss.clients[playerID] = null;
		//pss.clients[playerID].ws.close();
	}
}

function controlInput(id, msg){
	// parse and push inputs to game
	game.pushInput(id, vec.createVec(Number(msg[1]), Number(msg[2])));
}


$(window).load( function(){

game = new Game(new fabric.Canvas("c"), vec.createVec(0,0), vec.createVec(1000, 600), function(playerID){ removePlayer(playerID) });
//game.addBall(120, 120, 20, 'yellow', 0);
//game.addBall(420, 120, 20, 'green', 1);

gameinterval = game.startGame();
inputScale = 5;

pss = new PSServer("ws://pilotdcrelay.herokuapp.com");
socketToBallID = {}; //{PSC:ball}
ballIDToSocket = {}; //{ball:PSC}

colors = ['blue', 'green', 'red', 'yellow', 'magenta', 'cyan'];
colorUses = [0, 0, 0, 0, 0, 0];

splitBufferSize = 2;

/*function uniqueID(){
  	return '_' + Math.random().toString(36).substr(2, 9);
}*/



pss.onName = function(UID){
	console.log("pss.UID = "+UID);
}
pss.onConnect = function(PSC) { //PseudoSocketConnection

	console.log(PSC.UID+" connected!")

	PSC.send("request info");

	PSC.onData = function(data) {
		console.log(PSC.UID+" sent: "+data);
		var msg = data.split(" ");
		if (msg[0] == "echo") {
			PSC.send(msg[1]);
			return
		}
		
		if (msg[0] == "join"){
			console.log("attempting to add player");
			addPlayer(msg[1], PSC, PSC.UID);
			PSC.send("acknowledgement sucessful-connect " + PSC.UID);
		}

		if (msg[0] == "input"){
			controlInput( PSC.UID, msg );
		}
	}

	PSC.onClose = function() {
		console.log(PSC.UID+" disconnected!");
		removePlayer(PSC.UID);
		console.log("Remaining Clients ", pss.clients)
	}

}
});
