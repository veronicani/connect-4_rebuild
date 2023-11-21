"use strict";

// global let game to hold current Game instance;
let currentGame;

// Find all DOM elements
const $playerForm = $("#player-form");
const $player1Input = $("#player-1");
const $player2Input = $("#player-2");
const $startBtn = $("#start-button");

const $body = $("body");
const $gameBoard = $("#gameBoard");
const $topRow = $(".top-cell");

/** A function that creates an HTML table for the current Game instance.
 * Creates a top row for the game board where players can click to drop pieces.
 * 
 * - Table head row: Additional row containing cells that player can click on.
 *   - Each top cell will have an id indicating the column of the cell.
 * - Table body: follows dimensions of current Game instance.
 *   - Table rows: current game's [numRows]
 *   - Table data cells: current game's [numCols]
 * 
 * Accepts: the current Game instance
*/
function makeHtmlBoard(game) {
  
  const $thead = $("<thead>")
    .appendTo($gameBoard);
  const $headRow = $("<tr>")
    .appendTo($thead);

  for (let col = 0; col < currentGame.numCols; col++) {
    const $topCell = $("<th>")
      .addClass("top-cell")
      .attr("id", `top-${col}`)
      .appendTo($headRow);
  }

  const $tableBody = $("<tbody>")
    .appendTo($gameBoard);

  for (let row = 0; row < currentGame.numRows; row++) {
    const $bodyRow = $("<tr>")
      .appendTo($tableBody);
    for (let col = 0; col <currentGame.numCols; col++) {
      const $bodyCell = $("<td>")
        .addClass("body-cell")
        .appendTo($bodyRow);
    }
  }
}

/** A function that handles clicks to the top row of the HTML board.
 * Will execute in game logic to make the current player's move,
 *   and update the HTML board accordingly. 
 * 
 * Accepts: the event of clicking on a cell in the top row of the HTML board.
 */
function handleTopRowClick(evt) {
  console.log("starting handleTopRowClick");

}

/** A function that handles UI for ending the game. 
 * Displays end game message and restart button.
 * If there is a winner, it will announce the winner.
 * If there is no winner, it will announce a tie.
*/
function endGame(winner) {
  //make div with end game message and restart button
  //if the winner is not undefined, it will list the winner's color and name.
  //if undefined, it will announce a tie

  //bonus, use Giphy API to generate a random victory gif?
}


/** A function that handles the start of the game upon player form submission. */
function startGame(evt) {
  evt.preventDefault();
  currentGame = new Game();
  makeHtmlBoard(currentGame);
}

$playerForm.on("submit", startGame);
$gameBoard.on("click", ".top-cell", handleTopRowClick);
