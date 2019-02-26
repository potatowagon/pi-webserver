// load modules
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const publicIp = require('public-ip');
const iplocation = require('iplocation');
const Motor = require('./src/motor');
const Torch = require('./src/torch');
const Heater = require('./src/heater');
const HOST = '0.0.0.0';
const PORT = 3000;

var sockets = {};
var motor = new Motor();
var torch = new Torch();
var heater = new Heater();
var sensor = require('node-dht-sensor');
const DHT11 = 11;
const DHT11_1_GPIO = 4;
const DHT11_2_GPIO = 4;


var temp = 0;
var clients = 0;
var countdown = 0;

//settings
var maxTemp = 38; //initial
var sudoHeaterOff = false;
// in ms
const AUTO_TURN_INTERVAL = 10800000; //3 hours
const AUTO_TURN_DURATION = 3000;
const MAX_TEMP_CHECK_INTERVAL = 5000;
const TEMP_HUMIDITY_POLLING_INTERVAL = 5000;
const SUDO_HEATER_OFF_DURATION = 60000; //ein minuten
const TORCH_ON_DURATION = 60000;
const AUTOTURN_COUNTDOWN_INTERVAL = 60000 

function autoTurn() {
  console.log("auto starting motor");
  motor.startTurn();
  setTimeout(function() {motor.stopTurn()}, AUTO_TURN_DURATION);
  autoTurnCountdown();
}

function autoTurnCountdown() {
  countdown = AUTO_TURN_INTERVAL;
  var secondCountInterval = setInterval(function() {
    countdown = countdown - AUTOTURN_COUNTDOWN_INTERVAL;
    var countdownDisplay = secondsToHms(countdown/1000);
    io.emit('auto-turn-countdown', countdownDisplay);
    if(countdown <= 0) {
      clearInterval(secondCountInterval);
    }
  }, AUTOTURN_COUNTDOWN_INTERVAL);
}

//turn every once in a while (2hrs)
setInterval(autoTurn, AUTO_TURN_INTERVAL);

//check if temp above max temp, and turn off heater if too hot
var checkTempAdjustHeater = function(){
  if(temp > maxTemp) {
    heater.switchOff();
    io.emit('heater-off-state');
    io.emit('maxTemp>temp')
  }
  else {
    if(!sudoHeaterOff) {
      heater.switchOn();
      io.emit('heater-on-state');
      io.emit('maxTemp<=temp')
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
  var extIp = null;
  var extIpLoc = null;
  var intIp = socket.request.connection.remoteAddress;
  var intIpLoc = null;

  console.log("================================================================");
  console.log('Client ' + intIp + ' connected');
  console.log(socket.handshake);
  clients ++;
  console.log("clients: " + clients);
  console.log("================================================================");

  iplocation(intIp, function (error, res) {
    console.log("Location of " + intIp + ": " + res.country + " " + res.zip + ", isp: " + res.isp);
  });  

  publicIp.v4()
  .then(ip => {
    extIp = ip;
    iplocation(extIp, function (error, res) {
      if(error) {
        console.log(error);
      }
      console.log("External IP of " + intIp + ": " + extIp);
      console.log("Location of " + extIp + ": " + res.country + " " + res.zip + ", isp: " + res.isp);
    });
  })
  .catch(err => {});
 
  publicIp.v6()
  .then(ip => {
    extIp = ip;
    iplocation(extIp, function (error, res) {
      if(error) {
        console.log(error);
      }
      console.log("External IP of " + intIp + ": " + extIp);
      console.log("Location of " + extIp + ": " + res.country + " " + res.zip + ", isp: " + res.isp);
    });
  })
  .catch(err => {});
 
  //send temp & humidity readings to client at intervals
  setInterval(function(){
    sensor.read(DHT11, DHT11_1_GPIO, function(err, temperature, humidity) {
      if (!err) {
        temp = temperature;
        io.emit('temp-humidity-in', temperature.toFixed(0), humidity.toFixed(0));
      }
    });  
  }, TEMP_HUMIDITY_POLLING_INTERVAL);

  //send client countdown to next autoturn
  var countdownDisplay = secondsToHms(countdown/1000);
  socket.emit('auto-turn-countdown', countdownDisplay);

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
      setTimeout(function() {sudoHeaterOff = false}, SUDO_HEATER_OFF_DURATION);
      io.emit('candling-on-state');
      heater.switchOff();
      io.emit('heater-off-state');
      setTimeout(function() {
        if(torch.on){
          torch.switchOff();
          sudoHeaterOff = false;
          io.emit('candling-off-state');
          checkTempAdjustHeater();
        }
      }, TORCH_ON_DURATION);
    }
  });

  socket.on('toggle-heater', () => {
    if(heater.on){
      heater.switchOff();
      sudoHeaterOff = true;
      setTimeout(function() {sudoHeaterOff = false}, SUDO_HEATER_OFF_DURATION);
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

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay; 
}