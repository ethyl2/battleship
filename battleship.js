var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	},
	displayClear: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "clear");
	}
};

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	ships: [{ locations: [0, 0, 0], hits: ["","",""]},
		{ locations: [0, 0, 0], hits: ["","",""]},
		{ locations: [0, 0, 0], hits: ["","",""]}],
	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT! Good guess!");
				if (this.isSunk(ship)) {
					this.shipsSunk++;
					view.displayMessage("You sank my battleship!");
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.  Better luck next time.");
		return false;
	},
	isSunk: function(ship) {
		for (var i = 0; i <this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},
	generateShipLocations: function() {
		var locations;
		//var generatedShips = 0;
		//var currentShip = 0;
		//while (generatedShips < this.numShips) {
			//locations = this.generateShip();
			//if (this.collisions(locations) == false) {
				//this.ships[currentShip].locations = locations;
				//currentShip++;
				//generatedShips++;
			//};
		for (var i = 0; i < this.numShips; i++) {
			do {
		 		locations = this.generateShip();
			} while (this.collisions(locations));
			this.ships[i].locations = locations;
		}
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		//if the direction is 1, ship is horizontal
		//if the direction is 0, the ship is vertical
		var row, col;
		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}
		var newShipLocations = []
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
			newShipLocations.push(row + "" + (col + i));
			} else {
			newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collisions: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}

};

var controller = {
	guesses: 0,
	guessArray: [],
	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses. Your accuracy was " + ((model.numShips * model.shipLength)/ this.guesses) + ".");
				endGame();

			}
		}
	}
};

parseGuess = function(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	for (var item in controller.guessArray) {
		if (guess == controller.guessArray[item]) {
			alert("Oops, you've already tried that location.  Pick a different one.");
		}
	}
	controller.guessArray.push(guess);
	if (guess == null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
	firstChar = guess.charAt(0);
	firstChar = firstChar.toUpperCase();
	var row = alphabet.indexOf(firstChar);
	var column = guess.charAt(1);
	if (isNaN(row) || isNaN(column)) {
		alert("Oops, that isn't on the board.  Try again.");
	} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
		alert("Oops, that's off the board.  Try again.");
	} else {
		return row + column;
	}

	}
	return null;
};

function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	model.generateShipLocations();
};

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
};

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
};

function endGame() {
	controller.guesses = 0;
	for (var i = 0; i < controller.guessArray.length; i++) {
		view.displayClear(controller.guessArray[i]);
		}
	controller.guessArray = [];
	model.shipsSunk = 0;
	model.ships = [{ locations: [0, 0, 0], hits: ["","",""]},
			{ locations: [0, 0, 0], hits: ["","",""]},
			{ locations: [0, 0, 0], hits: ["","",""]}],
	model.generateShipLocations();
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
};

window.onload = init;
