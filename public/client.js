const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
var players = document.getElementById('players');
let playerNum = 0;
let turnNum = 1;
    // Get the button element
    const button = document.getElementById('toggleButton');
var squares = document.getElementsByClassName('sq');

socket.on('newPlayer', (p) => {
  playerNum = p;
});

  function sqClick(sq) {
    if (turnNum % 2 === 0 && playerNum === 2 && sq.textContent != undefined) {
        sq.textContent = 'O';
        turnNum++;
    }
    else if (turnNum % 2 != 0 && playerNum === 1  && sq.textContent != undefined) {
      sq.textContent = 'X';
      turnNum++;
    }
    socket.emit('squareCl', sq);
    socket.emit('newTurn', turnNum);
  }

  socket.on('newTurn', (tn) => {
    turnNum = tn;
  })

  for(square in squares) {
    if (square.value != undefined) {
      console.log(square.value)
    }
  }

    // Listen for button clicks
    button.addEventListener('click', () => {
      socket.emit('toggleColor');
    });

    // Listen for initial color and updates
    socket.on('initialColor', (color) => {
      button.style.backgroundColor = color;
    });

    socket.on('updateColor', (color) => {
      button.style.backgroundColor = color;
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
      }
    });
    
    socket.on('chat message', function (msg) {
      const messageItem = document.createElement('li');
      messageItem.textContent = msg;
      messages.appendChild(messageItem);
    });