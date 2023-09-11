const socket = io();


const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
var players = document.getElementById('players');
var turn = document.getElementById('turn');

let turnNum = 1;
let playerNum = 1;
const button = document.getElementById('toggleButton');
var board = document.getElementById('board');
var squares = Array.from(board.getElementsByTagName("li"));

let sqArr = [
  ['z', 'z', 'z'],
  ['z', 'z', 'z'],
  ['z', 'z', 'z']
];

socket.on('playerAssignment', (playerNumber) => {
  playerNum = playerNumber;
  players.textContent = "You are player " + playerNum;

  // You can now use the playerNumber variable as needed on the client side.
});

socket.on('gameFull', () => {
  console.log('The game is already full. Please try again later.');
});


  function sqClick(sq) {
    let sqIndex = squares.indexOf(sq.parentNode);
    let rowIndex = 0;
    if(sqIndex > 5) {
      sqIndex = sqIndex - 6;
      rowIndex = 2;
    }
     else if(sqIndex > 2) {
      sqIndex = sqIndex - 3;
      rowIndex = 1;
    }
    console.log(playerNum);

    if (playerNum === 2) {
      sqArr[rowIndex][sqIndex] = 'O';
        turnNum++;
        // isWinningMove(rowIndex, sqIndex);
    }
    else if (playerNum === 1) {
      sqArr[rowIndex][sqIndex] = 'X';
      turnNum++;
      // isWinningMove(rowIndex, sqIndex);
    }
    console.log("hey   " + sqArr);
    socket.emit('squareCl', sqArr);
    socket.emit('newTurn', turnNum);
  }

  socket.on('newTurn', (tn) => {
    turnNum = tn;
    turn.textContent = 'TURN: ' + turnNum;
  })


  socket.on('updateSqs', (sqsLoad) => {
    console.log("sqs load    " +sqsLoad)
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        sqArr[i][j] = sqsLoad[i][j];
        if(sqArr[i][j] === 'X' || sqArr[i][j] === 'O') {
          squares[i * 3 + j].lastElementChild.textContent = sqArr[i][j];
        }
      }
    }
  })

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
      }
    });
    
    socket.on('chat message', function (msg) {
      const messageItem = document.createElement('li');
      messageItem.textContent = "[Player"+ playerNum + "] " + msg;
      messages.appendChild(messageItem);
    });



  function checkRow(row, char) {
    return row[0] === char &&
    row[1] === char &&
    row[2] === char;
  }

  function checkCol(sqI, char) {
    return sqArr[0][sqI] === char &&
    sqArr[1][sqI] === char &&
    sqArr[2][sqI] === char;
  }

  function checkDiagonal(char) {
    return sqArr[1][1] === char &&
      ((
          sqArr[0][0] === char &&
          sqArr[2][2] === char) ||
        (
          sqArr[0][2] === char &&
          sqArr[2][0] === char
       ))
  }

  function isWinningMove(rowI, sqI) {
    let testChar = sqArr[rowI][sqI];
    if(checkDiagonal(char) || checkRow(sqArr[rowI], testChar) || checkCol(sqI, testChar)) {
      alert(`${testChar} WINS`);
      // clear board
    }



    if(turnNum >= 9) {
      alert('game over');
    }
  }