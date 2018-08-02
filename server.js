// load modules
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
//const relay = require('./relay');
const Motor = require('./motor');
const Torch = require('./torch');
const HOST = '0.0.0.0';
const PORT = 3000;

var sockets = {};
var motor = new Motor();
var torch = new Torch();

function autoTurn() {
  console.log("auto starting motor");
  motor.startTurn();
  setTimeout(function() {motor.stopTurn()}, 2000,);
}

//turn every once in a while (2hrs)
setInterval(autoTurn, 7200000);

////Static Routes
app.use(express.static(__dirname));
//app.use(express.static('public'));

//Main App Route, serve mainpage
app.get('/', (req, res, next) => res.sendFile(__dirname + '/index.html'));

// handle socket client connection
io.on('connection', (socket) => {
  console.log('Client connected');

  //once connected, play animation of state
  if(motor.turning) {
    //socket.emit("start-turn-animation");
  }
  else {
    //socket.emit("stop-turn-animation")
  }

  if(torch.on){
    socket.emit('candling-on-state');
  }
  else {
    socket.emit('candling-off-state');
  }

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  
  socket.on('start-turn', () => {
    console.log("server turning motor on");
    motor.startTurn();
    io.emit('start-turn-animation')
  });

  socket.on('stop-turn', () => {
    console.log("server turning motor off");
    motor.stopTurn();
    io.emit('stop-turn-animation');
  });

  socket.on('toggle-candling', () => {
    if(torch.on){
      torch.switchOff();
      io.emit('candling-off-state');
    }
    else {
      torch.switchOn();
      io.emit('candling-on-state');
    }
  });
});

// start HTTP server
http.listen(PORT, HOST, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
});

