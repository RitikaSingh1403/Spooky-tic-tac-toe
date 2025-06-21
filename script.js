document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const gameContainer = document.querySelector('.game-container');
    
    // Game state
    let ghostState = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // X becomes Ghost
    let pumpkinState = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // O becomes Pumpkin
    let turn = 1; // 1 for Ghost and 0 for Pumpkin
    let gameOver = false;
    
    // Create flying bats in background
    function createBats() {
        for (let i = 0; i < 10; i++) {
            const bat = document.createElement('div');
            bat.className = 'bat';
            bat.style.left = Math.random() * 100 + 'vw';
            bat.style.top = Math.random() * 100 + 'vh';
            bat.style.width = (Math.random() * 30 + 20) + 'px';
            bat.style.height = (Math.random() * 30 + 20) + 'px';
            bat.style.animationDuration = (Math.random() * 10 + 10) + 's';
            bat.style.animationDelay = Math.random() * 5 + 's';
            document.body.appendChild(bat);
        }
    }
    
    // Initialize the game
    function initGame() {
        ghostState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        pumpkinState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        turn = 1;
        gameOver = false;
        status.textContent = "Ghost's Turn";
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });
    }
    
    // Check for a winner
    function checkWin() {
        const wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        for (const win of wins) {
            if (ghostState[win[0]] + ghostState[win[1]] + ghostState[win[2]] === 3) {
                highlightWinningCells(win);
                status.textContent = "Ghost Wins! Boo!";
                gameOver = true;
                return 1;
            }
            if (pumpkinState[win[0]] + pumpkinState[win[1]] + pumpkinState[win[2]] === 3) {
                highlightWinningCells(win);
                status.textContent = "Pumpkin Wins! Yay!";
                gameOver = true;
                return 0;
            }
        }
        
        // Check for draw
        if (!ghostState.includes(0) && !pumpkinState.includes(0)) {
            status.textContent = "It's a Draw! Spooky!";
            gameOver = true;
            return -1;
        }
        
        return -1;
    }
    
    function highlightWinningCells(cellsIndexes) {
        cellsIndexes.forEach(index => {
            cells[index].classList.add('winner');
        });
    }
    
    // Handle cell click
    function handleCellClick(e) {
        const index = parseInt(e.target.dataset.index);
        
        // If cell is already taken or game is over, do nothing
        if (ghostState[index] || pumpkinState[index] || gameOver) {
            return;
        }
        
        if (turn === 1) {
            ghostState[index] = 1;
            e.target.textContent = '👻'; // Ghost emoji
            e.target.classList.add('x');
            status.textContent = "Pumpkin's Turn";
        } else {
            pumpkinState[index] = 1;
            e.target.textContent = '🎃'; // Pumpkin emoji
            e.target.classList.add('o');
            status.textContent = "Ghost's Turn";
        }
        
        // Add spooky animation
        e.target.style.transform = 'scale(0)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 100);
        
        // Check for winner
        const result = checkWin();
        
        // If no winner yet, switch turns
        if (result === -1) {
            turn = 1 - turn;
        }
    }
    
    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetButton.addEventListener('click', initGame);
    
    // Initialize the game and bats
    initGame();
    createBats();
});
