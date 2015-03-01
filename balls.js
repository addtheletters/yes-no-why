
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


function Game(canvas){
	var self = this;

	self.canvas = canvas;
	self.name = "Bounce";
	self.dt = 20 / 1000; // in seconds, time between ticks
	self.users = [];
	self.balls = [];
	self.bounciness = .5;

	self.addBall = function(x, y, radius, color, id){
		var theBall = new Ball(x, y, radius, color, id);
		self.balls.push(theBall);
		self.canvas.add(theBall.fabricObj);
		theBall.fabricObj.hasControls = false;
		return theBall;
	}

	self.applyInputs = function(){
		//
		return 0;
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
		console.log("handling collisions " + collisions);
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

		body1.addVelocity(  vec.scale( deltapos,  vec.magnitude(vec.subtract(v1, u1) ))  );
		body2.addVelocity(  vec.scale( deltapos, -vec.magnitude(vec.subtract(v2, u2) ))  );
	}
}



$(window).load(function() {
	var game = new Game(new fabric.Canvas("c"));
	game.addBall(120, 120, 20, 'yellow', 0);
	game.addBall(420, 120, 20, 'green', 0);

	interval = game.startGame();

	window.onkeydown = function(e){
		var key = e.keyCode;
		if(key == 87){
			game.balls[0].addVelocity(vec.createVec(20, 0));
		}
	}

/*

	upInt=0;
	sideInt=0;
	upInt1=0;
	sideInt1=0;
	
	window.onkeydown = function(e) {
		var key = e.keyCode;
		if(key==87) { //w
			clearInterval(upInt);
			accVec[0].y=-.25;
			upInt=setInterval(function() {if (moveVec[0].y>=-10) {moveVec[0].y+=accVec[0].y} else {clearInterval(upInt)} }, 10);
		}	
		if(key==83) { //s
			clearInterval(upInt);
			accVec[0].y=.25;
			upInt=setInterval(function() {if (moveVec[0].y<=10) {moveVec[0].y+=accVec[0].y} else {clearInterval(upInt)}}, 10);
		}	
		if(key==65) { //a
			clearInterval(sideInt);
			accVec[0].x=-.25;
			sideInt=setInterval(function() {if (moveVec[0].x>=-10) {moveVec[0].x+=accVec[0].x} else {clearInterval(sideInt)}}, 10);
		}	
		if(key==68) { //d
			clearInterval(sideInt);
			accVec[0].x=.25;
			sideInt=setInterval(function() {if (moveVec[0].x<=10) {moveVec[0].x+=accVec[0].x} else {clearInterval(sideInt)}}, 10);
		}	
		if(key==38) { //up
			clearInterval(upInt1);
			accVec[1].y=-.25;
			upInt1=setInterval(function() {if (moveVec[1].y>=-10) {moveVec[1].y+=accVec[1].y} else {clearInterval(upInt1)} }, 10);
		}	
		if(key==40) { //down
			clearInterval(upInt1);
			accVec[1].y=.25;
			upInt1=setInterval(function() {if (moveVec[1].y<=10) {moveVec[1].y+=accVec[1].y} else {clearInterval(upInt1)}}, 10);
		}	
		if(key==37) { //left
			clearInterval(sideInt1);
			accVec[1].x=-.25;
			sideInt1=setInterval(function() {if (moveVec[1].x>=-10) {moveVec[1].x+=accVec[1].x} else {clearInterval(sideInt1)}}, 10);
		}	
		if(key==39) { //right
			clearInterval(sideInt1);
			accVec[1].x=.25;
			sideInt1=setInterval(function() {if (moveVec[1].x<=10) {moveVec[1].x+=accVec[1].x} else {clearInterval(sideInt1)}}, 10);
		}	
	}
	window.onkeyup = function(e) {
		var key = e.keyCode;
		if(key==87) { //w
			clearInterval(upInt);
			accVec[0].y=.1;
			upInt=setInterval(function() {if (moveVec[0].y<=0) {moveVec[0].y+=accVec[0].y} else {moveVec[0].y=0;}}, 10);
		}	
		if(key==83) { //s
			clearInterval(upInt);
			accVec[0].y=-.1;
			upInt=setInterval(function() {if (moveVec[0].y>=0) {moveVec[0].y+=accVec[0].y} else {moveVec[0].y=0;}}, 10);
		}	
		if(key==65) { //a
			clearInterval(sideInt);
			accVec[0].x=.1;
			sideInt=setInterval(function() {if (moveVec[0].x<=0) {moveVec[0].x+=accVec[0].x} else {moveVec[0].x=0;}}, 10);
		}	
		if(key==68) { //d
			clearInterval(sideInt);
			accVec[0].x=-.1;
			sideInt=setInterval(function() {if (moveVec[0].x>=0) {moveVec[0].x+=accVec[0].x} else {moveVec[0].x=0;}}, 10);
		}	
		if(key==38) { //up
			clearInterval(upInt1);
			accVec[1].y=.1;
			upInt1=setInterval(function() {if (moveVec[1].y<=0) {moveVec[1].y+=accVec[1].y} else {moveVec[1].y=0;}}, 10);
		}	
		if(key==40) { //down
			clearInterval(upInt1);
			accVec[1].y=-.1;
			upInt1=setInterval(function() {if (moveVec[1].y>=0) {moveVec[1].y+=accVec[1].y} else {moveVec[1].y=0;}}, 10);
		}	
		if(key==37) { //left
			clearInterval(sideInt1);
			accVec[1].x=.1;
			sideInt1=setInterval(function() {if (moveVec[1].x<=0) {moveVec[1].x+=accVec[1].x} else {moveVec[1].x=0;}}, 10);
		}	
		if(key==39) { //right
			clearInterval(sideInt1);
			accVec[1].x=-.1;
			sideInt1=setInterval(function() {if (moveVec[1].x>=0) {moveVec[1].x+=accVec[1].x} else {moveVec[1].x=0;}}, 10);
		}	
	}*/
});