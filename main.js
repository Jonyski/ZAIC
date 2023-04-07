/*
fist we will create an array that stores every cell's DOM element, so that
we have some king of board to manipulate using JS
*/

// 16x16 empty array
let board = [...Array(16)].map(_=>Array(16));

let boardElement = document.getElementById("board");
let boardChildren = boardElement.children;

for (let i = 0; i < boardChildren.length; i++){
	for(let j = 0; j < boardChildren[i].children.length; j++){
		board[i][j] = boardChildren[i].children[j];
	}
}

console.log("The board is ready to use!");
console.log(board);


/*
Now i guess it's a good time to initialize some of the variables that will
be used on the entire program, and also create the players
*/

let currentTurn = 0;
let playedPieces = [];
let players = [];

class Player {
	constructor(playerNum, colors){
		this.number = playerNum;
		this.selectedPiece = "big-piece";
		this.piecesRemaining = new Map();

		this.piecesRemaining.set("big-piece", 8);
		this.piecesRemaining.set("horizontal-long-piece", 8);
		this.piecesRemaining.set("vertical-long-piece", 8);
		this.piecesRemaining.set("small-piece", 3);

		this.points = 0;
		this.colors = colors
	}
	reducePieceCount(pieceType){

		if(pieceType == "horizontal-long-piece" || pieceType == "vertical-long-piece"){
			let newPieceCount = this.piecesRemaining.get(pieceType) - 1
			this.piecesRemaining.set("horizontal-long-piece", newPieceCount);
			this.piecesRemaining.set("vertical-long-piece", newPieceCount);
			document.querySelector(`.P${this.number}-piece.horizontal-long-piece`).innerHTML = `x${this.piecesRemaining.get(pieceType)}`
			document.querySelector(`.P${this.number}-piece.vertical-long-piece`).innerHTML = `x${this.piecesRemaining.get(pieceType)}`
		} else {
			this.piecesRemaining.set(pieceType, this.piecesRemaining.get(pieceType) - 1);
			document.querySelector(`.P${this.number}-piece.${this.selectedPiece}`).innerHTML = `x${this.piecesRemaining.get(pieceType)}`		
		}


	}
}

let P1 = new Player(1, ["#f7d040"]);
let P2 = new Player(2, ["#3b97ed"]);

players.push(P1);
players.push(P2);

let currentPlayer = P1;
/* 
now we initialize the events, they are:
- selecting a piece
- starting the game
- stopping the game
- hovering through the cells with a piece selected
- clicking in a cell with a piece selected
*/

let P1PieceElements = document.getElementById("pieces-container1").children;

for(let i = 0; i < P1PieceElements.length; i++){
	P1PieceElements[i].addEventListener("click", e => {
		document.querySelector(".P1-piece.selected-piece").classList.remove("selected-piece");
		e.target.classList.add("selected-piece");
		P1.selectedPiece = e.target.classList[1];
	});
}

let P2PieceElements = document.getElementById("pieces-container2").children;

for(let i = 0; i < P1PieceElements.length; i++){
	P2PieceElements[i].addEventListener("click", e => {
		document.querySelector(".P2-piece.selected-piece").classList.remove("selected-piece");
		e.target.classList.add("selected-piece");
		P2.selectedPiece = e.target.classList[1];
	});
}

let startStopButton = document.getElementById("start-stop-btn");

startStopButton.addEventListener("click", e => {
	if(e.target.classList[0] == "start"){
		console.log("game started");
		e.target.innerHTML = "STOP";
		//TODO
	} else {
		console.log("game ended");
		e.target.innerHTML = "START";
		//TODO
	}
	e.target.classList.toggle("stop");
	e.target.classList.toggle("start");
});

let cells = document.getElementsByClassName("cell");

for(let i = 0; i < cells.length; i++){
	cells[i].addEventListener("click", e => {
		playPiece(e.target.dataset.x, e.target.dataset.y, currentPlayer.selectedPiece);
	});
}

// GAME DEFINING FUNCTIONS

//funcion isValidPlacing(x, y, pieceType){ TODO }

function playPiece(x, y, pieceType){
	//find index of the cell in the board array
	let coords = getIndexesOfCellByXY(x, y);

	if(currentPlayer.piecesRemaining.get(pieceType) > 0){
		//for each cell, we first change the background, then the owner, then the layer

		board[coords.y][coords.x].style.background = currentPlayer.colors[0];
		board[coords.y][coords.x].dataset.owner = `${currentPlayer.number}`;
		board[coords.y][coords.x].dataset.layer = `${parseInt(board[coords.y][coords.x].dataset.layer) + 1}`;

		if(pieceType == "big-piece"){

			board[coords.y + 1][coords.x].style.background = currentPlayer.colors[0];
			board[coords.y][coords.x + 1].style.background = currentPlayer.colors[0];
			board[coords.y + 1][coords.x + 1].style.background = currentPlayer.colors[0];

			board[coords.y + 1][coords.x].dataset.owner = `${currentPlayer.number}`;
			board[coords.y][coords.x + 1].dataset.owner = `${currentPlayer.number}`;
			board[coords.y + 1][coords.x + 1].dataset.owner = `${currentPlayer.number}`;

			board[coords.y + 1][coords.x].dataset.layer = `${parseInt(board[coords.y + 1][coords.x].dataset.layer) + 1}`;
			board[coords.y][coords.x + 1].dataset.layer = `${parseInt(board[coords.y][coords.x + 1].dataset.layer) + 1}`;
			board[coords.y + 1][coords.x + 1].dataset.layer = `${parseInt(board[coords.y + 1][coords.x + 1].dataset.layer) + 1}`;

		} else if(pieceType == "horizontal-long-piece"){

			board[coords.y][coords.x + 1].style.background = currentPlayer.colors[0];

			board[coords.y][coords.x + 1].dataset.owner = `${currentPlayer.number}`;

			board[coords.y][coords.x + 1].dataset.layer = `${parseInt(board[coords.y][coords.x + 1].dataset.layer) + 1}`;

		} else if(pieceType == "vertical-long-piece"){

			board[coords.y + 1][coords.x].style.background = currentPlayer.colors[0];

			board[coords.y + 1][coords.x].dataset.owner = `${currentPlayer.number}`;

			board[coords.y + 1][coords.x].dataset.layer = `${parseInt(board[coords.y + 1][coords.x].dataset.layer) + 1}`
		}

		currentPlayer.reducePieceCount(pieceType);

		//switches the current player (ternary op)
		currentPlayer = currentPlayer == P1 ? P2 : P1;
		currentTurn++;

	} else {
		window.alert("no pieces remaining");
	}

}


// UTILITY FUNCTIONS
function getIndexesOfCellByXY(x, y){
	for(let i = 0; i < board.length; i++){
		for(let j = 0; j < board[i].length; j++){
			if(board[i][j].dataset.x == x && board[i][j].dataset.y == y){
				return {y: i, x: j};
			}
		}
	}
	console.log("indexes of the cell could not be found");
}

function removeColumn(columnIndex){
	let columnLen = board.length;
	for(let i = 0; i < columnLen; i++) {
		board[i][columnIndex].remove();
		board[i].splice(columnIndex, 1);
	}
}

function removeRow(rowIndex){
	let rowLen = board[rowIndex].length;
	for(let i = 0; i < rowLen; i++){
		board[rowIndex][0].remove();
		board[rowIndex].splice(0, 1);
	}
	board.splice(rowIndex, 1);
	boardChildren[rowIndex].remove();
}






