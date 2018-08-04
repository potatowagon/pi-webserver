//to rotate icons in webpage
class Rotatable {
  constructor(id) {
    this.id = id;
    this.deg = 0;
  }

  startRotate() {
    var _this = this;
    this.active = setInterval(function(){_this.rotate()} ,10);
  }
  
  rotate() {
    this.deg = this.deg + 1;
    this.deg = this.deg % 360;
    // Code for Safari
    document.getElementById(this.id).style.WebkitTransform = "rotate(" + this.deg + "deg)"; 
    // Code for IE9
    document.getElementById(this.id).style.msTransform = "rotate(" + this.deg + "deg)"; 
    // Standard syntax
    document.getElementById(this.id).style.transform = "rotate(" + this.deg + "deg)";
  }

  stopRotate() {
    clearInterval(this.active)
  }
}

// grab references to DOM elements
var turn = document.getElementById('turn');
var candling = document.getElementById('candling');
var lamp = document.getElementById('lamp');

var turnIcon = new Rotatable("turn-icon");

//status flags
//check gpio later
var turning = false;
var torchOn = false;
var lampOn = false; 

// initialize WebSocket
var socket = io();
var isConnected = false;

// bind to socket events
socket.on('connect', function() {
  console.log("Connected");
  isConnected = true;
});
socket.on('disconnect', function() {
  console.log("Disconnect");
  isConnected = false;
});

socket.on('start-turn-animation', function() {turnIcon.startRotate()});
socket.on('stop-turn-animation', function() {turnIcon.stopRotate()});
socket.on('candling-on-state', function(){
  candling.innerHTML = '<i class="far fa-lightbulb fa-7x"></i>';
});
socket.on('candling-off-state', function(){
  candling.innerHTML = '<i class="fas fa-lightbulb fa-7x"></i>';
});

//display temp and humidity readings
var tempReading = document.getElementById("temp");
var humidityReading = document.getElementById("humidity");
socket.on('temp-humidity-in', function(temp, humidity){
  tempReading.innerHTML = temp + ' °C';
  humidityReading.innerHTML = humidity + ' %';
});

//// FOR TURN BUTTON
//handle inputs
var startTurn = function() {
  console.log("start turn");
  socket.emit('start-turn');
};

var stopTurn = function() {
  console.log("stop turn");
  socket.emit('stop-turn');
};

// handle mouse inputs
turn.addEventListener("mousedown", startTurn, false);
turn.addEventListener("mouseup", stopTurn, false);

//for mobile
turn.addEventListener("touchstart", startTurn, false);
turn.addEventListener("touchend", stopTurn, false);

////FOR EGG CANDLING BUTTON
//handle inputs
var candlingOn = false;
var toggleCandling = function() {
  socket.emit('toggle-candling');
};

// handle mouse inputs
candling.addEventListener("click", toggleCandling, false);

////MAX TEMP CONTROLL
var maxTempEle = document.getElementById("max-temp");
var updateMaxTemp = function(newMaxTemp) {
  console.log(newMaxTemp);
  socket.emit('update-max-temp', newMaxTemp);
};

maxTempEle.addEventListener("change", updateMaxTemp(maxTempEle.value), false);


