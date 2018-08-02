//to rotate icons in webpage
class Rotatable {
  constructor(id) {
    this.id = id;
    this.deg = 0;
    this.mouseDown = false;
  }
  
  rotate() {
    this.mouseDown = true;
    while(this.mouseDown) {
      this.deg = this.deg + 1;
      // Code for Safari
      document.getElementById(this.id).style.WebkitTransform = "rotate(" + this.deg + ")"; 
      // Code for IE9
      document.getElementById(this.id).style.msTransform = "rotate(" + this.deg + ")"; 
      // Standard syntax
      document.getElementById(this.id).style.transform = "rotate(" + this.deg + ")";
      console.log(this.deg)
    }
  }

  reset() {
    this.mouseDown = false;
    this.deg = 0;
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
turn.addEventListener("mousedown", function() {
  console.log("start turn");
  socket.emit('start-turn');
  turnIcon.rotate();
}, false);

turn.addEventListener("mouseup", function() {
  console.log("stop turn");
  socket.emit('stop-turn');
  //turnIcon.reset();
}, false);


