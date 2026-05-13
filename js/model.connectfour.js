"use strict";

//TODO: Think of this model as the game-logic.
//      The model knows everything that is necessary to manage
//      the game. It knows the players, know who's turn it is,
//      knows all the stones and where they are, knows if the
//      game is over and if so, why (draw or winner). It knows
//      which stones are the winning stones. The model also has
//      sovereignty over the battlefield.
//      First step: Create your model-object with all the properties
//      necessary to store that information.

export const model = new EventTarget()
model.currentPlayer = "thor";
model.isGameOver = false;
model.rows = 7;
model.cols = 6;



//Done: Prepare some customEvents. The model should dispatch events when
//      - The Player Changes
//      - A stone was inserted
//      - The Game is over (Draw or Winner)
//      Don't forget to give your events a namespace.
//      For each customEvent, just make a >method< for your model-object,
//      that, when called, dispatches the event. Nothing else should
//      happen in those methods.

//player changes
const status = document.querySelector(".status");


model.playerChanges = function() {
    const ev = new CustomEvent("game:change", {
        detail: {currentPlayer: this.currentPlayer}
    });
    this.dispatchEvent(ev);
}

model.stoneInserted = function (row, col, player) {
    let stone = new CustomEvent("game:stone", {
        detail: {
            row,
            col,
            player,
        }
    });
    this.dispatchEvent(stone);
}

model.gameOver = function (winner, winningStones) {
    let reason;

    if (winner) {
        reason = "win";
    } else {
        reason = "draw"
    }
    let over = new CustomEvent("over", {
        detail: {
            winner,
            reason,
            winningStones,
        }
    });
    this.dispatchEvent(over);
}

//Todo: Initiate the battlefield. Your model needs a representation of the
//      battlefield as data (two-dimensional array). Obviously, there are
//      no stones yet in the field.


model.gameBoard = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    ];



//TODO: The model should offer a method to insert a stone at a given column.
//      If the stone can be inserted, the model should insert the stone,
//      dispatch an event to let the world know that the battlefield has changed
//      and check if the game is over now.
//      Hint: This method will be called later by your controller, when the
//      user makes an according input.

let isGameOver = false;
let rows = 6;
let cols = 7;

const board = document.getElementById("board");

export function createGameBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const disc = document.createElement("div");
            disc.classList.add("cell");
            disc.setAttribute("data-col", c); //in html: <div class="cell" data-col="3"></div>
            disc.setAttribute("data-row", r);
            board.appendChild(disc);
        }
    }
}

export let insertStone = {
    init() {
        board.addEventListener("click", (e) => {

            status.classList.remove(`${model.currentPlayer}-selected`);

            let cell = e.target.closest(".cell");
            if (!cell || isGameOver) return;
            let col = parseInt(cell.getAttribute("data-col"));

            if (e.target.classList.contains("cell") && !isGameOver) {

                for (let row = rows - 1; row >= 0; row--) {

                    let clickedCell = board.querySelector(
                        `[data-row="${row}"][data-col="${col}"]`
                    );

                    if (!clickedCell.classList.contains("thor") && !clickedCell.classList.contains("loki")) {

                        //insert stone
                        model.gameBoard[row][col] = model.currentPlayer;
                        clickedCell.classList.add(model.currentPlayer);
                        model.stoneInserted(row, col, model.currentPlayer);


                        //change players
                        let previous = model.currentPlayer;
                        model.changePlayer();

                        //event: player changes
                        status.classList.add(`${model.currentPlayer}-selected`);

                        //Check win
                        if (checkWin()) {
                            isGameOver = true;

                            //Event: gameOver
                            model.gameOver(previous, []);
                        }

                        break;
                    }

                }
            }
        });
    }
};


//Done: Methods to check if the game is over, either by draw or a win.
//      Let the world know in both cases what happened. If it's a win,
//      Don't forget to store the winning stones and add this >detail<
//      to your custom event.

function checkWin(){
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c <= 4; c++) {
            const player = model.gameBoard[r][c];
            if (player) {
                if (player === model.gameBoard[r][c + 1] && player === model.gameBoard[r][c + 2] && player === model.gameBoard[r][c + 3]) {
                    return true;
                }
            }
        }
    }

    //Vertical win
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r <= 4; r++) {
            const player = model.gameBoard[r][c];
            if (player) {
                if (player === model.gameBoard[r +1][c] && player === model.gameBoard[r + 2][c] && player === model.gameBoard[r + 3][c]) {
                    return true;
                }
            }
        }
    }

    //Diagonal win
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c <= cols - 4; c++) {
            const player = model.gameBoard[r][c];
            if (player) {
                if (player === model.gameBoard[r - 1][c +1] && player === model.gameBoard[r - 2][c +2] && player === model.gameBoard[r - 3][c + 3]) {
                    return true;
                }
            }
        }
    }

    //Antidiagonal win
    for (let r = 0; r <= rows -4; r++) {
        for (let c = 0; c <= cols - 4; c++) {
            const player = model.gameBoard[r][c];
            if (player) {
                if (player === model.gameBoard[r + 1][c + 1] && player === model.gameBoard[r + 2][c + 2] && player === model.gameBoard[r + 3][c + 3]) {
                    return true;
                }
            }
        }
    }

    return false;
}

//TODO: Method to change the current player (and dispatch the according event).

model.changePlayer = function() {
    if (this.currentPlayer === "thor") {
        this.currentPlayer = "loki";
    } else {
        this.currentPlayer = "thor";
    }
    this.playerChanges();
}