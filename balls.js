$(window).load(function() {
	var canvas = new fabric.Canvas("c");
	var circle = new fabric.Circle({
	  radius: 20, fill: 'yellow', left: 100, top: 100
	});
	canvas.add(circle);
	circle.hasControls=false;
	var circle1 = new fabric.Circle({
	  radius: 20, fill: 'green', left: 400, top: 100
	});
	canvas.add(circle1);
	circle1.hasControls=false;
	canvas.renderAll();
	//circle.animate('top', '+=10', { onChange: canvas.renderAll.bind(canvas) });

	var getCenter = function(o) {
		return { x: o.left-o.radius,
				 y: o.top-o.radius,
				 r: o.radius
				}
	}
	
	var getColls = function(id) {
		objs=canvas.getObjects();
		colls=[]
		for (i=0; i<objs.length; i++) {
				if (i!=id) {
					var c1=getCenter(objs[i]);
					var c0=getCenter(objs[id]);
					if (Math.pow((c1.x-c0.x), 2) + Math.pow((c0.y-c1.y),2) <= Math.pow((c0.r+c1.r),2)) {
						colls.push(i);
					}
				}
		}
		return colls;
	}
	
	var getMass = function(o) {
		return Math.pi*Math.pow(o.r, 2);
	}
	
	var bounciness = 1;
	
	function applyCollision(body1, body2, id1, id2){
		// elastic collision!

		var deltapos = vec.subtract(vec.createVec(body1.x, body1.y), vec.createVec(body2.x, body2.y));
		while( vec.magnitudeSquared(deltapos) == 0 ){
			deltapos = vec.createVec(Math.random()-0.5, Math.random()-0.5);
		}
		deltapos = vec.normalize(deltapos); // to a unit direction vector
		// getting components of velocity parallel to collision direction
		var parallel1mag = vec.dotProd(moveVec[id1], deltapos); 
		var parallel2mag = vec.dotProd(moveVec[id2], deltapos);

		var u1 = vec.normalize(deltapos, -parallel1mag);
		var u2 = vec.normalize(deltapos, parallel2mag);

		var v1 = vec.scale( vec.sum( vec.scale(u1, getMass(body1) - getMass(body2)) , vec.scale( u2, 2*getMass(body2) ) ),
			bounciness* 1/(getMass(body1) + getMass(body2)) );

		var v2 = vec.scale( vec.sum( vec.scale(u2, getMass(body2) - getMass(body1)) , vec.scale( u1, 2*getMass(body1) ) ),
			bounciness* 1/(getMass(body1) + getMass(body2)) );

		add1 = vec.scale( deltapos,  vec.magnitude(vec.subtract(v1, u1) ));
		add2 = vec.scale( deltapos, -vec.magnitude(vec.subtract(v2, u2) ));
		moveVec[id1]=vec.subtract(moveVec[id1], add1);
		moveVec[id1]=vec.subtract(moveVec[id2], add2);
		//body1.addVelocity( vec.subtract(v1, u1) );
		//body2.addVelocity( vec.subtract(v2, u2) );
	}
	
	id=0;
	var active=canvas.getObjects()[id];
	objs=canvas.getObjects();
	moveVec=[0, 0]
	accVec=[0, 0]
	moveVec[0]=vec.createVec(0, 0);
	accVec[0]=vec.createVec(0, 0);
	moveInterval=setInterval(function() {active.left+=moveVec[0].x; 
										 active.top+=moveVec[0].y; 
										 collided=getColls(id);
										 if (collided.length>0){
											for (c in collided) {
												applyCollision(getCenter(active), getCenter(objs[collided[c]]), id, collided[c]);
											}
										 }
										 
										 //moveVec.x+=accVec.x;
										 //moveVec.y+=accVec.y;
										 canvas.renderAll();}, 10);
	var active1=canvas.getObjects()[id+1];
	moveVec[1]=vec.createVec(0, 0);
	accVec[1]=vec.createVec(0, 0);
	moveInterval1=setInterval(function() {active1.left+=moveVec[1].x; 
										 active1.top+=moveVec[1].y; 
										 collided=getColls(id+1);
										 if (collided.length>0){
											for (c in collided) {
												applyCollision(getCenter(active1), getCenter(objs[collided[c]]), id+1, collided[c]);
											}
										 }
										 //moveVec.x+=accVec.x;
										 //moveVec.y+=accVec.y;
										 canvas.renderAll();}, 10);

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
	}
})