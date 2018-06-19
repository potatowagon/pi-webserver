// load modules
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
//const relay = require('./relay');
const HOST = '0.0.0.0';
const PORT = 8080;

var sockets = {};

////Static Routes
app.use(__dirname, express.static(__dirname));
//app.use(express.static('public'));

//Main App Route, serve mainpage
app.get('/', (req, res, next) => res.sendFile(__dirname + '/index.html'));

// handle socket client connection
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  
  /*socket.on('rotate', (x) => {
    console.log(`Rotate to x:${x.toFixed(1)}`);
    panTilt.rotate(x, 0);
	socket.broadcast.emit('rotate', x);
  });

  // send current pan/tilt head position to connected client
  const {x, y} = panTilt.getPosition();
  socket.emit('reset', x, y);*/
});

// start HTTP server
http.listen(PORT, HOST, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
});

