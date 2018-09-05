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
var heater = document.getElementById('heater');

var turnIcon = new Rotatable("turn-icon");

// initialize WebSocket
var socket = io();

// bind to socket events
socket.on('connect', function() {
  console.log("Connected");
});
socket.on('disconnect', function() {
  console.log("Disconnect");
});

socket.on('start-turn-animation', function() {turnIcon.startRotate()});
socket.on('stop-turn-animation', function() {turnIcon.stopRotate()});
socket.on('candling-on-state', function(){
  candling.innerHTML = '<i class="far fa-lightbulb fa-7x"></i>';
});
socket.on('candling-off-state', function(){
  candling.innerHTML = '<i class="fas fa-lightbulb fa-7x"></i>';
});
socket.on('heater-on-state', function() {
  heater.innerHTML = '<i class="fab fa-free-code-camp fa-7x"></i>';
});
socket.on('heater-off-state', function() {
  heater.innerHTML = '<i class="fas fa-fire-extinguisher fa-7x"></i>';
});

//display temp and humidity readings
var tempReading = document.getElementById("temp");
var humidityReading = document.getElementById("humidity");
socket.on('temp-humidity-in', function(temp, humidity){
  tempReading.innerHTML ='Temp:   ' + temp + ' °C';
  humidityReading.innerHTML ='Humidity:   ' + humidity + ' %';
});

//display next time to next autoturn
var autoturnCountdown = document.getElementById("autoturn-countdown");
socket.on('auto-turn-countdown', function(countdownTime){
  autoturnCountdown.innerHTML = "Time to next auto-turn: " + countdownTime;
});

//display new max temp value
var maxTempDisplay = document.getElementById("max-temp-val");
var maxTempSlider = document.getElementById("max-temp");
socket.on('update-max-temp-display', function(newMaxTemp){
  maxTempDisplay.innerHTML = newMaxTemp;
  maxTempSlider.value = newMaxTemp;
});

//display that maxTemp > temp, or not
var tempInfo = document.getElementById("temp-info");
socket.on('maxTemp>temp', function(){
  tempInfo.innerHTML = "  > Max Temp! Heater turned off";
});
socket.on('maxTemp<=temp', function(){
  tempInfo.innerHTML = "";
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
var toggleCandling = function() {
  socket.emit('toggle-candling');
};

// handle mouse inputs
candling.addEventListener("click", toggleCandling, false);

////FOR HEATERBUTTON
var toggleHeater = function() {
  socket.emit('toggle-heater');
};

heater.addEventListener("click", toggleHeater, false);

////MAX TEMP CONTROLL
function updateMaxTemp(newMaxTemp) {
  socket.emit('update-max-temp', newMaxTemp);
}




