const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

let playerCount = 0;
let players = {};

io.on('connection', (socket) => {
  if (playerCount < 2) {
    playerCount++;
    players[socket.id] = playerCount;
    socket.emit('player', playerCount);

    socket.on('toggleColor', () => {
      const player = players[socket.id];
      const color = player === 1 ? 'blue' : 'green';

      io.emit('updateColor', { player, color });
    });

    socket.on('disconnect', () => {
      delete players[socket.id];
      playerCount--;
    });
  } else {
    socket.emit('full');
    socket.disconnect(true);
  }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
