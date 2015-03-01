var pss = new PSServer("ws://pilotdcrelay.herokuapp.com")

console.log("pss.UID = "+pss.UID);
pss.onConnect = function(PSC) { //PseudoSocketConnection
	console.log(PSC.UID+" connected!")

	PSC.onData = function(data) {
		console.log(PSC.UID+" sent: "+data);
		var msg = data.split(" ");
		if (msg[0] == "echo") {
			PSC.send(msg[1]);
			return
		}
		if (msg[0] == "verify") {
			PSC.ask("are you sure?", function(data) {
				console.log("Client is sure?: "+data);
			})
		}
	}

	//Note: this function will be called twice. Initially after connecting, and then after requesting a colloquial name
	PSC.onName = function(UID) {
		console.log("My Name is: "+UID); 
	}

	PSC.onClose = function() {
		console.log(PSC.UID+" disconnected!");
		console.log("Remaining Clients ",pss.clients)
	}

}