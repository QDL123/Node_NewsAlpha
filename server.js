// server.js
require('dotenv').config();
const app = require('./app.js');

// start up the server 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}.`)
});
