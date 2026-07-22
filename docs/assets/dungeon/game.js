(() => {
  // -- the canvas
  const canvas = document.querySelector("canvas");
  const drawingSurface = canvas.getContext("2d");

  // game level maps
  const levelMaps = [];
  const levelGameObjects = [];

  // a level counter
  let levelCounter = 0;

  // a timer to help delay the change time between levels
  let levelChangeTimer = 0;

  // level 0
  const map0 = [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 1, 6, 1, 1, 2, 1, 1, 1, 1, 6, 2, 1, 1, 1, 9],
    [9, 1, 1, 1, 1, 1, 10, 1, 2, 1, 1, 1, 1, 2, 1, 9],
    [9, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 9],
    [9, 1, 10, 1, 6, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 9],
    [9, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 6, 2, 1, 1, 9],
    [9, 1, 1, 1, 6, 1, 10, 2, 1, 1, 1, 1, 1, 1, 2, 9],
    [9, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 9],
    [9, 1, 2, 1, 1, 1, 2, 1, 6, 1, 1, 1, 1, 10, 1, 9],
    [9, 1, 6, 2, 1, 1, 6, 10, 2, 1, 2, 6, 1, 1, 2, 9],
    [9, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    [9, 1, 10, 6, 1, 1, 10, 1, 1, 2, 1, 6, 1, 2, 2, 9],
    [9, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 9],
    [9, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 10, 1, 2, 1, 9],
    [9, 1, 2, 1, 6, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
  ];

  levelMaps.push(map0);

  const gameObjects0 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 4, 0, 0, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  levelGameObjects.push(gameObjects0);

  // level 1
  const map1 = [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    [9, 1, 6, 10, 1, 1, 1, 1, 6, 2, 1, 1, 1, 2, 2, 9],
    [9, 1, 1, 2, 6, 2, 1, 1, 10, 1, 1, 1, 1, 2, 1, 9],
    [9, 1, 1, 1, 10, 1, 1, 1, 2, 6, 1, 2, 1, 10, 1, 9],
    [9, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 9],
    [9, 10, 6, 1, 2, 10, 2, 6, 2, 6, 1, 2, 1, 10, 1, 9],
    [9, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 6, 2, 1, 1, 9],
    [9, 1, 1, 2, 1, 1, 2, 10, 1, 2, 1, 1, 1, 1, 1, 9],
    [9, 6, 1, 10, 1, 1, 1, 2, 1, 1, 1, 10, 2, 2, 1, 9],
    [9, 1, 1, 2, 2, 1, 1, 6, 2, 1, 1, 1, 1, 2, 1, 9],
    [9, 1, 1, 1, 1, 1, 1, 1, 10, 1, 1, 1, 2, 6, 2, 9],
    [9, 10, 1, 1, 6, 1, 1, 1, 2, 10, 1, 1, 1, 2, 1, 9],
    [9, 1, 1, 2, 2, 10, 6, 1, 1, 1, 1, 2, 1, 2, 1, 9],
    [9, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 10, 1, 1, 1, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
  ];

  levelMaps.push(map1);

  const gameObjects1 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 4, 0],
    [0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0],
    [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 4, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  levelGameObjects.push(gameObjects1);

  // map codes
  const EMPTY = 0;
  const FLOOR = 1;
  const BOX = 2;
  const MONSTER = 3;
  const STAR = 4;
  const ALIEN = 5;
  const WALL = 9;
  const GRAVECROSS = 6;
  const GRAVEBLOCK = 10;

  // the size of each tile cell
  const SIZE = 64;

  // sprites we need to access by name
  let alien = null;
  let levelCompleteDisplay = null;
  let youLostDisplay = null;
  let youWonDisplay = null;

  // the number of rows and columns
  const ROWS = map0.length;
  const COLUMNS = map0[0].length;

  // arrays to store the game objects
  let sprites = [];
  let monsters = [];
  let boxes = [];
  const messages = [];
  let stars = [];

  const assetsToLoad = [];
  let assetsLoaded = 0;

  // load the tilesheet image
  const image = new Image();
  image.addEventListener("load", loadHandler, false);
  image.src = "assets/dungeon/graveyardMayhem.png";
  assetsToLoad.push(image);

  // the number of columns on the tilesheet
  const tilesheetColumns = 4;

  // game variables
  let starsCollected = 0;

  // game states
  const LOADING = 0;
  const BUILD_MAP = 1;
  const PLAYING = 2;
  const OVER = 3;
  const LEVEL_COMPLETE = 4;
  let gameState = LOADING;

  // -- the gameworld object
  const gameWorld = {
    x: 0,
    y: 0,
    width: map0[0].length * SIZE,
    height: map0.length * SIZE,
  };

  // -- the camera object
  const camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,

    rightInnerBoundary() {
      return this.x + this.width / 2 + this.width / 4;
    },
    leftInnerBoundary() {
      return this.x + this.width / 2 - this.width / 4;
    },
    topInnerBoundary() {
      return this.y + this.height / 2 - this.height / 4;
    },
    bottomInnerBoundary() {
      return this.y + this.height / 2 + this.height / 4;
    },
  };

  // center the camera over the gameworld
  camera.x = gameWorld.x + gameWorld.width / 2 - camera.width / 2;
  camera.y = gameWorld.y + gameWorld.height / 2 - camera.height / 2;

  // start the game animation loop
  update();

  function update() {
    requestAnimationFrame(update);

    switch (gameState) {
      case LOADING:
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

    render();
  }

  function levelComplete() {
    levelCompleteDisplay.visible = true;
    levelChangeTimer++;

    if (levelChangeTimer === 60) {
      loadNextLevel();
    }

    function loadNextLevel() {
      levelChangeTimer = 0;
      levelCounter++;

      if (levelCounter < levelMaps.length) {
        sprites = [];
        monsters = [];
        boxes = [];
        stars = [];
        starsCollected = 0;

        gameWorld.width = levelMaps[levelCounter][0].length * SIZE;
        gameWorld.height = levelMaps[levelCounter].length * SIZE;

        camera.x = gameWorld.x + gameWorld.width / 2 - camera.width / 2;
        camera.y = gameWorld.y + gameWorld.height / 2 - camera.height / 2;

        gameState = BUILD_MAP;
      } else {
        gameState = OVER;
      }
    }
  }

  function tryAgain() {
    levelChangeTimer = 0;
    sprites = [];
    monsters = [];
    boxes = [];
    stars = [];
    starsCollected = 0;
    gameState = BUILD_MAP;
  }

  function loadHandler() {
    assetsLoaded++;
    if (assetsLoaded === assetsToLoad.length) {
      image.removeEventListener("load", loadHandler, false);
      gameState = BUILD_MAP;
    }
  }

  function buildMap(levelMap) {
    for (let row = 0; row < ROWS; row++) {
      for (let column = 0; column < COLUMNS; column++) {
        const currentTile = levelMap[row][column];

        if (currentTile !== EMPTY) {
          const tilesheetX =
            Math.floor((currentTile - 1) % tilesheetColumns) * SIZE;
          const tilesheetY =
            Math.floor((currentTile - 1) / tilesheetColumns) * SIZE;

          switch (currentTile) {
            case FLOOR: {
              const floor = Object.create(spriteObject);
              floor.sourceX = tilesheetX;
              floor.sourceY = tilesheetY;
              floor.x = column * SIZE;
              floor.y = row * SIZE;
              sprites.push(floor);
              break;
            }

            case BOX: {
              const box = Object.create(spriteObject);
              box.sourceX = tilesheetX;
              box.sourceY = tilesheetY;
              box.x = column * SIZE;
              box.y = row * SIZE;
              sprites.push(box);
              boxes.push(box);
              break;
            }

            case GRAVECROSS: {
              const gravecross = Object.create(spriteObject);
              gravecross.sourceX = tilesheetX;
              gravecross.sourceY = tilesheetY;
              gravecross.x = column * SIZE;
              gravecross.y = row * SIZE;
              sprites.push(gravecross);
              boxes.push(gravecross);
              break;
            }

            case GRAVEBLOCK: {
              const graveblock = Object.create(spriteObject);
              graveblock.sourceX = tilesheetX;
              graveblock.sourceY = tilesheetY;
              graveblock.x = column * SIZE;
              graveblock.y = row * SIZE;
              sprites.push(graveblock);
              boxes.push(graveblock);
              break;
            }

            case WALL: {
              const wall = Object.create(spriteObject);
              wall.sourceX = tilesheetX;
              wall.sourceY = tilesheetY;
              wall.x = column * SIZE;
              wall.y = row * SIZE;
              sprites.push(wall);
              break;
            }

            case MONSTER: {
              const monster = Object.create(monsterObject);
              monster.sourceX = tilesheetX;
              monster.sourceY = tilesheetY;
              monster.x = column * SIZE;
              monster.y = row * SIZE;
              changeDirection(monster);
              monsters.push(monster);
              sprites.push(monster);
              break;
            }

            case STAR: {
              const star = Object.create(spriteObject);
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
            }

            case ALIEN: {
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
    levelCompleteDisplay.y =
      canvas.height / 2 - levelCompleteDisplay.height / 2;
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
    // movement controls
    if (moveUp && !moveDown) {
      alien.vy = -4;
    }
    if (moveDown && !moveUp) {
      alien.vy = 4;
    }
    if (moveLeft && !moveRight) {
      alien.vx = -4;
    }
    if (moveRight && !moveLeft) {
      alien.vx = 4;
    }

    if (!moveUp && !moveDown) {
      alien.vy = 0;
    }
    if (!moveLeft && !moveRight) {
      alien.vx = 0;
    }

    // move the alien and set screen boundaries
    alien.x = Math.max(
      64,
      Math.min(alien.x + alien.vx, gameWorld.width - alien.width - 64)
    );
    alien.y = Math.max(
      64,
      Math.min(alien.y + alien.vy, gameWorld.height - alien.height - 64)
    );

    // check collision between the alien and boxes
    for (let i = 0; i < boxes.length; i++) {
      blockRectangle(alien, boxes[i]);
    }

    // check for collisions with stars
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      if (hitTestRectangle(alien, star) && star.visible) {
        star.visible = false;
        starsCollected++;

        if (starsCollected === stars.length) {
          gameState = LEVEL_COMPLETE;
        }
      }
    }

    // check for collisions with monsters
    for (let i = 0; i < monsters.length; i++) {
      const monster = monsters[i];
      if (hitTestCircle(alien, monster)) {
        gameState = OVER;
      }
    }

    // move and update monsters
    for (let i = 0; i < monsters.length; i++) {
      const monster = monsters[i];

      monster.x += monster.vx;
      monster.y += monster.vy;

      if (
        Math.floor(monster.x) % SIZE === 0 &&
        Math.floor(monster.y) % SIZE === 0
      ) {
        changeDirection(monster);
      }

      const vx = alien.centerX() - monster.centerX();
      const vy = alien.centerY() - monster.centerY();
      const magnitude = Math.sqrt(vx * vx + vy * vy);

      if (magnitude < 192) {
        monster.state = monster.SCARED;
        alien.state = alien.SCARED;
      } else {
        monster.state = monster.NORMAL;
        alien.state = alien.NORMAL;
      }

      monster.update();
    }

    // scroll the camera
    if (alien.x < camera.leftInnerBoundary()) {
      camera.x = Math.floor(alien.x - camera.width / 4);
    }
    if (alien.y < camera.topInnerBoundary()) {
      camera.y = Math.floor(alien.y - camera.height / 4);
    }
    if (alien.x + alien.width > camera.rightInnerBoundary()) {
      camera.x = Math.floor(alien.x + alien.width - (camera.width / 4) * 3);
    }
    if (alien.y + alien.height > camera.bottomInnerBoundary()) {
      camera.y = Math.floor(alien.y + alien.height - (camera.height / 4) * 3);
    }

    // camera boundaries
    if (camera.x < gameWorld.x) {
      camera.x = gameWorld.x;
    }
    if (camera.y < gameWorld.y) {
      camera.y = gameWorld.y;
    }
    if (camera.x + camera.width > gameWorld.x + gameWorld.width) {
      camera.x = gameWorld.x + gameWorld.width - camera.width;
    }
    if (camera.y + camera.height > gameWorld.height) {
      camera.y = gameWorld.height - camera.height;
    }
  }

  function changeDirection(monster) {
    monster.validDirections = [];
    monster.direction = monster.NONE;

    const monsterColumn = Math.floor(monster.x / SIZE);
    const monsterRow = Math.floor(monster.y / SIZE);
    const currentMap = levelMaps[levelCounter];

    if (monsterRow > 0) {
      const thingAbove = currentMap[monsterRow - 1][monsterColumn];
      if (thingAbove === FLOOR) {
        monster.validDirections.push(monster.UP);
      }
    }
    if (monsterRow < ROWS - 1) {
      const thingBelow = currentMap[monsterRow + 1][monsterColumn];
      if (thingBelow === FLOOR) {
        monster.validDirections.push(monster.DOWN);
      }
    }
    if (monsterColumn > 0) {
      const thingToTheLeft = currentMap[monsterRow][monsterColumn - 1];
      if (thingToTheLeft === FLOOR) {
        monster.validDirections.push(monster.LEFT);
      }
    }
    if (monsterColumn < COLUMNS - 1) {
      const thingToTheRight = currentMap[monsterRow][monsterColumn + 1];
      if (thingToTheRight === FLOOR) {
        monster.validDirections.push(monster.RIGHT);
      }
    }

    if (monster.validDirections.length !== 0) {
      const upOrDownPassage =
        monster.validDirections.indexOf(monster.UP) !== -1 ||
        monster.validDirections.indexOf(monster.DOWN) !== -1;

      const leftOrRightPassage =
        monster.validDirections.indexOf(monster.LEFT) !== -1 ||
        monster.validDirections.indexOf(monster.RIGHT) !== -1;

      if (
        (upOrDownPassage && leftOrRightPassage) ||
        monster.validDirections.length === 1
      ) {
        if (alien !== null && monster.hunt === true) {
          findClosestDirection(monster);
        }

        if (alien === null || monster.direction === monster.NONE) {
          const randomNumber = Math.floor(
            Math.random() * monster.validDirections.length
          );
          monster.direction = monster.validDirections[randomNumber];
        }

        switch (monster.direction) {
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
    let closestDirection = undefined;

    const vx = alien.centerX() - monster.centerX();
    const vy = alien.centerY() - monster.centerY();

    if (Math.abs(vx) >= Math.abs(vy)) {
      if (vx <= 0) {
        closestDirection = monsterObject.LEFT;
      } else {
        closestDirection = monsterObject.RIGHT;
      }
    } else {
      if (vy <= 0) {
        closestDirection = monsterObject.UP;
      } else {
        closestDirection = monsterObject.DOWN;
      }
    }

    for (let i = 0; i < monster.validDirections.length; i++) {
      if (closestDirection === monster.validDirections[i]) {
        monster.direction = closestDirection;
      }
    }
  }

  function endGame() {
    levelCompleteDisplay.visible = false;

    if (
      levelCounter === levelMaps.length &&
      starsCollected === stars.length
    ) {
      youWonDisplay.visible = true;
    } else {
      youLostDisplay.visible = true;
      levelChangeTimer++;

      if (levelChangeTimer === 60) {
        tryAgain();
      }
    }
  }

  function render() {
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
    drawingSurface.save();
    drawingSurface.translate(-camera.x, -camera.y);

    if (sprites.length !== 0) {
      for (let i = 0; i < sprites.length; i++) {
        const sprite = sprites[i];

        if (sprite.visible && sprite.scrollable) {
          drawingSurface.drawImage(
            image,
            sprite.sourceX,
            sprite.sourceY,
            sprite.sourceWidth,
            sprite.sourceHeight,
            Math.floor(sprite.x),
            Math.floor(sprite.y),
            sprite.width,
            sprite.height
          );
        }

        if (sprite.visible && !sprite.scrollable) {
          drawingSurface.drawImage(
            image,
            sprite.sourceX,
            sprite.sourceY,
            sprite.sourceWidth,
            sprite.sourceHeight,
            Math.floor(camera.x + sprite.x),
            Math.floor(camera.y + sprite.y),
            sprite.width,
            sprite.height
          );
        }
      }
    }

    drawingSurface.restore();

    if (messages.length !== 0) {
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        if (message.visible) {
          drawingSurface.font = message.font;
          drawingSurface.fillStyle = message.fillStyle;
          drawingSurface.textBaseline = message.textBaseline;
          drawingSurface.fillText(message.text, message.x, message.y);
        }
      }
    }
  }
})();
