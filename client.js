var psc = new PSClient("ws://pilotdcrelay.herokuapp.com","short-pillow") //replace tall-bird with the UID of the server;

var clientInfo = {join:true, parentID:null, personalID:null};

function death(){
	// do something
}

function show(msg){
	// display the sent info
	console.log(msg);
}

function sendInput(psc, accel){
	psc.send("input " + accel.x + " " + accel.y);
}

psc.onConnectionFailure = function(){
	console.log("failed to connect");
	death();
}

psc.onData = function(data) {
	console.log("Server sent me "+data);
	var msg = data.split(" ");
	
	if(msg[0] == "request"){
		if(clientInfo.join){
			psc.send("join " + clientInfo.parentID);
		}
	}

	if(msg[0] == "acknowledgement"){
		if(!clientInfo.parentID){
			if(msg[2]){
				clientInfo.personalID = msg[2];
			}
		}
	}

	if(msg[0] == "death"){
		death();
	}

	if(msg[0] == "display"){
		show(msg);
	}
}

psc.onClose = function(){
	death();
}

