const express = require('express');
const router = express.Router();
// const WebSocket = require('ws');
var WebSocketClient = require('websocket').client;

// const ws = new WebSocket('wss://data.alpaca.markets/stream');
var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

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

router.post('/', (req, res) => {
    try {
        const ticker = req.body.tick;
        const text = req.body.text;
        console.log(`ticker: ${ticker}`);
        console.log(`text: ${text}`);


        // // stream price data
        // ws.on('open', function open() {
        //     console.log("We're sending auth data!")
        //     ws.send(authJSON);
        //   });

        // ws.on('message', function incoming(data) {
        //     console.log("Receiving data?!?");
        //     console.log(data);
        //   });

        // pseudocode
        // 1. Establish websockets connection with wss://data.alpaca.markets/stream
        // 2. Send that authentication json and wait for a response
        // 3. Send the listen json to request stock streams and wait for a response
        // 4. Stream data
        // 5. close connection

        client.on('connect', function(connection) {
            console.log('WebSocket Client Connected');
            connection.on('error', function(error) {
                console.log("Connection Error: " + error.toString());
            });
            connection.on('close', function() {
                console.log('echo-protocol Connection Closed');
            });
            connection.on('message', function(message) {
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
        
        client.connect('wss://data.alpaca.markets/stream', 'echo-protocol');



        res.status(200).json("SUCCESS!");

    } catch(err) {
        console.err(err.message);
        console.log("An Error occurred while analyzing a volume event");
        res.status(500).json(err);
    }
});
module.exports = router;