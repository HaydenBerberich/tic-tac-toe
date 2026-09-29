const Gameboard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;

    const reset = () => board = ['', '', '', '', '', '', '', '', ''];

    const placeMarker = (index, mark) => { 
        board[index] = mark;
        console.log(board);
    }

    return {
        getBoard,
        reset,
        placeMarker
    }
})();

const Player = (name, mark) => {
    return {
        name,
        mark,
    }
}

const GameController = (() => {
    let player1;
    let player2;
    let activePlayer;

    const getActivePlayer = () => activePlayer;

    const startGame = (name1, name2) => {
        player1 = Player(name1, 'x');
        player2 = Player(name2, 'o');

        activePlayer = player1;
    }

    const switchPlayer = () => activePlayer = activePlayer === player1 ? player2 : player1;

    const isValidMove = (index) => Gameboard.getBoard()[index] === '';

    const checkWin = () => {
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]

        const board = Gameboard.getBoard();

        return winningCombos.some(combo => {
            return board[combo[0]] === activePlayer.mark &&
                   board[combo[1]] === activePlayer.mark &&
                   board[combo[2]] === activePlayer.mark;
        })
    }

    const checkTie = () => {
        const board = Gameboard.getBoard();

        return board.every(cell => cell !== '');
    }

    const getGameStatus = () => {
        if (checkWin()) return 'win';
        if (checkTie()) return 'tie';
    }

    const playRound = (index) => {
        if (!isValidMove(index)) return;

        Gameboard.placeMarker(index, activePlayer.mark);

        const status = getGameStatus();
        if (status) return status;

        switchPlayer();
    }

    return {
        startGame,
        playRound,
        getActivePlayer,
    }
})();

const displayController = (() => {
    const dialog = document.querySelector('#get-players');
    const newGameButton = document.querySelector('#new-game')

    newGameButton.addEventListener('click', () => {
        dialog.showModal();
    });

    const playerForm = document.querySelector('form');

    const cells = document.querySelectorAll('.cell');

    const renderBoard = () => {
        const board = Gameboard.getBoard();

        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        })
    }

    playerForm.addEventListener('submit', () => {
        const name1 = document.querySelector('#player-one');
        const name2 = document.querySelector('#player-two');

        GameController.startGame(name1.value, name2.value);

        Gameboard.reset();
        renderBoard();

        const player1Header = document.querySelector('#player-one-header');
        player1Header.textContent = name1.value;
        const player2Header = document.querySelector('#player-two-header');
        player2Header.textContent = name2.value;
        name1.value = '';
        name2.value= '';
    });

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const index = cell.dataset.index;

            const status = GameController.playRound(index);
            renderBoard();

            const statusDisplay = document.querySelector('#status');

            if (status === 'win') {
                statusDisplay.textContent = `${GameController.getActivePlayer().name} wins!`
            } else if (status === 'tie') {
                statusDisplay.textContent = 'Tie';
            }
        })
    })
})();