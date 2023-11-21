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
  $gameBoard.empty();

  const $thead = $("<thead>")
    .appendTo($gameBoard);
  const $headRow = $("<tr>")
    .appendTo($thead);

  for (let col = 0; col < currentGame.numCols; col++) {
    const $topCell = $("<th>")
      .addClass("top-cell")
      .attr("id", `t-${col}`)
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

//TODO: move functions to be in Game class?
function handleTopRowClick(evt) {
  console.log("starting handleTopRowClick");

  console.log("evt target id: ", evt.target.id);
  
  const clickedColNum = Number(evt.target.id.replace("t-", ""));

  const updatedCoords = currentGame.findSpotInCol(clickedColNum);
  if (updatedCoords === undefined) {
    return;
  }

  placeHtmlPiece(updatedCoords);
  
  const winner = currentGame.checkForWin();

  //when the top row doesn't have null, board is full
  const boardIsFull = !currentGame.board[0].includes(null);
  console.log("boardIsFull: ", boardIsFull);
  if (winner) {
    console.log('winner!');
    setTimeout(endGame, 1000);
  } else if (boardIsFull){
    console.log('board is full!'); 
    setTimeout(endGame, 1000);
  }

  currentGame.currPlayer = currentGame.currPlayer === currentGame.players[0] 
    ? currentGame.players[1] 
    : currentGame.players[0];

  console.log('switched current Player: ', currentGame.currPlayer);
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
  //make div with end game message and restart button
  const $gameOverMsg = $("<div>")
    .text("Game over!")
    .appendTo($body);
  const $winnerMsg = $("<div>")
    .appendTo($gameOverMsg);
  const $replayBtn = $("<button>")
    .text("Play again?")
    .appendTo($gameOverMsg);

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


/** A function that handles the start of the game upon player form submission. */
function startGame(evt) {
  evt.preventDefault();
  currentGame = new Game();
  makeHtmlBoard(currentGame);
}

$playerForm.on("submit", startGame);
$gameBoard.on("click", ".top-cell", handleTopRowClick);
