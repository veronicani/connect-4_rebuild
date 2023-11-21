
"use strict";
/** Game class: provides functionality for creating a game instance
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
    //

  }

  /** This function gets (currently only 2) new Player instances 
   *   and assigns them to variables.
   * 
   * Accepts: number of players (integer)
   * 
   * Returns: An array of player variables, each assigned to a Player instance
   */
  getPlayers() {
    const p1 = Player.makePlayer("p1", $player1Input.val());
    const p2 = Player.makePlayer("p2", $player2Input.val());
    console.log('p1: ', p1, 'p2: ', p2);
    return [p1, p2];
  }

  /** A function that finds the next available spot for the column
   * in the board the current player clicks to drop their piece in, 
   * and updates the board with the current player's piece. 
   * 
   * Input: x - an integer, representing the chosen column number.
   * 
   * Returns: 
   *   - true, if a current player's piece has been placed in an available spot.
   *   - false, if all spots of the column are filled, and player has not placed piece.
  */
  findSpotInCol(x) {
    //check each row of the board at the index of x, starting from the bottom
    //if there is a 'null', replace with current player, return true

    //if reached top, return false;
  }

  /** A function that checks if there is a winning move made by the current player.
   * If there is a winning move, it will update the Game instance's .winner
   * with the current player.
   * 
   * Returns:
   *  - true: the current player has made a winning move
   *  - false: the current player has not made a winning move
  */
  checkForWin() {

    //iterate over the board, via y, y < rowNum, y++
      //iterate over the board via x, x < colNum, x++
        //do a sweep of the board, starting from current y, and current x
        //assign LR, TP, DR, DL coords
          //left to right: [[y][x], [y][x + 1], [y][x + 2], [y][x + 3]]
          //top to bottom: board[y][x], board[y+1][x], board[y+2][x], board[y+3][x]
          //diagonal right: board[y][x], board[y+1][x+1], board[y+2][x+2], board[y+3][x+3]
          //diagonal left: board[y][x], board[y-1][x+1], board[y-2][x+2], board[y-3][x+3]
        //if either (LR || TP || DL || DR) coords match the current player
          //update the game .winner to this. currentplayer
    
    function _win(coordinates) {
      //[[0,0], [0,1], [0,2], [0,3]]
      //e.g. [board[0][0], board[0][1], board[0][2], board[0][3], board[0][4]
      //[null, p1, p1, p1]
      //iterate over the array of coordinates
        //map the coordindates to their values in the board
      //if all values are the current Player
        //return true
      //return false;
    }
    
  }   

  /** A function that triggers a sequence of events based on where the 
   *   current player chooses to place their piece.
   * After the player has placed a piece, it will check if the player has won.
   *   If so, it will end the game.
   * If there are still available spots on the board, it will switch 
   *   the current player.
  */
  executeMove(x) {
    //if findSpotInCol => false
    //return
    //check if there is a winner
    //if yes, end the game with the winner -- delay this by 1 sec so HTML can update
      //return 
    //check if there are still board spots avail
      //if so, switch current player
      //else, end the game w/o a winner -- delay this by 1 sec so HTML can update
  }
}

/**TODO: describe Player class */
class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }

  /** Creates a new Player instance*/
  static makePlayer(name, color) {
    console.log('player name: ', name);
    console.log('player color: ', color);
    return new Player(name, color);
  }
}


