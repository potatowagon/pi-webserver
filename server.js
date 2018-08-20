// load modules
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Motor = require('./motor');
const Torch = require('./torch');
const Heater = require('./heater');
const HOST = '0.0.0.0';
const PORT = 3000;

var sockets = {};
var motor = new Motor();
var torch = new Torch();
var heater = new Heater();
var sensor = require('node-dht-sensor');
var temp = 0;
var clients = 0;

//settings
var maxTemp = 38; //initial
var sudoHeaterOff = false;
// in ms
const AUTO_TURN_INTERVAL = 7200000; //2 hours
const AUTO_TURN_DURATION = 10000;
const MAX_TEMP_CHECK_INTERVAL = 5000;
const TEMP_HUMIDITY_POLLING_INTERVAL = 5000;


function autoTurn() {
  console.log("auto starting motor");
  motor.startTurn();
  setTimeout(function() {motor.stopTurn()}, AUTO_TURN_DURATION);
}

//turn every once in a while (2hrs)
setInterval(autoTurn, AUTO_TURN_INTERVAL);

//check if temp above max temp, and turn off heater if too hot
var checkTempAdjustHeater = function(){
  if(temp > maxTemp) {
    heater.switchOff();
    io.emit('heater-off-state');
  }
  else {
    if(!sudoHeaterOff) {
      heater.switchOn();
      io.emit('heater-on-state');
    }
  }
};

setInterval(checkTempAdjustHeater, MAX_TEMP_CHECK_INTERVAL);

////Static Routes
app.use(express.static(__dirname));
//app.use(express.static('public'));

//Main App Route, serve mainpage
app.get('/', (req, res, next) => res.sendFile(__dirname + '/index.html'));

// handle socket client connection
io.on('connection', (socket) => {
  console.log("================================================================");
  console.log('Client ' + socket.request.connection.remoteAddress + ' connected');
  console.log(socket.handshake);
  clients ++;
  console.log("clients: " + clients);
  console.log("================================================================");

  setInterval(function(){
    sensor.read(11, 4, function(err, temperature, humidity) {
      if (!err) {
        temp = temperature;
        io.emit('temp-humidity-in', temperature.toFixed(0), humidity.toFixed(0));
      }
    });  
  }, TEMP_HUMIDITY_POLLING_INTERVAL);

  //once connected, display current max temp
  socket.emit("max-temp", maxTemp);
    
  //once connected, play animation of state
  if(motor.turning) {
    socket.emit("start-turn-animation");
  }
  else {
    socket.emit("stop-turn-animation")
  }

  if(torch.on) {
    socket.emit('candling-on-state');
  }
  else {
    socket.emit('candling-off-state');
  }

  if(heater.on) {
    socket.emit('heater-on-state');
  }
  else {
    socket.emit('heater-off-state');
  }

  //once connected, display curent max temp
  socket.emit('update-max-temp-display', maxTemp); 

  //handle events from client user interaction
  socket.on('disconnect', () => {
    console.log('Client ' + socket.request.connection.remoteAddress + ' disconnected');
    clients --;
    console.log("clients: " + clients);
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
      sudoHeaterOff = false;
      io.emit('candling-off-state');
      checkTempAdjustHeater();
    }
    else {
      torch.switchOn();
      sudoHeaterOff = true;
      io.emit('candling-on-state');
      heater.switchOff();
      io.emit('heater-off-state');
    }
  });

  socket.on('toggle-heater', () => {
    if(heater.on){
      heater.switchOff();
      sudoHeaterOff = true;
      io.emit('heater-off-state');
    }
    else {
      //attempting to switch on
      sudoHeaterOff = false;
      heater.switchOn();
      io.emit('heater-on-state');
    }
  });

  socket.on('update-max-temp', (newMaxTemp)=> {
    maxTemp = newMaxTemp;
    io.emit('update-max-temp-display', maxTemp);
  });
});

// start HTTP server
http.listen(PORT, HOST, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
});

