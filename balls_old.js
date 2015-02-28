$(window).load(function() {
	var canvas = new fabric.Canvas("c");
	var circle = new fabric.Circle({
	  radius: 20, fill: 'yellow', left: 100, top: 100
	});
	canvas.add(circle);
	canvas.renderAll();
	circle.animate('top', '+=10', { onChange: canvas.renderAll.bind(canvas) });
	var id = 0;
	var w = 0;
	var a = 0;
	var s = 0;
	var d = 0;
	var wv = 0;
	var av = 0;
	var sv = 0;
	var dv = 0;
	var decw = 0;
	var deca = 0;
	var decs = 0;
	var decd = 0;
	
	window.onkeydown = function(e) {
		var key = e.keyCode;
		var speed = 2;
		var active=canvas.getObjects()[id];
		
		if (key == 87) { //w 
			if(active) {
				//wv+=1
				canvas.renderAll();
				if (!w) {
					w=setInterval(function() {active.top-=wv; if (wv<=10) {wv+=.25;} canvas.renderAll();}, 10);
				}
				if(decw) {
					clearInterval(decw);
					decw=0;
				}
			}
			/* active.animate('top', '-=1000', { onChange: canvas.renderAll.bind(canvas) });
				if (!w) {
					w=setInterval(function() {active.animate('top', '-=1000', { onChange: canvas.renderAll.bind(canvas) });}, 100);
				}
		`	*/
		}
		if (key == 65) { //a
			if(active) {
				active.left-=10;
				canvas.renderAll();
				if (!a) {
					a=setInterval(function() {active.left-=av; if (av<=10) {av+=.25;} canvas.renderAll();}, 10);
				}
				if(deca) {
					clearInterval(deca);
					deca=0;
				}
			}
		}
		if (key == 83) { //s
			if(active) {
				active.top+=10;
				canvas.renderAll();
				if (!s) {
					s=setInterval(function() {active.top+=sv; if (sv<=10) {sv+=.25;} canvas.renderAll();}, 10);
				}
				if(decs) {
					clearInterval(decs);
					decs=0;
				}
			}
		}
		if (key == 68) { //d
			if(active) {
				active.left+=10;
				canvas.renderAll();
				if (!d) {
					d=setInterval(function() {active.left+=dv; if (dv<=10) {dv+=.25;} canvas.renderAll();}, 10);
				}
				if(decd) {
					clearInterval(decd);
					decd=0;
				}
			}
		}
		//canvas.renderAll();
	}
	window.onkeyup = function(e) {
		var key = e.keyCode;
		
		var speed = 2;
		var active=canvas.getObjects()[id];
		
		if (key == 87) {
			if(active) {
				//active.animate('top', '-=0',  { onChange: canvas.renderAll.bind(canvas) });
				decw=setInterval(function() {active.top-=wv; if(wv>0) {wv-=.1} else {clearInterval(decw)} canvas.renderAll();}, 10);
				clearInterval(w);
			}
		}
		if (key == 65) { //a
			if(active) {
				//active.animate('left', '-=0',  { onChange: canvas.renderAll.bind(canvas) });
				deca=setInterval(function() {active.left-=av; if(av>0) {av-=.1} else {clearInterval(deca)} canvas.renderAll();}, 10);
				clearInterval(a)
			}
		}
		if (key == 83) { //s
			if(active) {
				//active.animate('top', '-=0',  { onChange: canvas.renderAll.bind(canvas) });
				decs=setInterval(function() {active.top+=sv; if(sv>0) {sv-=.1} else {clearInterval(decs)} canvas.renderAll();}, 10);
				clearInterval(s)
			}
		}
		if (key == 68) { //d
			if(active) {
				//active.animate('left', '-=0',  { onChange: canvas.renderAll.bind(canvas) });
				decd=setInterval(function() {active.left+=dv; if(dv>0) {dv-=.1} else {clearInterval(decd)} canvas.renderAll();}, 10);
				clearInterval(d)
			}
		}
	}
	
	objs = canvas.getObjects();
	myobj = objs[id];

})