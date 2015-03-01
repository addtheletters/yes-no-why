
var Ball = function(x, y, radius, color, id){
	this.fabricObj = new fabric.Circle({
		radius: radius, fill: color, left: x - radius, top: y - radius
	});
	this.pos = vec.createVec(x, y);
	this.vel = vec.createVec(0, 0);
	this.rad = radius;
	this.id = id;
	this.color = color;
}
	Ball.prototype.update = function(delta){
		this.pos = vec.sum(this.pos, vec.scale(this.vel, delta));
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

function Game(canvas){
	var self = this;

	self.canvas = canvas;
	self.name = "Bounce";
	self.dt = 20 / 1000; // in seconds, time between ticks
	self.users = [];
	self.balls = [];
	self.bounciness = .5;
	self.inputs = {};

	self.addBall = function(x, y, radius, color, id){
		var theBall = new Ball(x, y, radius, color, id);
		self.balls.push(theBall);
		self.canvas.add(theBall.fabricObj);
		theBall.fabricObj.hasControls = false;
		return theBall;
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

	self.updateWorld = function(){
		self.handleCollisions(self.getCurrentCollisions());
		for(var i = 0; i < self.balls.length; i++){
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

var keyEnum = {
	W_Key:87,
	S_Key:83,
	D_Key:68,
	A_Key:65,
	Up_Key:38,
	Down_Key:40,
	Left_Key:37,
	Right_Key:39,
};

var keyState = {};

window.onkeydown = function(e){
	keyState[e.keyCode] = true;
}
window.onkeyup = function(e){
	keyState[e.keyCode] = false;
}

function isKeyDown(keyCode){
	return keyState[keyCode];
}


$(window).load(function() {
	var game = new Game(new fabric.Canvas("c"));
	game.addBall(120, 120, 20, 'yellow', 0);
	game.addBall(420, 120, 20, 'green', 1);

	var gameinterval = game.startGame();
	var inputScale = 5;

	function inputCollect(){
		//console.log("HELLOOOO");

		var p0NetInput = vec.createVec(0, 0);
		if(isKeyDown(keyEnum.W_Key)){
			p0NetInput = vec.sum(p0NetInput, vec.createVec(0, -1));
		}
		if(isKeyDown(keyEnum.S_Key)){
			p0NetInput = vec.sum(p0NetInput, vec.createVec(0, 1));
		}
		if(isKeyDown(keyEnum.A_Key)){
			p0NetInput = vec.sum(p0NetInput, vec.createVec(-1, 0));
		}
		if(isKeyDown(keyEnum.D_Key)){
			p0NetInput = vec.sum(p0NetInput, vec.createVec(1, 0));
		}
		//console.log(p0NetInput.x, p0NetInput.y);
		if(vec.magnitudeSquared(p0NetInput) != 0){
			game.pushInput(0, vec.normalize(p0NetInput, inputScale));
		}

		var p1NetInput = vec.createVec(0, 0);
		if(isKeyDown(keyEnum.Up_Key)){
			p1NetInput = vec.sum(p1NetInput, vec.createVec(0, -1));
		}
		if(isKeyDown(keyEnum.Down_Key)){
			p1NetInput = vec.sum(p1NetInput, vec.createVec(0, 1));
		}
		if(isKeyDown(keyEnum.Left_Key)){
			p1NetInput = vec.sum(p1NetInput, vec.createVec(-1, 0));
		}
		if(isKeyDown(keyEnum.Right_Key)){
			p1NetInput = vec.sum(p1NetInput, vec.createVec(1, 0));
		}
		//console.log(p0NetInput.x, p0NetInput.y);
		if(vec.magnitudeSquared(p1NetInput) != 0){
			game.pushInput(1, vec.normalize(p1NetInput, inputScale));
		}
	}

	var inputinterval= setInterval(inputCollect, game.dt * 1000);

	

});