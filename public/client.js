const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
var players = document.getElementById('players');
var turn = document.getElementById('turn');

let playerNum = 0;
let turnNum = 1;
    // Get the button element
    const button = document.getElementById('toggleButton');
var board = document.getElementById('board');
const squares = Array.from(board.getElementsByTagName("li"));

let sqArr = ['Z', 'Z', 'Z', 'Z', 'Z', 'Z', 'Z', 'Z', 'Z'];

socket.on('newPlayer', (p) => {
  playerNum = p;
  players.textContent = playerNum;
});

  function sqClick(sq) {
    if (turnNum % 2 === 0 && playerNum === 2 && sq.textContent != undefined) {
      console.log("index " + squares.indexOf(sq.parentNode));
      sqArr[ squares.indexOf(sq.parentNode)] = 'O';

        turnNum++;
    }
    else if (turnNum % 2 != 0 && playerNum === 1  && sq.textContent != undefined) {
      console.log("index " + squares.indexOf(sq.parentNode));
      sqArr[ squares.indexOf(sq.parentNode)] = 'X';
      turnNum++;
    }
    socket.emit('squareCl', sqArr);
    socket.emit('newTurn', turnNum);
  }

  socket.on('newTurn', (tn) => {
    turnNum = tn;
    turn.textContent = 'TURN: ' + turnNum;
  })


  socket.on('updateSqs', (sqs) => {
    sqArr = sqs;
    for(i=0; i < sqArr.length; i++) {
      if(sqArr[i] != 'Z') {
        squares[i].lastElementChild.textContent = sqArr[i];
      }
    }
  })



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