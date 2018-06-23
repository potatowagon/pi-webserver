// load modules
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
//const relay = require('./relay');
const Motor = require('./motor');
const HOST = '0.0.0.0';
const PORT = 8080;

var sockets = {};
var motor = new Motor(); //gpio 4

function autoTurn() {
  console.log("auto starting motor");
  motor.startTurn();
  setTimeout(console.log, 2000, "Stopping motor");
  motor.stopTurn();
}

//turn every once in a while
setInterval(autoTurn(motor), 6000);

////Static Routes
app.use(express.static(__dirname));
//app.use(express.static('public'));

//Main App Route, serve mainpage
app.get('/', (req, res, next) => res.sendFile(__dirname + '/index.html'));

// handle socket client connection
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  
  socket.on('start-turn', () => {
    console.log("server turning motor on");
    motor.startTurn();
  });

  socket.on('stop-turn', () => {
    console.log("server turning motor off");
    motor.stopTurn();
  });
});

// start HTTP server
http.listen(PORT, HOST, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
});

