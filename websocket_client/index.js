const WebSocket = require("ws");
const ws = new WebSocket('ws://localhost:8082')

ws.addEventListener("open", () => {
    console.log("We are connected!");

    ws.send("here's a message from the client");
});

ws.addEventListener("message", data => {
    console.log(`Server has send us: ${data.data}`);
});
  