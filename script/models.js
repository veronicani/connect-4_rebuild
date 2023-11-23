"use strict";

const BASE_GIPHY_URL = 'http://api.giphy.com/v1';
const GIPHY_API_KEY = 'MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym';
/******************************************************************************
 * Game class: provides functionality for creating a game instance
 *    and handling non-UI game logic.
 *
 *  Game will have:
 *  - numRows: number of rows for game board (int)
 *  - numCols: number of columns for game board (int)
 *  - players: an array of Player instances
 *      [{name: 'p1', color: 'tomato'}, {name: 'p2', color: 'green'}]
 *  - currPlayer: instance of the current player
 *  - board: a matrix for the current game, an array of [numRows] rows, 
 *     with [numCols] values. Each value will either be 'null' (for no piece placed),
 *     or the player variable of the piece placed.
 *    [
 *      [ null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null ],
        [ null,   p2, null,   p1, null, null, null ],
      ];
    - winner: variable of the winning player
 */
class Game {
  constructor(numRows = 6, numCols = 7) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.players = this.getPlayers();
    this.currPlayer = this.players[0];
    this.board = this.makeBoard();
    this.winner = null;
  }

  /** Makes a matrix for the board to be updated with player variables
   *   of the pieces placed.
   * 
   * Returns: a nested array for .board with [numRows] subarrays,
   *   each with [numCols] values. 
   *   All values will initially be set to 'null'.
   *  [
        [ null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null ],
      ];
   */
  makeBoard() {
    const matrix = [];
    for (let row = 0; row < this.numRows; row++) {
      const row = [];
      for (let col = 0; col < this.numCols; col++) {
        row.push(null);
      }
      matrix.push(row);
    }
    return matrix;
  }
  //TODO: make accept multiple players -- no need to assign to variables
  //just use a for loop
  /** This function gets (currently only 2) new Player instances 
   *   and assigns them to variables.
   * 
   * Accepts: number of players (integer)
   * 
   * Returns: An array of Player instances
   */
  getPlayers() {
    const p1 = Player.makePlayer($player1NameInput.val(), $player1ColorInput.val());
    const p2 = Player.makePlayer($player2NameInput.val(), $player2ColorInput.val());
    console.log('p1: ', p1, 'p2: ', p2);
    return [p1, p2];
  }

  /** A function that finds the next available spot for the column
   *   in the board the current player clicks to drop their piece in, 
   *   and updates the board with the current player's piece. 
   * 
   * Input: x - an integer, representing the chosen column number.
   * 
   * Returns: 
   *   - [y, x] - coordinates of the newly played piece if there is an available spot.
   *   - false, if all spots of the column are filled, and player has not placed piece.
   */
  findSpotInCol(x) {
    console.log("starting findSpotInCol");
    if (this.winner !== null) return;
    //check each row of the board at the index of x, starting from the bottom
    for (let y = this.numRows - 1; y >= 0; y--) {
      //if there is a 'null', replace with current player, return the [x,y] positon
      console.log('search coords: ', `(${y},${x})`);
      if (this.board[y][x] === null) {
        this.board[y][x] = this.currPlayer.name;
        console.log('new piece coordinates: ', `(${y},${x})`);
        console.log('updated board: ', this.board);
        return [y, x];
      }
    }
    //if reached top, return false;
    console.log("no space available");
    return undefined;
  }

  /** A function that checks if there is a winning move made by the current player.
   * If there is a winning move, it will update the Game instance's .winner
   *   with the current player.
   * 
   * Returns:
   *  - true: the current player has made a winning move
   *  - false: the current player has not made a winning move
   */
  checkForWin() {

    const _win = (coordinates) => {
      //if some coordinates are not legal, return false
      const illegalMove = coordinates.some(([y, x]) => {
        return y < 0 || x < 0 || y >= this.numRows || x >= this.numCols
      });

      if (illegalMove) return false;

      //if all legal coordinates match current player, return true
      const winningCombo = coordinates.every(([y, x]) => {
        return this.board[y][x] === this.currPlayer.name;
      });
      // console.log(`winningCombo: `, winningCombo);

      if (winningCombo) return true;
    }

    //iterate over the board, via y, y < rowNum, y++
    for (let y = 0; y < this.numRows; y++) {
      //iterate over the board via x, x < colNum, x++
      for (let x = 0; x < this.numCols; x++) {
        //do a sweep of the board, starting from current y, and current x
        //assign LR, TP, DR, DL coords
        const LR = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const TB = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const DR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const DL = [[y, x], [y - 1, x + 1], [y - 2, x + 2], [y - 3, x + 3]];
        //if either (LR || TP || DL || DR) coords match the current player
        if (_win(LR) || _win(TB) || _win(DR) || _win(DL)) {
          //update the game .winner to this. currentplayer
          this.winner = this.currPlayer;
          return true;
        }
      }
    }
    return false;
  }

  /** A function that triggers a sequence of events based on where the 
   *   current player chooses to place their piece.
   * After the player has placed a piece, it will check if the player has won.
   *   If so, it will end the game.
   * If there are still available spots on the board, it will switch 
   *   the current player.
  */
  executeMove(x) {

    const updatedCoords = currentGame.findSpotInCol(x);
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
    } else if (boardIsFull) {
      console.log('board is full!');
      setTimeout(endGame, 1000);
    }

    currentGame.currPlayer = currentGame.currPlayer === currentGame.players[0]
      ? currentGame.players[1]
      : currentGame.players[0];

    console.log('switched current Player: ', currentGame.currPlayer);
  }
}

/******************************************************************************
 * Player class: provides functionality for creating a player instance
 *
 *  Player will have:
 *  - name: name of the player
 *  - color: color of the player's piece
 */
class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }

  /** Creates a new Player instance */
  static makePlayer(name, color) {
    console.log('player name: ', name);
    console.log('player color: ', color);
    return new Player(name, color);
  }
}

/******************************************************************************
 * Gif class: provides functionality for creating a gif instance to add to the
 *   Game Over UI.
 *   
 *   Makes an AJAX request to the Giphy API and returns a single random GIF.
 *   
 *  Gif will have:
 *  - input
 *  
 */

class Gif {
  constructor(tag) {
    this.tag = tag;
  }

  /** Makes a fetch request to Giphy API for a random Gif based on the input tag.
   * 
   * Input: this is the search tag that the result gif will relate to.
   *   either 'win' or 'tie game' 
   * 
   * Returns: a response data object from Giphy API.
  */
  static async fetchGifData(keyword) {
    console.log('starting fetchGifData');
    const giphySearchParams = new URLSearchParams(
      {
        tag: keyword,
        api_key: GIPHY_API_KEY
      });

    const response = await fetch
      (`${BASE_GIPHY_URL}/gifs/random/?${giphySearchParams}`);
    console.log("reponse data:", response);
    return await response.json();
  }

  /** Extracts gif link from response data object returned from Giphy API.
   * 
   * Input: response data object
   * 
   * Returns: a string of the link to the gif.
   */
  static getLinkFromGifData(responseObj) {
    console.log('starting getLinkFromGifData');
    console.log('responseObj: ', responseObj);
    const link = responseObj.data.images.downsized.url
    console.log('giphy gif link: ', link);
    return link;
  }

  /** This function controls other functions to get a random gif link
   * from Giphy API.
   * 
   * Input: keyword - this will be either 'win' or 'tie game'
   * 
   * Returns: a string of the gif link to embed into the UI.
   */
  static async getGifLink(keyword) {
    console.log('starting getGif');
    const response = await this.fetchGifData(keyword);
    const link = this.getLinkFromGifData(response);
    return link;
  }
}