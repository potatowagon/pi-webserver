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

  reset() {
    this.deg = 0;
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

// handle mouse inputs
turn.addEventListener("mousedown", function(e) {
  console.log("start turn");
  socket.emit('start-turn');
  turnIcon.startRotate();
}, false);

turn.addEventListener("mouseup", function() {
  console.log("stop turn");
  socket.emit('stop-turn');
  turnIcon.reset();
}, false);


