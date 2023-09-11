const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

let buttonColor = 'red';
let playerCount = 0;

io.on('connection', (socket) => {
  if (playerCount === 0) {
    socket.emit('playerAssignment', 1);
    playerCount = 1;
  } else if (playerCount === 1) {
    socket.emit('playerAssignment', 2);
    playerCount = 2;
  } else {
    // Handle additional players as needed (e.g., send a message that the game is full).
    socket.emit('gameFull');
  }

  socket.on('disconnect', () => {
    // Handle player disconnections and reset player count if needed.
    if (playerCount > 0) {
      playerCount--;
    }
  });

    // Listen for button clicks
    socket.on('squareCl', (sqArr) => {
      // Broadcast the new color to all connected clients
      io.emit('updateSqs', sqArr);
    });

    socket.on('newTurn', (turnNum) => { 
      io.emit('newTurn', turnNum);
    });


  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Broadcast the message to all connected clients
  });


});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
