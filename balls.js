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

	
	window.onkeydown = function(e) {
		var key = e.keyCode;
		var speed = 2;
		var active=canvas.getObjects()[id];
		
		if (key == 87) { //w 
			if(active) {
				active.top-=10;
				canvas.renderAll();
				if (!w) {
					w=setInterval(function() {active.top-=10; canvas.renderAll();}, 10);
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
					a=setInterval(function() {active.left-=10; canvas.renderAll();}, 10);
				}
			}
		}
		if (key == 83) { //s
			if(active) {
				active.top+=10;
				canvas.renderAll();
				if (!s) {
					s=setInterval(function() {active.top+=10; canvas.renderAll();}, 10);
				}
			}
		}
		if (key == 68) { //d
			if(active) {
				active.left+=10;
				canvas.renderAll();
				if (!d) {
					d=setInterval(function() {active.left+=10; canvas.renderAll();}, 10);
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
				clearInterval(w);
				w=0;
			}
		}
		if (key == 65) { //a
			if(active) {
				//active.animate('left', '-=0',  { onChange: canvas.renderAll.bind(canvas) });
				clearInterval(a);
				a=0;
			}
		}
		if (key == 83) { //s
			if(active) {
				//active.animate('top', '-=0',  { onChange: canvas.renderAll.bind(canvas) });
				clearInterval(s);
				s=0;
			}
		}
		if (key == 68) { //d
			if(active) {
				//active.animate('left', '-=0',  { onChange: canvas.renderAll.bind(canvas) });
				clearInterval(d);
				d=0;
			}
		}
	}
	
	objs = canvas.getObjects();
	myobj = objs[id];

})