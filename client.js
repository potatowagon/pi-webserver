// grab references to DOM elements
var turn = document.getElementById('turn');
var candling = document.getElementById('candling');
var lamp = document.getElementById('lamp');

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
}, false);

turn.addEventListener("mouseup", function() {
  console.log("stop turn");
  socket.emit('stop-turn');
}, false);


