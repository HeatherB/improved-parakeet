(function() {

//-- the canvas
var canvas = document.querySelector("canvas");
var drawingSurface = canvas.getContext("2d");

// game level maps
var levelMaps = [];
var levelGameObjects = [];

// a level counter
var levelCounter = 0;

// a timer to help delay the change time between levels
var levelChangeTimer = 0;

// level 0
var map0 = 
[
  [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
  [9,1,6,1,1,2,1,1,1,1,6,2,1,1,1,9],
  [9,1,1,1,1,1,10,1,2,1,1,1,1,2,1,9],
  [9,2,1,1,1,1,1,1,1,1,1,2,1,1,1,9],
  [9,1,10,1,6,2,1,1,1,1,2,1,1,1,1,9],
  [9,1,2,1,1,1,1,1,1,1,1,6,2,1,1,9],
  [9,1,1,1,6,1,10,2,1,1,1,1,1,1,2,9],
  [9,1,1,2,1,1,2,1,1,1,2,1,2,1,1,9],
  [9,1,2,1,1,1,2,1,6,1,1,1,1,10,1,9],
  [9,1,6,2,1,1,6,10,2,1,2,6,1,1,2,9],
  [9,2,1,1,1,2,1,1,1,1,1,1,1,1,1,9],
  [9,1,10,6,1,1,10,1,1,2,1,6,1,2,2,9],
  [9,1,1,1,2,1,1,1,2,1,1,1,1,1,1,9],
  [9,1,1,1,1,1,2,1,1,1,1,10,1,2,1,9],
  [9,1,2,1,6,1,1,1,1,2,1,1,1,1,1,9],
  [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]
];

// push map0 into the levelmap array
levelMaps.push(map0);

var gameObjects0 = 
[
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,3,0,0,4,0,0,3,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,3,0,0,0,5,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,3,0,0,0,3,0,0,0,0,3,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

// push gameObjects0 into the levelGameObjects array
levelGameObjects.push(gameObjects0);

// level 1
var map1 = 
[
  [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
  [9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9],
  [9,1,6,10,1,1,1,1,6,2,1,1,1,2,2,9],
  [9,1,1,2,6,2,1,1,10,1,1,1,1,2,1,9],
  [9,1,1,1,10,1,1,1,2,6,1,2,1,10,1,9],
  [9,1,1,1,1,1,2,1,1,1,1,2,1,1,1,9],
  [9,10,6,1,2,10,2,6,2,6,1,2,1,10,1,9],
  [9,1,1,1,1,1,1,1,1,2,2,6,2,1,1,9],
  [9,1,1,2,1,1,2,10,1,2,1,1,1,1,1,9],
  [9,6,1,10,1,1,1,2,1,1,1,10,2,2,1,9],
  [9,1,1,2,2,1,1,6,2,1,1,1,1,2,1,9],
  [9,1,1,1,1,1,1,1,10,1,1,1,2,6,2,9],
  [9,10,1,1,6,1,1,1,2,10,1,1,1,2,1,9],
  [9,1,1,2,2,10,6,1,1,1,1,2,1,2,1,9],
  [9,1,1,1,1,1,2,1,1,1,1,10,1,1,1,9],
  [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]
];

// push map1 into the level maps array
levelMaps.push(map1);

// the game objects map
var gameObjects1 = 
[
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,4,0,0,0,0,0,0,0,0,3,0,0,0,4,0],
  [0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,3,0,0,0,0,0,0,5,0,0,0,0,0,0,0],
  [0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0],
  [0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,4,0,0,0,0,0,0,0,0,4,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,4,0,0,3,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];
/*[
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,4,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0],
  [0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,4,0,0,0,0,0,0,0,0,4,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];*/



// push gameObjects1 into the lvelGameObjects array
levelGameObjects.push(gameObjects1);

// map code
var EMPTY = 0;
var FLOOR = 1;
var BOX = 2;
var MONSTER = 3;
var STAR = 4;
var ALIEN = 5;
var WALL = 9;
var GRAVECROSS = 6;
var GRAVEBLOCK = 10;

// the size of each tile cell
var SIZE = 64;

// sprites we need to acces by name
var alien = null;
var levelCompleteDisplay = null;

// the number of rows and columns
var ROWS = map0.length;
var COLUMNS = map0[0].length;

// arrays to store the game objects
var sprites = [];
var monsters = [];
var boxes = [];
var messages = [];
var stars = [];

var assetsToLoad = [];
var assetsLoaded = 0;

// load the timesheet image
var image = new Image();
image.addEventListener('load', loadHandler, false);
image.src = '/assets/img/dungeon/graveyardMayhem.png';
assetsToLoad.push(image);

function replay() {
	var image = new Image();
	image.addEventListener('load', loadHandler, false);
	image.src = '/assets/img/dungeon/graveyardMayhem.png';
	assetsToLoad.push(image);
}

// the number of columns on the tilesheet
var tilesheetColumns = 4;

// game variables
// any game variables you need
var starsCollected = 0;

// game states
var LOADING = 0;
var BUILD_MAP = 1;
var PLAYING = 2;
var OVER = 3;
var LEVEL_COMPLETE = 4;
var gameState = LOADING;

//-- the gameworld object
var gameWorld = {
	x: 0,
	y: 0,
	width: map0[0].length * SIZE,
	height: map0.length * SIZE
};

//-- the camera object
var camera = {
	x: 0,
	y: 0,
	width: canvas.width,
	height: canvas.height,

	// the camera's inner scroll boundaries
	rightInnerBoundary: function() {
		return this.x + (this.width / 2) + (this.width / 4);
	},
	leftInnerBoundary: function() {
		return this.x + (this.width / 2) - (this.width / 4);
	},
	topInnerBoundary: function() {
		return this.y + (this.height / 2) - (this.height / 4);
	},
	bottomInnerBoundary: function() {
		return this.y + (this.height / 2) + (this.height / 4);
	}
};

// center the camera over the gameworld
camera.x = (gameWorld.x + gameWorld.width / 2) - camera.width / 2;
camera.y = (gameWorld.y + gameWorld.height / 2) - camera.height / 2;

// start the game animation loop
update();

function update() {
	// the animation loop
	requestAnimationFrame(update, canvas);

	// change what the game is doing based on the game state
	switch(gameState) {
		case LOADING:
			//console.log('loading. . .');
			break;

		case BUILD_MAP:
			buildMap(levelMaps[levelCounter]);
      		buildMap(levelGameObjects[levelCounter]);
      		createOtherSprites();
      		gameState = PLAYING;
			break;

		case PLAYING:
			playGame();
			break;

		case LEVEL_COMPLETE:
			levelComplete();
			break;

		case OVER:
			endGame();
			break;
	}

	//render the game
	render();
}

function levelComplete() {
	// make the levelCompleteDisplay visible
	levelCompleteDisplay.visible = true;

	// update the timer that change the level by one
	levelChangeTimer++;

	// load the next level after 60 frames
	if(levelChangeTimer === 60) {
		loadNextLevel();
	}

	function loadNextLevel() {
		// reset the timer that changes the level
		levelChangeTimer = 0;

		// update the levelCounter by 1
		levelCounter++;

		// load the next level if there is one or end the game if there isn't
		if(levelCounter < levelMaps.length) {
			// clear the arrays of objects
			sprites = [];
			monsters= [];
			boxes = [];
			stars = [];

			// reset any gameVariables
			starsCollected = 0;

			// make sure the gameWorld size matches the size of the next level
			gameWorld.width = levelMaps[levelCounter][0].length * SIZE;
			gameWorld.height = levelMaps[levelCounter].length * SIZE;

			// re-center the camera
			camera.x = (gameWorld.x + gameWorld.width / 2) - camera.width / 2;
			camera.y = (gameWorld.y + gameWorld.height / 2) - camera.height / 2;

			// build the maps for the next level
			gameState = BUILD_MAP;
		} else {
			gameState = OVER;
		}
	}
}

function tryAgain() {
		// reset the timer that changes the level
		levelChangeTimer = 0;

		// update the levelCounter by 1
		//levelCounter++;

		// load the next level if there is one or end the game if there isn't
		//if(levelCounter < levelMaps.length) {
			// clear the arrays of objects
			sprites = [];
			monsters= [];
			boxes = [];
			stars = [];

			// reset any gameVariables
			starsCollected = 0;

			// make sure the gameWorld size matches the size of the next level
			//gameWorld.width = levelMaps[levelCounter][0].length * SIZE;
			//gameWorld.height = levelMaps[levelCounter].length * SIZE;

			// re-center the camera
			//camera.x = (gameWorld.x + gameWorld.width / 2) - camera.width / 2;
			//camera.y = (gameWorld.y + gameWorld.height / 2) - camera.height / 2;

			// build the maps for the next level
			gameState = BUILD_MAP;
		//} else {
		//	gameState = OVER;
		//}
	}

function loadHandler() {
	assetsLoaded++;
	if(assetsLoaded === assetsToLoad.length) {
		// remove the load handler
		image.removeEventListener("load", loadHandler, false);

		// build the map
		gameState = BUILD_MAP;
	}
}

function buildMap(levelMap) {
	//console.log(levelMaps.length);
	//console.log(stars.length);
	for(var row = 0; row < ROWS; row++) {
		for(var column = 0; column < COLUMNS; column++) {
			var currentTile = levelMap[row][column];

			if(currentTile != EMPTY) {
				// find the tile's x and y position on the tilesheet
				var tilesheetX = Math.floor((currentTile - 1) % tilesheetColumns) * SIZE;
				var tilesheetY = Math.floor((currentTile - 1) / tilesheetColumns) * SIZE;

				switch(currentTile) {
					case FLOOR:
						var floor = Object.create(spriteObject);
						floor.sourceX = tilesheetX;
						floor.sourceY = tilesheetY;
						floor.x = column * SIZE;
						floor.y = row * SIZE;
						sprites.push(floor);
						break;

					case BOX:
						var box = Object.create(spriteObject);
						box.sourceX = tilesheetX;
						box.sourceY = tilesheetY;
						box.x = column * SIZE;
						box.y = row * SIZE;
						sprites.push(box);
						boxes.push(box);
						break;

					case GRAVECROSS:
						var gravecross = Object.create(spriteObject);
						gravecross.sourceX = tilesheetX;
						gravecross.sourceY = tilesheetY;
						gravecross.x = column * SIZE;
						gravecross.y = row * SIZE;
						sprites.push(gravecross);
						boxes.push(gravecross);
						break;

					case GRAVEBLOCK:
						var graveblock = Object.create(spriteObject);
						graveblock.sourceX = tilesheetX;
						graveblock.sourceY = tilesheetY;
						graveblock.x = column * SIZE;
						graveblock.y = row * SIZE;
						sprites.push(graveblock);
						boxes.push(graveblock);
						break;

					case WALL:
						var wall = Object.create(spriteObject);
						wall.sourceX = tilesheetX;
						wall.sourceY = tilesheetY;
						wall.x = column * SIZE;
						wall.y = row * SIZE;
						sprites.push(wall);
						break;

					case MONSTER:
						var monster = Object.create(monsterObject);
						monster.sourceX = tilesheetX;
						monster.sourceY = tilesheetY;
						monster.x = column * SIZE;
						monster.y = row * SIZE;
						// make the monster choose a random start direction
						changeDirection(monster);
						monsters.push(monster);
						sprites.push(monster);
						break;

					case STAR:
						var star = Object.create(spriteObject);
            			star.sourceX = tilesheetX;
            			star.sourceY = tilesheetY;
            			star.sourceWidth = 48;
            			star.sourceHeight = 48;
            			star.width = 48;  
            			star.height = 48;          
            			star.x = column * SIZE + 8;
            			star.y = row * SIZE + 8;
            			stars.push(star);
            			sprites.push(star);
						break;

					case ALIEN:
						alien = Object.create(spriteObject);
						alien.sourceX = tilesheetX;
						alien.sourceY = tilesheetY;
						alien.x = column * SIZE;
						alien.y = row * SIZE;
						sprites.push(alien);
						break;
				}
			}
		}
	}
}

function createOtherSprites() {
	levelCompleteDisplay = Object.create(spriteObject);
	levelCompleteDisplay.sourceX = 0;
	levelCompleteDisplay.sourceY = 448;
	levelCompleteDisplay.sourceWidth = 256;
	levelCompleteDisplay.sourceHeight = 128;
	levelCompleteDisplay.width = 256;
	levelCompleteDisplay.height = 128;
	levelCompleteDisplay.x = canvas.width / 2 - levelCompleteDisplay.width / 2;
	levelCompleteDisplay.y = canvas.height / 2 - levelCompleteDisplay.height / 2;
	levelCompleteDisplay.visible = false;
	levelCompleteDisplay.scrollable = false;
	sprites.push(levelCompleteDisplay);

	youLostDisplay = Object.create(spriteObject);
	youLostDisplay.sourceX = 0;
	youLostDisplay.sourceY = 192;
	youLostDisplay.sourceWidth = 256;
	youLostDisplay.sourceHeight = 128;
	youLostDisplay.width = 256;
	youLostDisplay.height = 128;
	youLostDisplay.x = canvas.width / 2 - youLostDisplay.width / 2;
	youLostDisplay.y = canvas.height / 2 - youLostDisplay.height / 2;
	youLostDisplay.visible = false;
	youLostDisplay.scrollable = false;
	sprites.push(youLostDisplay);

	youWonDisplay = Object.create(spriteObject);
  	youWonDisplay.sourceX = 0;
  	youWonDisplay.sourceY = 321;
  	youWonDisplay.sourceWidth = 256;
  	youWonDisplay.sourceHeight = 128;
  	youWonDisplay.width = 256;  
  	youWonDisplay.height = 128;            
  	youWonDisplay.x = canvas.width / 2 - youWonDisplay.width / 2;
  	youWonDisplay.y = canvas.height / 2 - youWonDisplay.height / 2;
  	youWonDisplay.visible = false;
  	youWonDisplay.scrollable = false;
  	sprites.push(youWonDisplay);
}		

function playGame() {
	// up
	if(moveUp && !moveDown) {
		alien.vy = -4;
	}
	// down
	if(moveDown && !moveUp) {
		alien.vy = 4;
	}
	// left
	if(moveLeft && !moveRight) {
		alien.vx = -4;
	}
	// right
	if(moveRight && !moveLeft) {
		alien.vx = 4;
	}

	// set the aliens velocity to zero if none of the keys are being pressed
	if(!moveUp && !moveDown) {
		alien.vy = 0;
	}
	if(!moveLeft && !moveRight) {
		alien.vx = 0;
	}

	// move the alien and set its screen boundaries
	alien.x = Math.max(64, Math.min(alien.x + alien.vx, gameWorld.width - alien.width - 64));
	alien.y = Math.max(64, Math.min(alien.y + alien.vy, gameWorld.height - alien.height - 64));

	// check collision between the alien and the boxes
	for(var i = 0; i < boxes.length; i++) {
		blockRectangle(alien, boxes[i]);
	}

	// check for collisions with stars
	for(var i = 0; i < stars.length; i++) {
		var star = stars[i];
		if(hitTestRectangle(alien, star) && star.visible) {
			star.visible = false;
			starsCollected++;

			// check whether the level is over
			// by checking if the stra collected matches
			// the total number in the stars array
			if(starsCollected === stars.length) {
				gameState = LEVEL_COMPLETE;
			}
		}
	}

	// check for collisions with monsters
	for(var i = 0; i < monsters.length; i++) {
		var monster = monsters[i];
		if(hitTestCircle(alien, monster)) {
			gameState = OVER;
		}
	}

	// the monsters
	for(var i = 0; i < monsters.length; i++) {
		var monster = monsters[i];

		// move the monsters
		monster.x += monster.vx;
		monster.y += monster.vy;

		// check whether the monster is at a tile corner
		if(Math.floor(monster.x) % SIZE === 0
			&& Math.floor(monster.y) % SIZE === 0) {
			// change the monsters drection
			changeDirection(monster);
		}

		// change the monsters state to scared if
		// its 128 pixels from the alien
		var vx = alien.centerX() - monster.centerX();
		var vy = alien.centerY() - monster.centerY();

		// find the distance between the circles by caluclating 
		// the vectors magnitude (its length)
		var magnitude = Math.sqrt(vx * vx + vy * vy);

		if(magnitude < 192) {
			monster.state = monster.SCARED;
			alien.state = alien.SCARED;
		} else {
			monster.state = monster.NORMAL;
			alien.state = alien.NORMAL;
		}

		// update the monster to reflect state change
		monster.update();

	}

	// scroll the camera
	if(alien.x < camera.leftInnerBoundary()) {
		camera.x = Math.floor(alien.x - (camera.width / 4));
	}
	if(alien.y < camera.topInnerBoundary()) {
		camera.y = Math.floor(alien.y - (camera.height / 4));
	}
	if(alien.x + alien.width > camera.rightInnerBoundary()) {
		camera.x = Math.floor(alien.x + alien.width - (camera.width / 4 * 3));
	}
	if(alien.y + alien.height > camera.bottomInnerBoundary()) {
		camera.y = Math.floor(alien.y + alien.height - (camera.height / 4 * 3));
	}

	// the camera gameworld boundaries
	if(camera.x < gameWorld.x) {
		camera.x = gameWorld.x;
	}
	if(camera.y < gameWorld.y) {
		camera.y = gameWorld.y;
	}
	if(camera.x + camera.width > gameWorld.x + gameWorld.width) {
		camera.x = gameWorld.x + gameWorld.width - camera.width;
	}
	if(camera.y + camera.height > gameWorld.height) {
		camera.y = gameWorld.height - camera.height;
	}
}

function changeDirection(monster) {
	// clear any previous direction the monster has chosen
	monster.validDirections = [];
	monster.direction = monster.NONE;

	// find the monster's column and row in the array
	var monsterColumn = Math.floor(monster.x / SIZE);
	var monsterRow = Math.floor(monster.y / SIZE);

	// get a reference to the current level map
	var currentMap = levelMaps[levelCounter];

	// find out what kinds of things are in the cells
	// that surround the monster. if the cells contain a FLOOR cell
	// push the corresponding direction into the validDirections array
	if(monsterRow > 0) {
		var thingAbove = currentMap[monsterRow - 1][monsterColumn];
		if(thingAbove === FLOOR) {
			monster.validDirections.push(monster.UP);
		}
	}
	if(monsterRow < ROWS - 1) {
		var thingBelow = currentMap[monsterRow + 1][monsterColumn];
		if(thingBelow === FLOOR) {
			monster.validDirections.push(monster.DOWN);
		}
	}
	if(monsterColumn > 0) {
		var thingToTheLeft = currentMap[monsterRow][monsterColumn - 1];
		if(thingToTheLeft === FLOOR) {
			monster.validDirections.push(monster.LEFT);
		}
	}
	if(monsterColumn < COLUMNS - 1) {
		var thingToTheRight = currentMap[monsterRow][monsterColumn + 1];
		if(thingToTheRight === FLOOR) {
			monster.validDirections.push(monster.RIGHT);
		}
	}

	// the monster's validDirections array now contains 0 to 4 directions that
	// contain FLOOR cells. which direction will the monster move in

	// if a valid direction is found, figure out if the monster is at 
	// a maze passage intersection
	if(monster.validDirections.length !== 0) {
		// find out if the monster is at an intersection
		var upOrDownPassage
		= (monster.validDirections.indexOf(monster.UP) !== -1
			|| monster.validDirections.indexOf(monster.DOWN) !== -1);

		var leftOrRightPassage
		= (monster.validDirections.indexOf(monster.LEFT) !== -1
			|| monster.validDirections.indexOf(monster.RIGHT) !== -1);

		// change the monsters direction if its at an intersection or
		// in a cul-de-sac
		if(upOrDownPassage && leftOrRightPassage
			|| monster.validDirections.length === 1) {
			// optionally find the closest distance to the alien
		if(alien !== null && monster.hunt === true) {
			findClosestDirection(monster);
		}

		// assign a random validDirection if the alien object doesn't exist in the game
		// or a validDirection wasn't found that brings the monster closer to hte alien
		if(alien === null || monster.direction === monster.NONE) {
			var randomNumber = Math.floor(Math.random() * monster.validDirections.length);
			monster.direction = monster.validDirections[randomNumber];
		}

		// choose the monster's final direction
		switch(monster.direction) {
			case monster.RIGHT:
				monster.vx = monster.speed;
				monster.vy = 0;
				break;

			case monster.LEFT:
				monster.vx = -monster.speed;
				monster.vy = 0;
				break;

			case monster.UP:
				monster.vx = 0;
				monster.vy = -monster.speed;
				break;

			case monster.DOWN:
				monster.vx = 0;
				monster.vy = monster.speed;
				break;
			}
		}
	}
}

function findClosestDirection(monster) {
	var closestDirection = undefeined;

	// find the distance between the monster and the alien
	var vx = alien.centerX() - monster.centerX();
	var vy = alien.centerY() - monster.centerY();

	// if the distance is greater on the x axis
	if(Math.abs(vx) >= Math.abs(vy)) {
		// try left and right
		if(vx <= 0) {
			closestDirection = monsterObject.LEFT;
		} else {
			closestDirection = monsterObject.RIGHT;
		}
	// if the distance is greater on the y axis
	} else {
		// try up and down
		if(vy <= 0) {
			closestDirection = monsterObject.UP;
		} else {
			closestDirection = monsterObject.DOWN;
		}
	}

	// find out if the closestDirection is one of the validDirections
	for(var i = 0; i < monster.validDirections.length; i++) {
		if(closestDirection === monster.validDirections[i]) {
			// if it is, assign the closestDirection to the monsters direction
			monster.direction = closestDirection;
		}
	}
}

function endGame() {
	// make the levelComplete invisible
	levelCompleteDisplay.visible = false;

	// you win if you've on the last level and
	// you've collected all the stars
	if(levelCounter === levelMaps.length && starsCollected === stars.length) {
		youWonDisplay.visible = true;
	} else {
		youLostDisplay.visible = true;
		//setTimeout(tryAgain, 2000);
		levelChangeTimer++;

		// load the next level after 60 frames
		if(levelChangeTimer === 60) {
			tryAgain();
		}
	}
}


function render() {
	// render the gameworld
	drawingSurface.clearRect(0, 0, canvas.width, canvas.height);

	// position the gameworld inside the camera
	drawingSurface.save();
	drawingSurface.translate(-camera.x, -camera.y);

	// display the sprites on the gameworld
	if(sprites.length !== 0) {
		for(var i = 0; i < sprites.length; i++) {
			var sprite = sprites[i];

			// display the scrolling sprite
			if(sprite.visible && sprite.scrollable) {
				drawingSurface.drawImage (
					image,
					sprite.sourceX, sprite.sourceY,
					sprite.sourceWidth, sprite.sourceHeight,
					Math.floor(sprite.x), Math.floor(sprite.y),
					sprite.width, sprite.height
				);
			}

			// display the non-scrolling sprite
			if(sprite.visible && !sprite.scrollable) {
				drawingSurface.drawImage (
					image,
					sprite.sourceX, sprite.sourceY,
					sprite.sourceWidth, sprite.sourceHeight,
					Math.floor(camera.x + sprite.x), Math.floor(camera.y + sprite.y),
					sprite.width, sprite.height
				);
			}
		}
	}

	drawingSurface.restore();

	// display any game message
	if(messages.length !== 0) {
		for(var i = 0; i < messages.length; i++) {
			var message = message[i];
			if(message.visible) {
				drawingSurface.font = message.font;
				drawingSurface.fillStyle = message.fillStyle;
				drawingSurface.textBaseline = message.textBaseline;
				drawingSurface.fillText(message.text, message.x, message.y);
			}
		}
	}
}

}()); // launch