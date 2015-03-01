var psc = new PSClient("ws://pilotdcrelay.herokuapp.com","yellow-bag") //replace tall-bird with the UID of the server;

var clientInfo = {join:true, parentID:null};

function death(){
	// do something
}

function show(msg){
	// display the sent info
}

psc.onData = function(data) {
	console.log("Server sent me "+data);
	var msg = data.split(" ");
	
	if(msg[0] == "request"){
		if(clientInfo.join){
			psc.send("join " + clientInfo.parentID);
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

psc.onQuestion = function(query, callback) {
	if (query == "are you sure?") {
		callback("of course!");
	}
}