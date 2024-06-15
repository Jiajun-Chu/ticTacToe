function Gameboard(){
  const rows = 3;
  const columns = 3;
  const board = [];

  for(let i=0;i<rows;i++){
    board[i] = [];
    for(let j=0;j<columns;j++){
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (row, column, player) => {
    if(board[row][column].getValue()!=0) return false;
    board[row][column].addToken(player);
    return true;
  }

  const printBoard = () => {
    const boardWithCellValues = board.map((row)=> row.map((cell)=>cell.getValue()))
    return(boardWithCellValues);
  }

  const resetBoard = () => {
    for(let i=0;i<rows;i++){
      for(let j=0;j<columns;j++){
        board[i][j].addToken(0);
      }
    }
  }
  
  return { getBoard, dropToken, printBoard, resetBoard };
}

function Cell(){
  let value = 0;
  const addToken = (player) => {
    value = player;
  }
  const getValue = ()=> value;
  return {addToken, getValue};
};

function GameController(
  playerOneName = "Player One", 
  playerTwoName = "Player Two"
){
  const board = Gameboard();

  const resetGame = () =>{
    board.resetBoard();
    activePlayer = players[0];
  }

  const players = [
    {
      name: playerOneName,
      token: 'O'
    },
    {
      name:  playerTwoName,
      token: 'X'
    }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1]: players[0];
  };
  const getActivePlayer = () => activePlayer;

  /*const printNewRound = () => {
    let message = `${getActivePlayer().name}'s turn.`;
    currentBoard = board.printBoard();
    return(currentBoard, message);
  }
  */

  const checkWin = ()=>{
    const b = board.printBoard();
    const rows = 3
    const columns = 3
    const numPlayer = 2

    for(let i=0;i<numPlayer;i++){
      const token = players[i].token;
      for(let j=0;j<rows;j++){
        if(b[j][0]==token&&b[j][1]==token&&b[j][2]==token){
          return players[i];
        }
        if(b[0][j]==token&&b[1][j]==token&&b[2][j]==token){
          return players[i];
        }
        }
        if(b[0][0]==token&&b[1][1]==token&&b[2][2]==token){
        return players[i];
        }
    }
    return false;
  }

  const checkFull = ()=>{
    const b = board.printBoard();
    const rows = 3
    const columns = 3

    for(let i=0;i<rows;i++){
      for(let j=0;j<columns;j++){
        if(b[i][j]==0) return false;
      }
    }
    return true;
  }

  const playRound = (row,column,cell) => {
    if(!board.dropToken(row,column,getActivePlayer().token)) return `Error! The cell is occupied!` ;
    cell.textContent = getActivePlayer().token;
    const result = checkWin();
    const full = checkFull();
    if(result) return `Game over. ${result.name} wins! Please reset the game.`;
    if(full) return  `Game over. It is a tie! Please reset the game.`

    switchPlayerTurn();
    let message = `Next is ${getActivePlayer().name}'s turn`

    //printNewRound();
    return message;
  }

  //let message = printNewRound();

  return {
    playRound,
    getActivePlayer,
    resetGame,
  };
};

const startDiv = document.querySelector('.start');
const messageDiv = document.querySelector('.message');
const boardDiv = document.querySelector('.gameboard');
const cellsDiv = document.querySelectorAll('.cell');

const game = GameController("Bob","Carol");

startDiv.addEventListener('click',()=>{
  game.resetGame();
  Array.from(cellsDiv).map(cell=>cell.textContent="");
  messageDiv.textContent = `Game Start! Please enjoy your game!`
})

boardDiv.addEventListener('click',(e)=>{
  if(!e.target.classList.contains("cell")) return;
  const cell = e.target;
  const row = parseInt(cell.classList[0].charAt(1));
  const col = parseInt(cell.classList[1].charAt(1));

  const message = game.playRound(row,col,cell);
  messageDiv.textContent = message;
})

