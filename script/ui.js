"use strict";

// global variable to hold current Game instance;
let currentGame;

// Find all DOM elements
const $playerForm = $("#player-form");
const $player1NameInput = $("#player-1-name");
const $player1ColorInput = $("#player-1-color");
const $player2NameInput = $("#player-2-name");
const $player2ColorInput = $("#player-2-color");
const $startBtn = $("#start-button");

const $body = $("body");
const $gameBoard = $("#gameBoard");


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
  $gameBoard.empty();

  const $thead = $("<thead>")
    .appendTo($gameBoard);
  const $headRow = $("<tr>")
    .appendTo($thead);

  for (let col = 0; col < game.numCols; col++) {
    const $topCell = $("<th>")
      .addClass("top-cell")
      .attr("id", `t-${col}`)
      .appendTo($headRow);
  }

  const $tableBody = $("<tbody>")
    .appendTo($gameBoard);

  for (let row = 0; row < game.numRows; row++) {
    const $bodyRow = $("<tr>")
      .appendTo($tableBody);
    for (let col = 0; col < game.numCols; col++) {
      const $bodyCell = $("<td>")
        .addClass("body-cell")
        .attr("id", `b-${row}${col}`)
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
  console.log("evt target id: ", evt.target.id);

  const clickedColNum = Number(evt.target.id.replace("t-", ""));

  currentGame.executeMove(clickedColNum);
}

/** This function places the current player's piece in the HTML board.
 * 
 * Accepts: [y, x] - coordinates of matrix where "null" was replaced with the
 *   current player in the current turn.
 *   y - row number of the matrix
 *   x - value number of the matrix
 */
function placeHtmlPiece(coordinates) {
  const [y, x] = coordinates;
  console.log("y: ", y, "x: ", x);
  //create a piece, using current player's color,
  //add the piece to the corresponding board cell via id
  const $piece = $("<div>")
    .addClass("piece")
    .css("background-color", `${currentGame.currPlayer.color}`)
    .appendTo(`#b-${y}${x}`);
}

/** A function that handles UI for ending the game. 
 * Displays end game message and restart button.
 * If there is a winner, it will announce the winner.
 * If there is no winner, it will announce a tie.
*/
function endGame() {
  console.log("endGame");
  console.log("endGame winner: ", currentGame.winner);
  const $gameOverWindow = $("<div>")
    .attr("id", "gameOverWindow")
    .appendTo($body);
  const $gameOverMsg = $("<p>")
    .text("Game Over!")
    .appendTo($gameOverWindow);
  const $winnerMsg = $("<p>")
    .appendTo($gameOverWindow);
  const $replayBtn = $("<button>")
    .addClass("btn")
    .text("Play again?")
    .appendTo($gameOverMsg)
    .on("click", handleRestart)

  //if the winner is not null, it will list the winner's color and name.
  if (currentGame.winner !== null) {
    $winnerMsg
      .text(`The winner is ${currentGame.winner.name}!`)
    //if null, it will announce a tie
  } else (
    $winnerMsg
      .text("It's a tie!")
  )
  //bonus, use Giphy API to generate a random victory gif?
}

/** A function that handles the start of the game upon player form submission.
 * Upon clicking start, the start button will change to say "Restart"
*/
function startGame(evt) {
  evt.preventDefault();

  $startBtn.text("Restart");

  currentGame = new Game();
  makeHtmlBoard(currentGame);
}

/** A function that handles restarting the game upon game over. 
 * It will clear the current game and game over message.
 * It will change the start button to say "Start"
*/
function handleRestart(evt) {
  $("#gameOverWindow").remove();
  $gameBoard.empty();
  $startBtn.text("Start");
}

$playerForm.on("submit", startGame);
$gameBoard.on("click", ".top-cell", handleTopRowClick);
