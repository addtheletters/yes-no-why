$(window).load(function() {
	var canvas = new fabric.Canvas("c");
	var circle = new fabric.Circle({
	  radius: 20, fill: 'yellow', left: 100, top: 100
	});
	canvas.add(circle);
	canvas.renderAll();
	circle.animate('top', '+=10', { onChange: canvas.renderAll.bind(canvas) });

	id=0;
	var active=canvas.getObjects()[id];
	
	moveVec=vec.createVec(0, 0);
	accVec=vec.createVec(0, 0);
	moveInterval=setInterval(function() {active.left+=moveVec.x; 
										 active.top+=moveVec.y; 
										 moveVec.x+=accVec.x;
										 moveVec.y+=accVec.y;
										 canvas.renderAll();}, 10);

	upInt=0;
	sideInt=0;
	
	window.onkeydown = function(e) {
		var key = e.keyCode;
		if(key==87) { //w
			clearInterval(upInt);
			upInt=setInterval(function() {if (moveVec.y>=-10) {moveVec.y-=.25} else {clearInterval(upInt)} }, 10);
		}	
		if(key==83) { //s
			clearInterval(upInt);
			upInt=setInterval(function() {if (moveVec.y<=10) {moveVec.y+=.25} else {clearInterval(upInt)}}, 10);
		}	
		if(key==65) { //a
			clearInterval(sideInt);
			sideInt=setInterval(function() {if (moveVec.x>=-10) {moveVec.x-=.25} else {clearInterval(sideInt)}}, 10);
		}	
		if(key==68) { //d
			clearInterval(sideInt);
			sideInt=setInterval(function() {if (moveVec.x<=10) {moveVec.x+=.25} else {clearInterval(sideInt)}}, 10);
		}	
	}
	window.onkeyup = function(e) {
		var key = e.keyCode;
		if(key==87) { //w
			clearInterval(upInt);
			upInt=setInterval(function() {if (moveVec.y<=0) {moveVec.y+=.1} else {moveVec.y=0; clearInterval(upInt)}}, 10);
		}	
		if(key==83) { //s
			clearInterval(upInt);
			upInt=setInterval(function() {if (moveVec.y>=0) {moveVec.y-=.1} else {moveVec.y=0; clearInterval(upInt)}}, 10);
		}	
		if(key==65) { //a
			clearInterval(sideInt);
			sideInt=setInterval(function() {if (moveVec.x<=0) {moveVec.x+=.1} else {moveVec.x=0; clearInterval(sideInt)}}, 10);
		}	
		if(key==68) { //d
			clearInterval(sideInt);
			sideInt=setInterval(function() {if (moveVec.x>=0) {moveVec.x-=.1} else {moveVec.x=0; clearInterval(sideInt)}}, 10);
		}	
	}
})