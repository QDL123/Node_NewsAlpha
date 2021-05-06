const WebSocket = require("ws");
const ws = new WebSocket('wss://data.alpaca.markets/stream');
// const ws = new WebSocket('wss://echo.websocket.org/');

const authJSON = {
    "action": "authenticate",
    "data": {
        "key_id": "PKXJSKSQQS2VAQOEZRB6",
        "secret_key": "oYSpOLOqtKn6ME4K3dxmYbrpT70lYi4mVWBf0MNU"
    }
}

const listenJSON = {
    "action": "listen",
    "data": {
        "streams": ["Q.TSLA", "Q.AMZN", "Q.JPM", "Q.JNJ"]
    }
}

ws.addEventListener("open", () => {
    console.log("We are connected!");

    console.log("Now we try to submit auth credentials to Alpaca");
    ws.send(JSON.stringify(authJSON));
})

ws.addEventListener("close", () => {
    console.log("Connection closing")
})

ws.addEventListener("error", error => {
    console.log("An error has occurred");
    console.log(error);
});

let started_getting_data = false;
let count_TSLA = 0;
let count_AMZN = 0;
let count_JPM = 0;
let count_JNJ = 0;

function close() {
    ws.close();
    console.log(`TSLA count: ${count_TSLA}`);
    console.log(`AMZN count: ${count_AMZN}`);
    console.log(`JPM count : ${count_JPM}`);
    console.log(`JNJ count: ${count_JNJ}`);
}

ws.addEventListener("message", data => {
    // console.log("We have received something from Alpaca!");
    // console.log(`Alpaca data: ${data.data}`);
    const response = JSON.parse(data.data);
    // console.log(`stream: ${response.stream}`);
    if(response.stream == "authorization") {
        console.log("Sending listen JSON to alpaca");
        ws.send(JSON.stringify(listenJSON));
    } else if(response.stream == "listening") {
        console.log("STARTED LISTENING");
    } else {
        if(started_getting_data == false) {
            setTimeout(close, 60000);
            started_getting_data = true;
        }
        if(response.stream == "Q.TSLA") {
            count_TSLA++;
        } else if (response.stream == "Q.AMZN") {
            count_AMZN++;
        } else if (response.stream == "Q.JPM") {
            count_JPM++;
        } else if (response.stream == "Q.JNJ") {
            count_JNJ++;
        }
    }
});
