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
be used on the entire program
*/

let currentTurn = 0;
let playedPieces = [];
let players = [];

class Player {
	constructor(playerNum){
		this.number = playerNum;
		this.selectedPiece = "big-piece";
		this.bigPieces = 8;
		this.longPieces = 8;
		this.smallPieces = 3;
		this.points = 0;
		this.colors = ["TODO..."]
	}

	playPiece(){
		switch(this.selectedPiece){
		case "big-piece":
			this.bigPieces -= 1;
			document.querySelector(`.big-piece .P${this.number}-piece`).innerHTML = this.bigPieces;
		case "horizontal-long-piece":
		case "vertical-long-piece":
			this.longPieces -= 1;
			document.querySelector(`.horizontal-long-piece .P${this.number}-piece`).innerHTML = this.longPieces;
			document.querySelector(`.vertical-long-piece .P${this.number}-piece`).innerHTML = this.longPieces;
		case "small-piece":
			this.smallPieces -= 1;
			document.querySelector(`.small-piece .P${this.number}-piece`).innerHTML = this.smallPieces;
		}
	}
}

let P1 = new Player(1);
let P2 = new Player(2);

players.push(P1);
players.push(P2);

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

// UTILITY FUNCTIONS

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






