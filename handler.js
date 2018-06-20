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
// set the initial dot position
/*socket.on('reset', function (x, y) {
  dotEl.style.left = x + '%';
  dotEl.style.top = y + '%';
});

socket.on('rotate', function (x) {
  dotEl.style.left = 100-x + '%';
});*/
// handle mouse inputs
turn.addEventListener("mousedown", function() {
  console.log("turn")
}, false);

/*dotEl.addEventListener('mousedown', function() {
  if (!isConnected) {
    return;
  }

  dotEl.classList.add('move');
  isMoving = true;
}, false);

document.addEventListener('mousemove', function(event) {
  if (!isMoving) {
    return;
  }

  var rect = dotEl.parentElement.getBoundingClientRect();

  // calculate dot position in relation to the box (in %)
  var x = (event.clientX - rect.left) / rect.width * 100;

  // limit values to 0-100 range
  x = x < 0 ? 0 : x > 100 ? 100 : x; 
 
  // update dot position
  dotEl.style.left = x + '%';

  // send the position to the server
  socket.emit('rotate', 100-x);
}, false);

document.addEventListener('mouseup', function() {
  dotEl.classList.remove('move');
  isMoving = false;
}, false); */

