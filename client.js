var psc = new PSClient("ws://pilotdcrelay.herokuapp.com","small-owl") //replace tall-bird with the UID of the server;

psc.onConnect = function() {
	console.log("Connected to "+psc.host)

	psc.send("echo hi!")
}

psc.onData = function(data) {
	console.log("Server sent me "+data)
}

psc.onQuestion = function(query, callback) {
	if (query == "are you sure?") {
		callback("of course!");
	}
}