"use strict";

// global variable to hold current Game instance;
let currentGame;

// global constants
const PLAYER_MAX = 4; 
const ADDITIONAL_PLAYER_COLORS = {
  3: "#ffc800",
  4: "#7acc00"
}

// Find all DOM elements
const $playerForm = $("#player-form");
const $playerInputs = $("#player-inputs");
const $defaultPlayerNameInputs = $(".player-name-input");

const $addPlayer = $("#add-player");
const $startBtn = $("#start-button");

const $body = $("body");
const $gameBoard = $("#gameBoard");
const $gameOverWindow = $("#gameOverWindow");
const $gameOverResult = $("#gameOverResult");
// const $gameOverGifArea = $("#gameOverGif");
const $replayBtn = $("#replayButton");

/******************************************************************************
 * A function that creates an HTML table for the current Game instance.
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
async function endGame() {
  console.log("endGame");
  console.log("endGame winner: ", currentGame.winner);

  $gameOverResult.empty();
  $gameOverWindow.show();
  const $winnerMsg = $("<p>")
    .appendTo($gameOverResult);

  const $gameOverGif = $("<img>")
    .attr("id", "gameOverGif")
    .appendTo($gameOverResult);

  //if the winner is not null, it will list the winner's color and name.
  if (currentGame.winner !== null) {
    $winnerMsg
      .text(`${currentGame.winner.name} wins!`);

    const $winGifLink = await Gif.getGifLink("win");
    // console.log("$winGifLink: ", $winGifLink, "type: ", typeof $winGifLink);
    $gameOverGif
      .attr("src", $winGifLink)
    //if null, it will announce a tie
  } else {
    $winnerMsg
      .text("It's a tie!");

    const $tieGifLink = await Gif.getGifLink("tie");
    $gameOverGif
      .attr("src", $tieGifLink)

  }

  $replayBtn.on("click", handleRestart);
}

/** A function that handles restarting the game upon game over. 
 * It will clear the current game and hide the game over message.
 * It will change the start button to say "Start"
*/
function handleRestart(evt) {
  $gameOverWindow.hide();
  $gameBoard.empty();
  $startBtn.text("Start");
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

/** A function that handles adding a new player input on the player form
 * when the '+ Add player' link is clicked.
 */

let extraPlayerNum = $defaultPlayerNameInputs.length + 1;

function addPlayerInput(evt) {
  evt.preventDefault();
  console.log('extraPlayerNum: ', extraPlayerNum);
  if (extraPlayerNum <= PLAYER_MAX) {
    const $inputArea = $("<div>")
      .addClass("col-12 col-sm-6")
      .appendTo($playerInputs);
    const $playerNameLabel = $("<label>")
      .attr("for", `player-${extraPlayerNum}-name`)
      .text(`Player ${extraPlayerNum}`)
      .appendTo($inputArea);
    const $playerNameInput = $("<input>")
      .attr("id", `player-${extraPlayerNum}-name`)
      .addClass("player-name-input")
      .attr("type", "text")
      .val(`Player ${extraPlayerNum}`)
      .appendTo($inputArea);
    const $playerColorLabel = $("<label>")
      .attr("for", `player-${extraPlayerNum}-color`)
      .text(`Player ${extraPlayerNum} Color`)
      .appendTo($inputArea);
    const $playerColorInput = $("<input>")
      .attr("id", `player-${extraPlayerNum}-color`)
      .addClass("player-color-input")
      .attr("type", "color")
      .val(`${ADDITIONAL_PLAYER_COLORS[extraPlayerNum]}`)
      .appendTo($inputArea);
    
      extraPlayerNum++;
  }

}



$playerForm.on("click", "#add-player", addPlayerInput);
$playerForm.on("submit", startGame);

$gameBoard.on("click", ".top-cell", handleTopRowClick);

