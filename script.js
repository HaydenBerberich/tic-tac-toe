class Gameboard {
    #board = ['', '', '', '', '', '', '', '', ''];

    getBoard() {
        return this.#board;
    }

    reset() {
        this.#board = ['', '', '', '', '', '', '', '', ''];
    }

    placeMarker(index, mark) {
        this.#board[index] = mark;
    }
}

class Player {
    constructor(name, mark) {
        this.name = name;
        this.mark = mark;
    }
}

class GameController {
    #player1;
    #player2;
    #activePlayer;
    #winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]

    getActivePlayer() {
        return this.#activePlayer;
    }

    startGame(name1, name2) {
        this.#player1 = new Player(name1, 'x');
        this.#player2 = new Player(name2, 'o');

        this.#activePlayer = this.#player1;
    }

    #switchPlayer() {
        this.#activePlayer = this.#activePlayer === this.#player1 ? this.#player2 : this.#player1;
    }

    #isValidMove(index) {
        return gameboard.getBoard()[index] === '';
    }

    #checkWin() {
        const board = gameboard.getBoard();

        return this.#winningCombos.some(combo => {
            return board[combo[0]] === this.#activePlayer.mark &&
                   board[combo[1]] === this.#activePlayer.mark &&
                   board[combo[2]] === this.#activePlayer.mark;
        })
    }

    #checkTie() {
        const board = gameboard.getBoard();

        return board.every(cell => cell !== '');
    }

    #getGameStatus() {
        if (this.#checkWin()) return 'win';
        if (this.#checkTie()) return 'tie';
    }

    playRound(index) {
        if (!this.#isValidMove(index)) return;

        gameboard.placeMarker(index, this.#activePlayer.mark);

        const status = this.#getGameStatus();
        if (status) return status;

        this.#switchPlayer();
    }
}

class DisplayController {
    #dialog = document.querySelector('#get-players');
    #newGameButton = document.querySelector('#new-game')
    #playerForm = document.querySelector('form');
    #cells = document.querySelectorAll('.cell');
    
    constructor() {
        this.#setUpEventListeners()
    }

    #setUpEventListeners() {
        this.#newGameButton.addEventListener('click', () => {
            this.#dialog.showModal();
        });

        this.#playerForm.addEventListener('submit', () => {
            const name1 = document.querySelector('#player-one');
            const name2 = document.querySelector('#player-two');

            gameController.startGame(name1.value, name2.value);

            gameboard.reset();
            this.#renderBoard();

            const player1Header = document.querySelector('#player-one-header');
            player1Header.textContent = name1.value;
            const player2Header = document.querySelector('#player-two-header');
            player2Header.textContent = name2.value;
            name1.value = '';
            name2.value= '';
        });

        this.#cells.forEach(cell => {
            cell.addEventListener('click', () => {
                const index = cell.dataset.index;

                const status = gameController.playRound(index);
                this.#renderBoard();

                const statusDisplay = document.querySelector('#status');

                if (status === 'win') {
                    statusDisplay.textContent = `${gameController.getActivePlayer().name} wins!`
                } else if (status === 'tie') {
                    statusDisplay.textContent = 'Tie';
                }
            })
        })
    }

    #renderBoard() {
        const board = gameboard.getBoard();

        this.#cells.forEach((cell, index) => {
            cell.textContent = board[index];
        })
    }
}

const gameboard = new Gameboard();
const gameController = new GameController();
const displayController = new DisplayController();