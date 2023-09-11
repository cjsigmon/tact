const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

let buttonColor = 'red';
let players = 0;

io.on('connection', (socket) => {
  // Send the current button color to the new client
  socket.emit('initialColor', buttonColor);
  if(players < 2) {
    socket.emit('newPlayer', ++players);
  }

    // Listen for button clicks
    socket.on('squareCl', (sq) => {
      console.log(sq);
  
      // Broadcast the new color to all connected clients
      // io.emit('updateColor', buttonColor);
    });

    socket.on('newTurn', (turnNum) => {
      console.log(turnNum)
  
      io.emit('newTurn', turnNum)
    });


  // Listen for button clicks
  socket.on('toggleColor', () => {
    // Toggle the button color
    buttonColor = buttonColor === 'red' ? 'blue' : 'red';

    // Broadcast the new color to all connected clients
    io.emit('updateColor', buttonColor);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Broadcast the message to all connected clients
  });


});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
