#!/usr/bin/env node
var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

const authJSON = {
    "action": "authenticate",
    "data": {
        "key_id": process.env.APCA_API_KEY_ID,
        "secret_key": process.env.APCA_API_SECRET_KEY
    }
}

const listenJSON = {
    "action": "listen",
    "data": {
        "streams": ["T.SPY", "Q.SPY", "AM.SPY"]
    }
}

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        console.log("GOT SOMETHING!")
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    
    function sendNumber() {
        if (connection.connected) {
            connection.sendUTF(authJSON);
            setTimeout(sendNumber, 1000);
        }
    }
    sendNumber();
});

client.connect('wss://data.alpaca.markets/stream');