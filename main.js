var WIDTH = 15;
var HEIGHT = 15;

// Returns the x,y position of a random free space on the board
var randomFreeSpace = function() {
	var cells = $('.free');
	var r = Math.floor(Math.random() * cells.length);
	return getPosFromId(cells[r].id);
};

// Gets (x,y) position from a cell id
var getPosFromId = function(id) {
	return {
		x: parseInt(id.substr(3,id.length).split('_')[0]),
		y: parseInt(id.substr(3,id.length).split('_')[1])
	};
};

// Returns cell element at position (x,y)
var getCellAt = function(x,y) {
	return $('#id_' + x + '_' + y);
};

var gameState = {
	snakeBits : [],			// List of table cells that make up the snake
	direction : null		// direction of travel
};

function main() {

	// Init board
	var board = $('#board');
	for (var j = 0; j < HEIGHT; j++) {
		var row = $('<tr/>').attr('id','row' + j);
		for (var i = 0; i < WIDTH; i++) {
			var cell = $('<td/>').attr('id','id_' + i + '_' + j).addClass('cell').addClass('free');
			row.append(cell);
		}
		board.append(row);
	}

	// Set random spawns
	var snakeSpawnPoint = randomFreeSpace();
	var snakeSpawnCell = getCellAt(snakeSpawnPoint.x, snakeSpawnPoint.y);
	snakeSpawnCell.removeClass('free').addClass('snake');
	gameState.snakeBits.push(snakeSpawnCell);

	var cheeseSpawnPoint = randomFreeSpace();
	getCellAt(cheeseSpawnPoint.x, cheeseSpawnPoint.y).removeClass('free').addClass('cheese');

	// Move away from the closest wall in the x direction
	if (snakeSpawnPoint.x < WIDTH/2) {
		gameState.direction = 'right';
	} else {
		gameState.direction = 'left';
	}

	// Keyhandler
	$(document).keydown(function(e) {
		switch(e.keyCode) {
			case 38:
				gameState.direction = 'up';
				break;
			case 37:
				gameState.direction = 'left';
				break;
			case 40:
				gameState.direction = 'down';
				break;
			case 39:
				gameState.direction = 'right';
				break;
		}
	});

	//tick
	var gameLoop = setInterval(function() {
		var head = gameState.snakeBits[0];
		var headPos = getPosFromId(head.attr('id'));
		var newHeadPos = headPos;

		// move
		switch (gameState.direction) {
			case 'left':
				newHeadPos.x--;
				break;
			case 'right':
				newHeadPos.x++;
				break;
			case 'up':
				newHeadPos.y--;
				break;
			case 'down':
				newHeadPos.y++;
				break;
		}
		// Push new head to front of snakebit array
		gameState.snakeBits.unshift(getCellAt(newHeadPos.x,newHeadPos.y));

		// Check wall collision
		if (newHeadPos.x < 0 || newHeadPos.x >= WIDTH || newHeadPos.y < 0 || newHeadPos.y >= HEIGHT) {
			alert('DIED');
		}

		// Check if we've eaten a piece of cheese.   If so, don't pop the tail of the snake and spawn a cheese elsewhere
		var newHead = getCellAt(newHeadPos.x, newHeadPos.y);
		var oldTail = null;
		if (newHead.hasClass('cheese')) {
			oldTail = gameState.snakeBits[gameState.snakeBits.length-1];
			newHead.removeClass('cheese');

			if ($('.free').length === 0) {
				alert('WIN!');
			} else {
				cheeseSpawnPoint = randomFreeSpace();
				getCellAt(cheeseSpawnPoint.x, cheeseSpawnPoint.y).removeClass('free').addClass('cheese');
			}

		} else {
			oldTail = gameState.snakeBits.pop();
			oldTail.removeClass('snake').addClass('free');
		}
		newHead.addClass('snake').removeClass('free');

		// Check self collision
		var snakePieceMap = {};
		var bMultiple = false;
		for (var i = 0; i < gameState.snakeBits.length && !bMultiple; i++) {
			var bitKey = gameState.snakeBits[i].attr('id');
			if (snakePieceMap[bitKey] !== undefined) {
				bMultiple = true;
			} else {
				snakePieceMap[bitKey] = true;
			}
		}

		if (bMultiple) {
			alert('DIED');
		}
	}, 300);
}