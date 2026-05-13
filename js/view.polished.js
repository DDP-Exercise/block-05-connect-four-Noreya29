"use strict";

import {model} from "./model.connectfour.js";

let board = document.getElementById("board");
let status = document.querySelector(".status");
let winnerC = document.querySelector(".winner");

//TODO: Think of this view as your game board.
//      Your view should listen to various custom events of your model.
//      For each event of your model, there should be a clear visual
//      representation of what's going on.

model.addEventListener("game:stone", (e) => {
    let {row, col, player} = e.detail;

    let cell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`)
    cell.classList.add(player);
})

//TODO: Update the field. Show the whole battlefield with all the stones
//      that are already played.

function renderingBoard() {
    for (let row = 0; row < model.rows; row++) {
        for (let col = 0; col < model.cols; col++) {
            let cell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            let value = model.gameBoard[row][col];

            //Reset
            cell.classList.remove("thor", "loki");

            //Set stone
            if(value ==="red") cell.classList.add("thor");
            if (value === "yellow") cell.classList.add("loki");
        }
    }
}

//TODO: Show the current player

model.addEventListener("game:change", (e) => {
    let {currentPlayer} = e.detail;
    status.textContent = `Aktueller Spieler: ${currentPlayer}`;
})

//TODO: Notify the player when the game is over. Make it clear how the
//      Game ended. If it's a win, show the winning stones.

model.addEventListener("over", (e) => {
    let {winner, reason} = e.detail;

    if (reason === "draw") {
        winnerC.textContent = "Unentschieden!";
        return;
    }
    winnerC.textContent = `Gewinner: ${winner}`;
});