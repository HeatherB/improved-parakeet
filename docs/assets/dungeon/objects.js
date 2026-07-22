//--- The sprite object

var spriteObject =
{
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 64,
  sourceHeight: 64,
  width: 64,
  height: 64,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  visible: true,
  scrollable: true,
  
  //Getters
  centerX: function()
  {
    return this.x + (this.width / 2);
  },
  centerY: function()
  {
    return this.y + (this.height / 2);
  },
  halfWidth: function()
  {
    return this.width / 2;
  },
  halfHeight: function()
  {
    return this.height / 2;
  },
};

//-- the monster object
monsterObject = Object.create(spriteObject);
monsterObject.sourceX = 128;

// the monster's states
monsterObject.NORMAL = [2,0];
monsterObject.SCARED = [2,1];
monsterObject.state = monsterObject.NORMAL;

monsterObject.update = function() {
  this.sourceX = this.state[0] * this.width;
  this.sourceY = this.state[1] * this.height;
};

// the monsters allowed speed
monsterObject.speed = 1;

// properties to help the monster change direction
monsterObject.NONE = 0;
monsterObject.UP = 1;
monsterObject.DOWN = 2;
monsterObject.LEFT = 3;
monsterObject.RIGHT = 4;
monsterObject.validDirections = [];
monsterObject.direction = monsterObject.NONE;
monsterObject.hunt = false;




//-- the cat object
alienObject = Object.create(spriteObject);
alienObject.sourceX = 128;

// the cat's states
alienObject.NORMAL = [1, 0];
alienObject.SCARED = [1, 3];
alienObject.state = alienObject.NORMAL;

alienObject.update = function() {
  //console.log('alien should update');
  this.sourceX = this.state[0] * this.width;
  this.sourceY = this.state[1] * this.height;
};


