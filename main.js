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

board[7][7].classList.add("center-cells");
board[7][8].classList.add("center-cells");
board[8][7].classList.add("center-cells");
board[8][8].classList.add("center-cells");

let emptyBoard = deepCopy2DArray(board);

console.log("The board is ready to use!");
console.log(board);


/*
Now i guess it's a good time to initialize some of the variables that will
be used on the entire program, and also create the players
*/

let currentTurn = 0;
let playedPieces = [];
let currentPieceID = 0;
let players = [];
let gameStarted = true;

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

let P1 = new Player(1, ["#f7d040", "#f7ba40", "#ed9e37", "#e67a2e", "#d6511c", "#c73814", "#c72c14", "#c20c0c"]);
let P2 = new Player(2, ["#3b97ed", "#3b79ed", "#3259e6", "#2727d6", "#411dd1", "#3d14c4", "#2f07b3", "#24009c"]);

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
		startGame();
	} else {
		console.log("game ended");
		e.target.innerHTML = "START";
		endGame();
	}
	e.target.classList.toggle("stop");
	e.target.classList.toggle("start");
});

let cells = document.getElementsByClassName("cell");

for(let i = 0; i < cells.length; i++){
	cells[i].addEventListener("click", e => {
		playPiece(e.target.dataset.x, e.target.dataset.y, currentPlayer.selectedPiece);
	});

	cells[i].addEventListener("mouseenter", e => {
		if(e.target.dataset.layer > 0){
			e.target.innerHTML = e.target.dataset.layer;
		}
	});

	cells[i].addEventListener("mouseleave", e => {
		e.target.innerHTML = "";
	});
}

// GAME DEFINING FUNCTIONS

function isValidPlay(x, y, pieceType){

	if(!gameStarted){
		return false
	}

	// the layer var is more like "what the layer wil be after the piece is placed"
	let owner = currentPlayer.number;
	let layer = parseInt(board[y][x].dataset.layer) + 1;

	// first, check if the piece is not going off-board
	if(pieceType == "big-piece"){
		if(currentTurn == 0){
			if(x != 7 || y != 7){
				window.alert("please start at the middle of the board");
				return false
			}
		}

		if(y + 1 >= board.length || x + 1 >= board[y].length){
			return false;
		}

	} else if(pieceType == "horizontal-long-piece"){
		if(currentTurn == 0){
			if(!(x == 7 && y == 7) && !(x == y && y == 8)){
				console.log(`x:${x} y:${y}`);
				window.alert("please start at the middle of the board");
				return false
			}
		}

		if(x + 1 >= board[y].length){
			return false;
		}

	} else if(pieceType == "vertical-long-piece"){
		if(currentTurn == 0){
			if(!(x == 7 && y == 7) && !(x == 8 && y == 7)){
				console.log(`x:${x} y:${y}`);
				window.alert("please start at the middle of the board");
				return false
			}
		}

		if(y + 1 >= board.length){
			return false;
		}

	} else if(pieceType == "small-piece"){
		if(currentTurn == 0){
			if(!(x == 7 && y == 7) && !(x == 7 && y == 8) && !(x == 8 && y == 7) && !(x == 8 && y == 8)){
				console.log(`x:${x} y:${y}`);
				window.alert("please start at the middle of the board");
				return false
			}
		}

	}

	// now, we check if the piece is neighbor to any friendly piece in the same layer
	if(!hasValidNeighbors(x, y, layer, pieceType, owner)){
		console.log("invalid neighbors");
		return false;
	}

	// stacked pieces have to partialy cover an enemy piece
	if(layer - 1 > 0){
		if(!isCoveringEnemy(x, y, layer, pieceType)){
			console.log("not covering an enemy");
			return false;
		}
		if(isCompletelyCoveringPiece(x, y, pieceType)){
			console.log("covering a piece intirely");
			return false;
		}
	}
	if(!isValidStacking(x, y, layer, pieceType)){
		console.log("not a valid stacking, your piece cant float");
		return false;
	}

	// checking if layers aren't off limits
	if(layer >= 9){
		return false;
	}

	// remove first turn highlight
	if(currentTurn == 0){
		board[7][7].classList.remove("center-cells");
		board[7][8].classList.remove("center-cells");
		board[8][7].classList.remove("center-cells");
		board[8][8].classList.remove("center-cells");
	}

	return true;
	// CONGRATULATIONS, YOU FOLLOWED THE RULES! :D
}

function playPiece(x, y, pieceType){
	// find index of the cell in the board array
	let coords = getIndexesOfCellByXY(x, y);

	if(currentPlayer.piecesRemaining.get(pieceType) > 0 && isValidPlay(coords.x, coords.y, pieceType)){
		// for each cell, we first change the background, then the owner, then the layer, then the piece ID.
		// finally, we resize the board.

		board[coords.y][coords.x].style.background = currentPlayer.colors[parseInt(board[coords.y][coords.x].dataset.layer)];
		board[coords.y][coords.x].dataset.owner = `${currentPlayer.number}`;
		board[coords.y][coords.x].dataset.layer = `${parseInt(board[coords.y][coords.x].dataset.layer) + 1}`;
		board[coords.y][coords.x].dataset.pieceid = `${currentPieceID}`;

		if(pieceType == "big-piece"){

			board[coords.y + 1][coords.x].style.background = currentPlayer.colors[parseInt(board[coords.y + 1][coords.x].dataset.layer)];
			board[coords.y][coords.x + 1].style.background = currentPlayer.colors[parseInt(board[coords.y][coords.x + 1].dataset.layer)];
			board[coords.y + 1][coords.x + 1].style.background = currentPlayer.colors[parseInt(board[coords.y + 1][coords.x + 1].dataset.layer)];

			board[coords.y + 1][coords.x].dataset.owner = `${currentPlayer.number}`;
			board[coords.y][coords.x + 1].dataset.owner = `${currentPlayer.number}`;
			board[coords.y + 1][coords.x + 1].dataset.owner = `${currentPlayer.number}`;

			board[coords.y + 1][coords.x].dataset.layer = `${parseInt(board[coords.y + 1][coords.x].dataset.layer) + 1}`;
			board[coords.y][coords.x + 1].dataset.layer = `${parseInt(board[coords.y][coords.x + 1].dataset.layer) + 1}`;
			board[coords.y + 1][coords.x + 1].dataset.layer = `${parseInt(board[coords.y + 1][coords.x + 1].dataset.layer) + 1}`;

			board[coords.y + 1][coords.x].dataset.pieceid = `${currentPieceID}`;
			board[coords.y][coords.x + 1].dataset.pieceid = `${currentPieceID}`;
			board[coords.y + 1][coords.x + 1].dataset.pieceid = `${currentPieceID}`;

			resizeBoard(coords.x, coords.x + 1, coords.y, coords.y + 1);

		} else if(pieceType == "horizontal-long-piece"){

			board[coords.y][coords.x + 1].style.background = currentPlayer.colors[parseInt(board[coords.y][coords.x + 1].dataset.layer)];

			board[coords.y][coords.x + 1].dataset.owner = `${currentPlayer.number}`;

			board[coords.y][coords.x + 1].dataset.layer = `${parseInt(board[coords.y][coords.x + 1].dataset.layer) + 1}`;

			board[coords.y][coords.x + 1].dataset.pieceid = `${currentPieceID}`;

			resizeBoard(coords.x, coords.x + 1, coords.y, coords.y);

		} else if(pieceType == "vertical-long-piece"){

			board[coords.y + 1][coords.x].style.background = currentPlayer.colors[parseInt(board[coords.y + 1][coords.x].dataset.layer)];

			board[coords.y + 1][coords.x].dataset.owner = `${currentPlayer.number}`;

			board[coords.y + 1][coords.x].dataset.layer = `${parseInt(board[coords.y + 1][coords.x].dataset.layer) + 1}`
		
			board[coords.y + 1][coords.x].dataset.pieceid = `${currentPieceID}`;

			resizeBoard(coords.x, coords.x, coords.y, coords.y + 1);

		} else if(pieceType == "small-piece"){

			resizeBoard(coords.x, coords.x, coords.y, coords.y);

		}

		currentPlayer.reducePieceCount(pieceType);


		//switches the current player (ternary op)
		currentPlayer = currentPlayer == P1 ? P2 : P1;
		currentTurn++;
		playedPieces.push(currentPieceID);
		currentPieceID++;

	} else if(currentPlayer.piecesRemaining.get(pieceType) == 0){
		window.alert("no pieces remaining");
	} else {
		console.log("this is not a valid play");
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

function resizeBoard(leftLim, rightLim, topLim, bottomLim){
	let columnsCount = board[0].length;
	let rowsCount = board.length;

	if(rightLim >= 8){
		for(let i = 0; i <= (rightLim % 8); i++){
			removeColumn(0);
		}
	}
	let deltaBoardLeftLim = columnsCount - leftLim;
	if(deltaBoardLeftLim > 8){
		for(let i = 1; i <= (deltaBoardLeftLim - 8); i++) {
			removeColumn(board[0].length - 1);
		}
	}
	if(bottomLim >= 8){
		for(let i = 0; i <= (bottomLim % 8); i++){
			removeRow(0);
		}
	}
	let deltaBoardTopLim = rowsCount - topLim;
	if(deltaBoardTopLim > 8){
		for(let i = 1; i <= (deltaBoardTopLim - 8); i++) {
			removeRow(board.length - 1);
		}
	}
}

function getNeighbors(x, y, pieceType){
	// n is short for neighbor, just to make the code a little more concise
	let n = [];
	let maxX = board[y].length;
	let maxY = board.length;

	if(pieceType == "big-piece"){

		(y - 1) > 0 ? n.push(board[y - 1][x]) : 0 + 0;
		(y - 1) > 0 && (x + 1) < maxX ? n.push(board[y - 1][x + 1]) : 0 + 0;
		(x + 2) < maxX ? n.push(board[y][x + 2]) : 0 + 0;
		(y + 1) < maxY && (x + 2) < maxX ? n.push(board[y + 1][x + 2]) : 0 + 0;
		(y + 2) < maxY && (x + 1) < maxX ? n.push(board[y + 2][x + 1]) : 0 + 0;
		(y + 2) < maxY ? n.push(board[y + 2][x]) : 0 + 0;
		(y + 1) < maxY && (x - 1) > 0 ? n.push(board[y + 1][x - 1]) : 0 + 0;
		(x - 1) > 0 ? n.push(board[y][x - 1]) : 0 + 0;

	} else if(pieceType == "horizontal-long-piece"){

		(y - 1) > 0 ? n.push(board[y - 1][x]) : 0 + 0;
		(y - 1) > 0 && (x + 1) < maxX ? n.push(board[y - 1][x + 1]) : 0 + 0;
		(x + 2) < maxX ? n.push(board[y][x + 2]) : 0 + 0;
		(y + 1) < maxY && (x + 1) < maxX ? n.push(board[y + 1][x + 1]) : 0 + 0;
		(y + 1) < maxY ? n.push(board[y + 1][x]) : 0 + 0;
		(x - 1) > 0 ? n.push(board[y][x - 1]) : 0 + 0;

	} else if(pieceType == "vertical-long-piece"){

		(y - 1) > 0 ? n.push(board[y - 1][x]) : 0 + 0;
		(x + 1) < maxX ? n.push(board[y][x + 1]) : 0 + 0;
		(y + 1) < maxY && (x + 1) < maxX ? n.push(board[y + 1][x + 1]) : 0 + 0;
		(y + 2) < maxY ? n.push(board[y + 2][x]) : 0 + 0;
		(y + 1) < maxY && (x - 1) > 0 ? n.push(board[y + 1][x - 1]) : 0 + 0;
		(x - 1) > 0 ? n.push(board[y][x - 1]) : 0 + 0;

	} else if(pieceType == "small-piece"){

		(y - 1) > 0 ? n.push(board[y - 1][x]) : 0 + 0;
		(x + 1) < maxX ? n.push(board[y][x + 1]) : 0 + 0;
		(y + 1) < maxY ? n.push(board[y + 1][x]) : 0 + 0;
		(x - 1) > 0 ? n.push(board[y][x - 1]) : 0 + 0;

	}
	return n;

}

function hasValidNeighbors(x, y, layer, pieceType, owner){

	let neighbors = getNeighbors(x, y, pieceType);
	let nonEmptyNeighbors = 0;

	for(let i = 0; i < neighbors.length; i++){
		if(neighbors[i].dataset.owner == owner && neighbors[i].dataset.layer == layer){
			return false;
		}
		if(neighbors[i].dataset.owner != 0){
			nonEmptyNeighbors++;
		}
	}

	if(nonEmptyNeighbors == 0 && currentTurn != 0 && layer == 1){
		// you cant place a lonely piece, except on the first turn, ofc
		return false;
	}

	return true;
}

function isValidStacking(x, y, layer, pieceType){

	let layerBelow = parseInt(board[y][x].dataset.layer);

	if(pieceType == "big-piece"){
		if( board[y][x].dataset.layer != layer - 1 ||
			board[y][x + 1].dataset.layer != layerBelow ||
			board[y + 1][x + 1].dataset.layer != layerBelow ||
			board[y + 1][x].dataset.layer != layerBelow
			){
			return false
		}
	} else if(pieceType == "horizontal-long-piece"){
		if( board[y][x].dataset.layer != layer - 1 ||
			board[y][x + 1].dataset.layer != layerBelow
			){

			return false
		}
	} else if(pieceType == "vertical-long-piece"){
		if( board[y][x].dataset.layer != layer - 1 ||
			board[y + 1][x].dataset.layer != layerBelow
			){

			return false
		}
	} else {
		if(board[y][x].dataset.layer != layer - 1){
			return false
		}
	}

	return true;
}

function isCoveringEnemy(x, y, layer, pieceType){
	let enemy = currentPlayer.number == 1 ? "2" : "1";

	if(pieceType == "big-piece"){
		if( board[y][x].dataset.owner == enemy ||
			board[y][x + 1].dataset.owner == enemy ||
			board[y + 1][x + 1].dataset.owner == enemy ||
			board[y + 1][x].dataset.owner == enemy
			){
			return true;
		}
	} else if(pieceType == "horizontal-long-piece"){
		if( board[y][x].dataset.owner == enemy ||
			board[y][x + 1].dataset.owner == enemy
			){

			return true;
		}
	} else if(pieceType == "vertical-long-piece"){
		if( board[y][x].dataset.owner == enemy ||
			board[y + 1][x].dataset.owner == enemy
			){

			return true;
		}
	} else {
		if(board[y][x].dataset.owner == enemy){
			return true;
		}
	}

	return false;
}

function isCompletelyCoveringPiece(x, y, pieceType){
	let boardClone = deepCopy2DArray(board);
	let remainingPieceIDs = [];

	if(pieceType == "big-piece"){
		boardClone[y].splice(x, 1);
		boardClone[y].splice(x, 1);
		boardClone[y + 1].splice(x, 1);
		boardClone[y + 1].splice(x, 1);
			
	} else if(pieceType == "horizontal-long-piece"){
		boardClone[y].splice(x, 1);
		boardClone[y].splice(x, 1);
	} else if(pieceType == "vertical-long-piece"){
		boardClone[y].splice(x, 1);
		boardClone[y + 1].splice(x, 1);
	} else {
		boardClone[y].splice(x, 1);
	}

	for(let i = 0; i < boardClone.length; i++){
		for(let j = 0; j < boardClone[i].length; j++){
			if((!remainingPieceIDs.includes(parseInt(boardClone[i][j].dataset.pieceid)) && boardClone[i][j].dataset.pieceid != "")){
				remainingPieceIDs.push(parseInt(boardClone[i][j].dataset.pieceid));
			}
		}
	}

	console.log(boardClone);
	console.log(remainingPieceIDs.sort());
	console.log(playedPieces);

	if(remainingPieceIDs.sort().toString() == playedPieces.sort().toString()){
		return false;
	} else {
		// console.log(remainingPieceIDs);
		// console.log(playedPieces);
		return true;
	}
}

function deepCopy2DArray(arr){
  	let copy = [];
  	arr.forEach(elem => {
	    if(Array.isArray(elem)){
	     	 copy.push(deepCopy2DArray(elem))
    }else {
        copy.push(elem)
    }
  });
  return copy;
}

const style = (node, styles) => Object.keys(styles).forEach(key => node.style[key] = styles[key])

function resetBoard(){
	boardElement.innerHTML = ""

	let script = document.createElement("script");
	script.setAttribute("src", "./main.js");
	document.body.appendChild(script);


	for(let i = 0; i <= 16; i++){
		let rowEl = document.createElement("section");
		rowEl.classList.add("row");
		boardElement.appendChild(rowEl);

		style(rowEl, {
		height: "fit-content",
		width: "fit-content",
		maxWidth: "80vw",

		display: "flex",
		justifyContent: "center",

		alignSelf: "center"
		})
	}

	let rowsList = boardElement.children;

	for(let i = 0; i <= 16; i++){
		for(let j = 0; j <= 16; j++){
			let cellEl = document.createElement("div");

			cellEl.setAttribute("data-owner", "0");
			cellEl.setAttribute("data-layer", "0");
			cellEl.setAttribute("data-x", `${j}`);
			cellEl.setAttribute("data-y", `${i}`);
			cellEl.setAttribute("data-pieceID", "");

			cellEl.classList.add("cell");

			rowsList[i].appendChild(cellEl);

			style(cellEl, {
			aspectRatio: "1/1 !important",
			border: "1px dashed #555",
			borderRadius: "0px",
			maxWidth: "5vh",
			width: "5vh",
			maxHeight: "5vh"
			})
		}
	}
}

function startGame(){
	gameStarted = true;

	// resetBoard();
}

function endGame(){
	gameStarted = false;
}