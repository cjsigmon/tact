  const socket = io();

  // Get the button element
  const button = document.getElementById('toggleButton');
  const playerInfo = document.getElementById('playerInfo');

  // Listen for player information
  socket.on('player', (player) => {
    playerInfo.textContent = `You are Player ${player}`;
    button.disabled = false;
  });

  // Listen for button clicks
  button.addEventListener('click', () => {
    socket.emit('toggleColor');
  });

  // Listen for initial color and updates
  socket.on('updateColor', ({ player, color }) => {
    if (player === 1 || player === 2) {
      button.style.backgroundColor = color;
    }
  });

  // Handle room full scenario
  socket.on('full', () => {
    playerInfo.textContent = 'The room is full. You cannot join as a player.';
    button.disabled = true;
  });
