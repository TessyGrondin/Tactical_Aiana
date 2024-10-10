const canvas = document.getElementById('game');
const context = canvas.getContext('2d')

context.font = "30px Arial";
context.textAlign = "center";
context.fillStyle = 'blue';

let talents = [
  {name:"distant counter", description:"can counter at any distance"},
  {name:"antidouble", description:"ignore your spe disadvantage"},
  {name:"guaranteed double", description:"ignore foe's spe advantage"},
  {name:"group attack", description:"add 2 to your att according to the\nnumber of allies nearby"},
  {name:"group defense", description:"add 2 to your def according to the\nnumber of allies nearby"},

  {name:"close counter", description:"can counter at any distance"},
  {name:"antidouble", description:"ignore your spe disadvantage"},
  {name:"guaranteed double", description:"ignore foe's spe advantage"},
  {name:"group attack", description:"add 2 to your att according to the\nnumber of allies nearby"},
  {name:"group defense", description:"add 2 to your def according to the\nnumber of allies nearby"},

  {name:"distant heal", description:"can heal at a two tile distance"},
  {name:"half-measure", description:"cuts the foe's hp in two"},
  {name:"self-heal", description:"heal you when you heal allies"},
  {name:"cross defense", description:"inflict def - 2 to enemies on the\nsame line and column"},
  {name:"cross attack", description:"inflict att - 2 to enemies on the\nsame line and column"},
]

let dispTalents = [
  [0, 1, 2, 3, 4],
  [0, 1, 2, 3, 4],
  [0, 1, 2, 3, 4]
]

let shownTalent = [
  [-1, -1],
  [-1, -1],
  [-1, -1]
]

function selectTalent() {
  for (let i = 0; i < 3; i++) {
    let a = Math.floor(Math.random() * dispTalents[i].length);
    shownTalent[i][0] = dispTalents[i][a];
    if (dispTalents[i].length < 1)
      continue;
    let b = Math.floor(Math.random() * dispTalents[i].length);
    while (b == a)
      b = Math.floor(Math.random() * dispTalents[i].length);
    shownTalent[i][1] = dispTalents[i][b];
  }
}

function assignTalent(index) {
  addTalent(detailedUnit, index + 5 * detailedUnit.type);
  let newTab = [];
  for (let i = 0; i < dispTalents[detailedUnit.binding].length; i++)
    if (dispTalents[detailedUnit.binding][i] != index)
      newTab.push(dispTalents[detailedUnit.binding][i]);
  dispTalents[detailedUnit.binding] = newTab;
}

function talentPresent(unit, talent) {
  for (let i = 0; i < unit.ability.length; i++)
    if (unit.ability[i].name == talent)
      return true;
  return false;
}

function groupAttack(unit, pos) {
  if (!talentPresent(unit, "group attack"))
    return;
  unit.attack[1] = 0;
  for (let i = 0; i < pos.length; i++) {
    if (unit.binding == i)
      continue;
    if (getDistance(pos[unit.binding], pos[i]) < 3)
      unit.attack[1] += 2;
  }
}

function groupDefense(unit, pos) {
  if (!talentPresent(unit, "group defense"))
    return;
  unit.defense[1] = 0;
  for (let i = 0; i < pos.length; i++) {
    if (unit.binding == i)
      continue;
    if (getDistance(pos[unit.binding], pos[i]) < 3)
      unit.defense[1] += 2;
  }
}

function crossDefense(unit, Upos, foes, pos) {
  if (!talentPresent(unit, "cross defense"))
    return;
  for (let i = 0; i < foes.length; i++) {
    if (pos[i].x == Upos.x || pos[i].y == Upos.y)
      foes[i].defense[1] -= 2;
  }
}

function crossAttack(unit, Upos, foes, pos) {
  if (!talentPresent(unit, "cross attack"))
    return;
  for (let i = 0; i < foes.length; i++) {
    if (pos[i].x == Upos.x || pos[i].y == Upos.y)
      foes[i].attack[1] -= 2;
  }
}

function addTalent(unit, index) {
  unit.ability.push({name:talents[index].name, description:talents[index].description});
}











let premadeMaps = [
  {
    w:[{x:7, y:1}, {x:1, y:9}, {x:7, y:11}, {x:1, y:12}],
    exit:{x:6, y:13},
    e:[{x:0, y:0},{x:9, y:5},{x:2, y:2}, {x:5, y:2}, {x:3, y:4}],
    p:[{x:3, y:12}, {x:2, y:13}, {x:4, y:13}]
  },
  {
    w:[{x:6, y:6}, {x:6, y:8}, {x:1, y:9}, {x:5, y:12}, {x:1, y:13}],
    exit:{x:5, y:4},
    e:[{x:4, y:3},{x:0, y:0},{x:3, y:6}, {x:8, y:7}, {x:2, y:11}],
    p:[{x:7, y:12}, {x:6, y:13}, {x:8, y:13}]
  },
  {
    w:[{x:9, y:4}, {x:4, y:8}, {x:0, y:10}, {x:7, y:10}],
    exit:{x:4, y:10},
    e:[{x:6, y:1},{x:9, y:7},{x:3, y:1}, {x:4, y:3}, {x:7, y:4}, {x:2, y:5}],
    p:[{x:3, y:12}, {x:2, y:13}, {x:4, y:13}]
  },
  {
    w:[{x:2, y:0}, {x:6, y:2}, {x:8, y:2}, {x:3, y:5}],
    exit:{x:5, y:13},
    e:[{x:2, y:2},{x:7, y:1},{x:7, y:6}, {x:1, y:7}, {x:1, y:13}],
    p:[{x:9, y:11}, {x:8, y:12}, {x:9, y:13}]
  },
  {
    w:[{x:5, y:8}, {x:5, y:10}, {x:8, y:13}, {x:6, y:14}],
    exit:{x:6, y:13},
    e:[{x:8, y:3},{x:0, y:3},{x:5, y:2}, {x:5, y:4}, {x:6, y:5}, {x:8, y:6}],
    p:[{x:2, y:12}, {x:1, y:13}, {x:3, y:13}]
  },
  {
    w:[{x:5, y:0}, {x:3, y:2}, {x:2, y:4}, {x:5, y:6}, {x:3, y:14}],
    exit:{x:0, y:8},
    e:[{x:9, y:14},{x:0, y:0},{x:1, y:0}, {x:8, y:2}, {x:4, y:12}],
    p:[{x:2, y:7}, {x:3, y:8}, {x:2, y:9}]
  },
  {
    w:[{x:2, y:5}, {x:2, y:8}, {x:9, y:12}, {x:8, y:14}],
    exit:{x:8, y:13},
    e:[{x:4, y:1},{x:0, y:11},{x:5, y:4}, {x:6, y:4}, {x:4, y:6}, {x:8, y:6}],
    p:[{x:8, y:12}, {x:7, y:13}, {x:9, y:13}]
  },
  {
    w:[{x:1, y:0}, {x:7, y:4}, {x:9, y:6}, {x:7, y:8}, {x:0, y:9}],
    exit:{x:8, y:11},
    e:[{x:7, y:6},{x:0, y:5},{x:2, y:4}, {x:3, y:8}, {x:6, y:10}],
    p:[{x:1, y:13}, {x:0, y:14}, {x:2, y:14}]
  },
  {
    w:[{x:2, y:0}, {x:3, y:3}, {x:1, y:6}, {x:8, y:10}, {x:1, y:14}],
    exit:{x:5, y:11},
    e:[{x:1, y:2},{x:8, y:3},{x:5, y:2}, {x:6, y:5}, {x:1, y:8}],
    p:[{x:6, y:12}, {x:5, y:13}, {x:7, y:13}]
  },
  {
    w:[{x:5, y:0}, {x:3, y:1}, {x:9, y:1}, {x:0, y:2}, {x:2, y:10}],
    exit:{x:8, y:14},
    e:[{x:7, y:12},{x:1, y:1},{x:7, y:7}, {x:4, y:10}, {x:1, y:13}],
    p:[{x:1, y:5}, {x:2, y:6}, {x:1, y:7}]
  },
  {
    w:[{x:9, y:1}, {x:4, y:2}, {x:4, y:3}, {x:1, y:4}, {x:5, y:4}],
    exit:{x:0, y:1},
    e:[{x:3, y:13},{x:8, y:1},{x:3, y:10}, {x:1, y:12}, {x:5, y:12}],
    p:[{x:2, y:4}, {x:4, y:4}, {x:3, y:5}]
  },
  {
    w:[{x:2, y:1}, {x:5, y:6}, {x:4, y:8}, {x:0, y:14}],
    exit:{x:2, y:5},
    e:[{x:7, y:13},{x:9, y:1},{x:1, y:10}, {x:8, y:10}, {x:3, y:13}],
    p:[{x:3, y:2}, {x:4, y:3}, {x:3, y:4}]
  },
  {
    w:[{x:7, y:1}, {x:4, y:7}, {x:1, y:12}, {x:5, y:12}],
    exit:{x:1, y:13},
    e:[{x:0, y:0},{x:9, y:7},{x:6, y:1}, {x:2, y:2}, {x:0, y:3}, {x:5, y:4}],
    p:[{x:3, y:10}, {x:2, y:11}, {x:4, y:11}]
  },
  {
    w:[{x:3, y:5}, {x:3, y:7}, {x:8, y:9}, {x:3, y:12}],
    exit:{x:8, y:4},
    e:[{x:0, y:14},{x:3, y:1},{x:0, y:9}, {x:4, y:10}, {x:7, y:13}],
    p:[{x:4, y:5}, {x:6, y:5}, {x:5, y:6}]
  }
];










let inventory = {money:0, obj1:0, obj2:0, obj3:0, potion:0};

function usePotion(unit) {
    if (unit.hp == unit.maxhp || inventory.potion < 1)
        return;
    unit.hp = (unit.hp + 3 <= unit.maxhp) ? unit.hp + 3 : unit.maxhp;
    inventory.potion--;
}









let cross = new Image();
cross.src = "cross.png";
let crossFrame = 0;
let shadow = new Image();
shadow.src = "shadow.png";
let activMenu = false;
let activDetails = false;
let detailedUnit;
let healImage = new Image();
healImage.src = "heal.png";
let healButtons = [{x:35, y:290, frame:0}, {x:125, y:290, frame:0}, {x:215, y:290, frame:0}];
let detailsImage = new Image();
detailsImage.src = "details.png";
let detailsButtons = [{x:35, y:250, frame:0}, {x:125, y:250, frame:0}, {x:215, y:250, frame:0}];








let selectImage = new Image();
selectImage.src = "select.png";
let selectButtons = [{x:35, y:160, frame:0}, {x:125, y:160, frame:0}, {x:215, y:160, frame:0}];
let endMapMenu = 0;
let numberImage = new Image();
numberImage.src = "number.png";
let talentButtons = [{x:canvas.width / 2 - 64, y:canvas.height - 32 * 1.5, frame:0, value:-1},
                     {x:canvas.width / 2 + 32 * 0.5, y:canvas.height - 32 * 1.5, frame:0, value:-1}];










let closeCombatArchetype = {range:1, movement:3, maxhp:20, hp:20, attack:4, defense:2, speed:3};
let distanceArchetype = {range:2, movement:2, maxhp:18, hp:18, attack:3, defense:3, speed:2};
let supportArchetype = {range:2, movement:2, maxhp:15, hp:15, attack:1, defense:0, speed:1};

let archetypes = [closeCombatArchetype, distanceArchetype, supportArchetype];

function statsRange(ref)
{
  let res = Math.floor(Math.random() * 4) + ref - 1;
  if (res < 0)
    res = 0;
  return res;
}

class Unit {
  constructor(type, binding) {
    this.type = type;
    this.range = archetypes[type].range;
    this.movement = archetypes[type].movement;
    this.maxhp = statsRange(archetypes[type].maxhp);
    this.hp = this.maxhp;
    this.attack = [statsRange(archetypes[type].attack), 0];
    this.defense = [statsRange(archetypes[type].defense), 0];
    this.speed = statsRange(archetypes[type].speed);
    this.exp = 0;
    this.ability = [];
    this.binding = binding;
    this.wait = false;
  }

  levelUp() {
    if (this.exp < 100)
      return;
    this.attack[0] += Math.floor(Math.random() * 2) + 1;
    this.defense[0] += Math.floor(Math.random() * 2) + 1;
    this.speed += Math.floor(Math.random() * 2) + 1;
    this.maxhp += Math.floor(Math.random() * 5) + 1;
    this.exp -= 100;
  }
}

let playerUnits = [];
for (let i = 0; i < 3; i++) {
  playerUnits.push(new Unit(Math.floor(Math.random() * 3), i));
  playerUnits[i].attack[0] += 2;
  playerUnits[i].defense[0] += 2;
  playerUnits[i].maxhp += 2;
  playerUnits[i].hp += 2;
  playerUnits[i].speed += 2;
}

let enemyUnits = [];
let boss = new Unit(Math.floor(Math.random() * 2), 0);
let thief = new Unit(0, 1);











let grid = [];
for (let i = 0; i < 15; i++)
  for (let j = 0; j < 10; j++)
    grid.push({x:j * 32, y:i * 32, danger:[], highlight:0});
let map;

let tileImage = new Image();
tileImage.src = "tileset.png";

function coordinate(x, y) {
  return y * 10 + x;
}











let lastPosition = {x:0, y:0};

function isWall(x, y) {
  for (let i = 0; i < map.w.length; i++)
    if (map.w[i].x == x && map.w[i].y == y)
      return true;
  return false;
}

function validCoordinates(x, y)
{
  if (x < 0 || x > 9 || y < 0 || y > 14)
    return false;
  return true;
}

function findUnit(pos) {
  for (let i = 0; i < playerUnits.length; i++) {
    if (playerUnits[i].hp < 1)
      continue;
    if (map.p[playerUnits[i].binding].x == pos.x && map.p[playerUnits[i].binding].y == pos.y)
      return i;
  }
  return -1;
}

function findEnemy(pos) {
  for (let i = 0; i < enemyUnits.length; i++) {
    if (enemyUnits[i].hp < 1)
      continue;
    if (map.e[enemyUnits[i].binding].x == pos.x && map.e[enemyUnits[i].binding].y == pos.y)
      return i;
  }
  return -1;
}










let phase = 0;
let enemyToMove = 1;
let mapNumber = 0;










function fillNodeD(start, movex, movey, r, id) {
  if (!validCoordinates(start.x, start.y) || isWall(start.x, start.y) || findUnit(start) != -1)
    return;

  if (movey == 0 && movex == 0) {
    grid[start.y * 10 + start.x].danger.push(id * 2);

    if (start.x - r >= 0 && !isWall(start.x - r, start.y))
      grid[start.y * 10 + (start.x - r)].danger.push(id * 2 + 1);
    if (start.y + r < 15 && !isWall(start.x, start.y + r))
      grid[(start.y + r) * 10 + start.x].danger.push(id * 2 + 1);
    if (start.x + r < 10 && !isWall(start.x + r, start.y))
      grid[start.y * 10 + (start.x + r)].danger.push(id * 2 + 1);
    if (start.y - r >= 0 && !isWall(start.x, start.y - r))
      grid[(start.y - r) * 10 + start.x].danger.push(id * 2 + 1);

    if (r == 2) {
      if (start.x - 1 >= 0 && start.y + 1 < 15 && !isWall(start.x - 1, start.y + 1))
        grid[(start.y + 1) * 10 + (start.x - 1)].danger.push(id * 2 + 1);
      if (start.x - 1 >= 0 && start.y - 1 >= 0 && !isWall(start.x - 1, start.y - 1))
        grid[(start.y - 1) * 10 + (start.x - 1)].danger.push(id * 2 + 1);
      if (start.x + 1 < 10 && start.y + 1 < 15 && !isWall(start.x + 1, start.y + 1))
        grid[(start.y + 1) * 10 + (start.x + 1)].danger.push(id * 2 + 1);
      if (start.x + 1 < 10 && start.y - 1 >= 0 && !isWall(start.x + 1, start.y - 1))
        grid[(start.y - 1) * 10 + (start.x + 1)].danger.push(id * 2 + 1);
    }
    return;
  }
  let stepy = (movey < 0) ? -1 : 1;
  let stepx = (movex < 0) ? -1 : 1;
  if (Math.abs(movey) > Math.abs(movex) && movey != 0 && validCoordinates(start.x, start.y + stepy) && !isWall(start.x, start.y + stepy) && findUnit(start) == -1)
    fillNodeD({x:start.x, y:start.y + stepy}, movex, movey - stepy, r, id);
  else if (movex != 0 && !isWall(start.x + stepx, start.y) && findUnit(start) == -1)
    fillNodeD({x:start.x + stepx, y:start.y}, movex - stepx, movey, r, id);
  else if (movey != 0 && !isWall(start.x, start.y + stepy) && findUnit(start) == -1)
    fillNodeD({x:start.x, y:start.y + stepy}, movex, movey - stepy, r, id);
}

function fillDanger(start, m, r, id) {
  grid[start.y * 10 + start.x].danger.push(id * 2);
  if (start.x - r >= 0 && !isWall(start.x - r, start.y))
    grid[start.y * 10 + (start.x - r)].danger.push(id * 2 + 1);
  if (start.y + r < 15 && !isWall(start.x, start.y + r))
    grid[(start.y + r) * 10 + start.x].danger.push(id * 2 + 1);
  if (start.x + r < 10 && !isWall(start.x + r, start.y))
    grid[start.y * 10 + (start.x + r)].danger.push(id * 2 + 1);
  if (start.y - r >= 0 && !isWall(start.x, start.y - r))
    grid[(start.y - r) * 10 + start.x].danger.push(id * 2 + 1);

  if (r == 2) {
    if (start.x - 1 >= 0 && start.y + 1 < 15 && !isWall(start.x - 1, start.y + 1))
      grid[(start.y + 1) * 10 + (start.x - 1)].danger.push(id * 2 + 1);
    if (start.x - 1 >= 0 && start.y - 1 >= 0 && !isWall(start.x - 1, start.y - 1))
      grid[(start.y - 1) * 10 + (start.x - 1)].danger.push(id * 2 + 1);
    if (start.x + 1 < 10 && start.y + 1 < 15 && !isWall(start.x + 1, start.y + 1))
      grid[(start.y + 1) * 10 + (start.x + 1)].danger.push(id * 2 + 1);
    if (start.x + 1 < 10 && start.y - 1 >= 0 && !isWall(start.x + 1, start.y - 1))
      grid[(start.y - 1) * 10 + (start.x + 1)].danger.push(id * 2 + 1);
  }
  for (let max = m; max > 0; max--) {
    for (let i = -max; i < max + 1; i++) {
      let j = max - Math.abs(i);
      fillNodeD(start, j, i, r, id);
      fillNodeD(start, -j, i, r, id);
    }
  }
}

function dangerZone() {
  for (let i = 0; i < grid.length; i++)
    grid[i].danger = [];
  for (let i = 0; i < enemyUnits.length; i++) {
    if (enemyUnits[i].hp > 0)
      fillDanger(map.e[enemyUnits[i].binding], enemyUnits[i].movement, enemyUnits[i].range, enemyUnits[i].binding);
  }
}











let selected = -1;

function fillNodeP(start, movex, movey, r) {
  if (!validCoordinates(start.x, start.y) || isWall(start.x, start.y) || findEnemy(start) != -1)
    return;

  if (movey == 0 && movex == 0) {
    grid[start.y * 10 + start.x].highlight = 1;

    if (start.x - r >= 0 && !isWall(start.x - r, start.y) && grid[start.y * 10 + (start.x - r)].highlight != 1)
      grid[start.y * 10 + (start.x - r)].highlight = 2;
    if (start.y + r < 15 && !isWall(start.x, start.y + r) && grid[(start.y + r) * 10 + start.x].highlight != 1)
      grid[(start.y + r) * 10 + start.x].highlight = 2;
    if (start.x + r < 10 && !isWall(start.x + r, start.y) && grid[start.y * 10 + (start.x + r)].highlight != 1)
      grid[start.y * 10 + (start.x + r)].highlight = 2;
    if (start.y - r >= 0 && !isWall(start.x, start.y - r) && grid[(start.y - r) * 10 + start.x].highlight != 1)
      grid[(start.y - r) * 10 + start.x].highlight = 2;

    if (r == 2) {
      if (start.x - 1 >= 0 && start.y + 1 < 15 && !isWall(start.x - 1, start.y + 1) && grid[(start.y + 1) * 10 + (start.x - 1)].highlight != 1)
        grid[(start.y + 1) * 10 + (start.x - 1)].highlight = 2;
      if (start.x - 1 >= 0 && start.y - 1 >= 0 && !isWall(start.x - 1, start.y - 1) && grid[(start.y - 1) * 10 + (start.x - 1)].highlight != 1)
        grid[(start.y - 1) * 10 + (start.x - 1)].highlight = 2;
      if (start.x + 1 < 10 && start.y + 1 < 15 && !isWall(start.x + 1, start.y + 1) && grid[(start.y + 1) * 10 + (start.x + 1)].highlight != 1)
        grid[(start.y + 1) * 10 + (start.x + 1)].highlight = 2;
      if (start.x + 1 < 10 && start.y - 1 >= 0 && !isWall(start.x + 1, start.y - 1) && grid[(start.y - 1) * 10 + (start.x + 1)].highlight != 1)
        grid[(start.y - 1) * 10 + (start.x + 1)].highlight = 2;
    }
    return;
  }
  let stepy = (movey < 0) ? -1 : 1;
  let stepx = (movex < 0) ? -1 : 1;
  if (Math.abs(movey) > Math.abs(movex) && movey != 0 && validCoordinates(start.x, start.y + stepy) && !isWall(start.x, start.y + stepy) && findEnemy(start) == -1)
    fillNodeP({x:start.x, y:start.y + stepy}, movex, movey - stepy, r);
  else if (movex != 0 && !isWall(start.x + stepx, start.y) && findEnemy(start) == -1)
    fillNodeP({x:start.x + stepx, y:start.y}, movex - stepx, movey, r);
  else if (movey != 0 && !isWall(start.x, start.y + stepy) && findEnemy(start) == -1)
    fillNodeP({x:start.x, y:start.y + stepy}, movex, movey - stepy, r);
}

function fillPlayer(start, m, r) {
  grid[start.y * 10 + start.x].highlight = 1;
  if (start.x - r >= 0 && !isWall(start.x - r, start.y))
    grid[start.y * 10 + (start.x - r)].highlight = 2;
  if (start.y + r < 15 && !isWall(start.x, start.y + r))
    grid[(start.y + r) * 10 + start.x].highlight = 2;
  if (start.x + r < 10 && !isWall(start.x + r, start.y))
    grid[start.y * 10 + (start.x + r)].highlight = 2;
  if (start.y - r >= 0 && !isWall(start.x, start.y - r))
    grid[(start.y - r) * 10 + start.x].highlight = 2;

  if (r == 2) {
    if (start.x - 1 >= 0 && start.y + 1 < 15 && !isWall(start.x - 1, start.y + 1))
      grid[(start.y + 1) * 10 + (start.x - 1)].highlight = 2;
    if (start.x - 1 >= 0 && start.y - 1 >= 0 && !isWall(start.x - 1, start.y - 1))
      grid[(start.y - 1) * 10 + (start.x - 1)].highlight = 2;
    if (start.x + 1 < 10 && start.y + 1 < 15 && !isWall(start.x + 1, start.y + 1))
      grid[(start.y + 1) * 10 + (start.x + 1)].highlight = 2;
    if (start.x + 1 < 10 && start.y - 1 >= 0 && !isWall(start.x + 1, start.y - 1))
      grid[(start.y - 1) * 10 + (start.x + 1)].highlight = 2;
  }
  for (let max = m; max > 0; max--) {
    for (let i = -max; i < max + 1; i++) {
      let j = max - Math.abs(i);
      fillNodeP(start, j, i, r);
      fillNodeP(start, -j, i, r);
    }
  }
}









function getDistance(start, dest) {
  let distx = Math.abs(start.x - dest.x);
  let disty = Math.abs(start.y - dest.y);

  return distx + disty;
}

function isHitable(pos, binding) {
  if (!validCoordinates(pos.x, pos.y))
    return false;
  for (let i = 0; i < grid[pos.y * 10 + pos.x].danger.length; i++)
    if (grid[pos.y * 10 + pos.x].danger[i] == binding * 2 + 1)
      return true;
  return false;
}

function isPresent(pos, binding) {
  if (!validCoordinates(pos.x, pos.y))
    return false;
  for (let i = 0; i < grid[pos.y * 10 + pos.x].danger.length; i++)
    if (grid[pos.y * 10 + pos.x].danger[i] == binding * 2)
      return true;
  return false;
}

function goToSpot(unit, s, dest) {
  if (isPresent(dest, unit.binding) && findEnemy(dest) == -1 && findUnit(dest) == 1) {
    map.e[unit.binding].x = dest.x;
    map.e[unit.binding].y = dest.y;
    dangerZone();
    return;
  }
  let dist = getDistance(s, dest);
  let goal = map.e[unit.binding];
  for (let max = unit.movement; max > 0; max--) {
    for (let i = 0; i < max + 1; i++) {
      let j = max - i;
      if (findEnemy({x:s.x + j, y:s.y + i}) == -1 && isPresent({x:s.x + j, y:s.y + i}, unit.binding) && getDistance({x:s.x + j, y:s.y + i}, dest) < dist) {
        goal.x = s.x + j;
        goal.y = s.y + i;
        dist = getDistance({x:s.x + j, y:s.y + i}, dest);
      }
      if (findEnemy({x:s.x - j, y:s.y + i}) == -1 && isPresent({x:s.x - j, y:s.y + i}, unit.binding) && getDistance({x:s.x - j, y:s.y + i}, dest) < dist) {
        goal.x = s.x - j;
        goal.y = s.y + i;
        dist = getDistance({x:s.x - j, y:s.y + i}, dest);
      }
      if (findEnemy({x:s.x + j, y:s.y - i}) == -1 && isPresent({x:s.x + j, y:s.y - i}, unit.binding) && getDistance({x:s.x + j, y:s.y - i}, dest) < dist) {
        goal.x = s.x + j;
        goal.y = s.y - i;
        dist = getDistance({x:s.x + j, y:s.y - i}, dest);
      }
      if (findEnemy({x:s.x - j, y:s.y - i}) == -1 && isPresent({x:s.x - j, y:s.y - i}, unit.binding) && getDistance({x:s.x - j, y:s.y - i}, dest) < dist) {
        goal.x = s.x - j;
        goal.y = s.y - i;
        dist = getDistance({x:s.x - j, y:s.y - i}, dest);
      }
    }
  }
  map.e[unit.binding].x = goal.x;
  map.e[unit.binding].y = goal.y;
  dangerZone();
}








function createList(unit) {
  let t = [];
  for (let i = 0; i < playerUnits.length; i++) {
    t.push([]);
    t[i].push(Math.abs(unit.range - getDistance(map.e[unit.binding], map.p[playerUnits[i].binding])));
    t[i].push(playerUnits[i].hp);
    t[i].push(playerUnits[i].defense);
    t[i].push(playerUnits[i].attack);
    t[i].push(playerUnits[i].speed);
  }
  return t;
}

function eliminate(t, toEl) {
  for (let i = 0; i < 5; i++)
    t[toEl][i] = -1;
}

function compareData(t, pos) {
  let ref = 0;
  for (let i = 0; i < t.length; i++) {
    if (t[i][pos] != -1) {
      ref = i;
      break;
    }
  }
  for (let i = 1; i < t.length; i++) {
    if (t[i][pos] < t[ref][pos] && t[i][pos] != -1) {
      eliminate(t, ref);
      ref = i;
    }
  }
  for (let i = 0; i < t.length; i++) {
    if (i == ref)
      continue;
    if (t[i][pos] == t[ref][pos])
      return -1;
  }
  return ref;
}

function goHealing(unit) {
  let ref = 0;
  let t = [];
  for (let i = 0; i < enemyUnits.length; i++) {
    if (enemyUnits[i].binding == unit.binding || enemyUnits[i].hp == enemyUnits[i].maxhp)
      continue;
    t.push(enemyUnits[i].binding);
  }
  if (t.length < 1)
    return false;
  for (let i = 1; i < t.length; i++) {
    if (getDistance(map.e[unit.binding], map.e[t[i]]) < getDistance(map.e[unit.binding], map.e[t[ref]]))
      ref = i;
  }
  let s = map.e[t[ref]];
  let dest = map.e[unit.binding];
  let dist = getDistance(s, dest);
  let goal = {x:s.x, y:s.y};
  if (getDistance({x:s.x + 1, y:s.y}, dest) < dist) {
    goal.x = s.x + 1;
    goal.y = s.y;
    dist = getDistance({x:s.x + 1, y:s.y}, dest);
  }
  if (getDistance({x:s.x - 1, y:s.y}, dest) < dist) {
    goal.x = s.x - 1;
    goal.y = s.y;
    dist = getDistance({x:s.x - 1, y:s.y}, dest);
  }
  if (getDistance({x:s.x, y:s.y + 1}, dest) < dist) {
    goal.x = s.x;
    goal.y = s.y + 1;
    dist = getDistance({x:s.x, y:s.y + 1}, dest);
  }
  if (getDistance({x:s.x, y:s.y - 1}, dest) < dist) {
    goal.x = s.x;
    goal.y = s.y - 1;
    dist = getDistance({x:s.x, y:s.y - 1}, dest);
  }
  goToSpot(unit, map.e[unit.binding], goal);
  if (getDistance(s, dest) == 1)
    heal(unit, enemyUnits[t[ref]]);
  return true;
}

function chooseTarget(unit) {
  let ref = 0;
  let t = createList(unit);
  for (let i = 0; i < 5; i++) {
    ref = compareData(t, i);
    if (ref != -1)
      break;
  }
  let s = map.p[playerUnits[ref].binding];
  let dest = map.e[unit.binding];
  let dist = getDistance(s, dest);
  let goal = {x:s.x, y:s.y};
  for (let i = unit.range; i > 0; i--) {
    let j = unit.range - i;
    if (Math.abs(unit.range - getDistance({x:s.x + j, y:s.y + i}, dest)) < dist) {
      goal.x = s.x + j;
      goal.y = s.y + i;
      dist = Math.abs(unit.range - getDistance({x:s.x + j, y:s.y + i}, dest));
    }
    if (Math.abs(unit.range - getDistance({x:s.x - j, y:s.y + i}, dest)) < dist) {
      goal.x = s.x - j;
      goal.y = s.y + i;
      dist = Math.abs(unit.range - getDistance({x:s.x - j, y:s.y + i}, dest));
    }
    if (Math.abs(unit.range - getDistance({x:s.x + j, y:s.y - i}, dest)) < dist) {
      goal.x = s.x + j;
      goal.y = s.y - i;
      dist = Math.abs(unit.range - getDistance({x:s.x + j, y:s.y - i}, dest));
    }
    if (Math.abs(unit.range - getDistance({x:s.x - j, y:s.y - i}, dest)) < dist) {
      goal.x = s.x - j;
      goal.y = s.y - i;
      dist = Math.abs(unit.range - getDistance({x:s.x - j, y:s.y - i}, dest));
    }
  }
  goToSpot(unit, map.e[unit.binding], goal);
  if (getDistance(s, dest) == unit.range)
    fight(unit, playerUnits[ref]);
}









let end = false;
let menu = true;

function generateNewMap() {
  let select = Math.floor(Math.random() * premadeMaps.length);
  thief = new Unit(0, 1);
  boss = new Unit(Math.floor(Math.random() * 2), 0);
  boss.attack[0] += 3 + 2 * mapNumber;
  boss.defense[0] += 3 + 2 * mapNumber;
  boss.maxhp += 3 + 2 * mapNumber;
  boss.hp += 3 + 2 * mapNumber;
  boss.speed += 3 + 2 * mapNumber;
  boss.movement = 0;
  addTalent(boss, Math.floor(Math.random() * 5) + boss.type * 5);
  thief.range = 0;
  enemyUnits = [];
  enemyUnits.push(boss);
  enemyUnits.push(thief);
  map = {w:[], exit:{x:0, y:0}, e:[], p:[]};
  for (let i = 0; i < premadeMaps[select].w.length; i++)
    map.w.push({x:premadeMaps[select].w[i].x, y:premadeMaps[select].w[i].y});
  for (let i = 0; i < premadeMaps[select].e.length; i++)
    map.e.push({x:premadeMaps[select].e[i].x, y:premadeMaps[select].e[i].y});
  for (let i = 0; i < premadeMaps[select].p.length; i++)
    map.p.push({x:premadeMaps[select].p[i].x, y:premadeMaps[select].p[i].y});
  map.exit = {x:premadeMaps[select].exit.x, y:premadeMaps[select].exit.y};
  for (let i = 2; i < map.e.length; i++) {
    enemyUnits.push(new Unit(Math.floor(Math.random() * 3), i));
    enemyUnits[i].attack[0] += 2 * mapNumber;
    enemyUnits[i].defense[0] += 2 * mapNumber;
    enemyUnits[i].speed += 2 * mapNumber;
    enemyUnits[i].maxhp += 2 * mapNumber;
    enemyUnits[i].hp = enemyUnits[i].maxhp;
  }
  for (let i = 0; i < playerUnits.length; i++) {
    if (playerUnits[i].hp > 0) {
      playerUnits[i].hp = playerUnits[i].maxhp;
      playerUnits[i].wait = false;
    }
  }
  let newPotion = 2;
  for (let i = 0; i < playerUnits.length; i++) {
    if (playerUnits[i].type == 2 && playerUnits[i].hp > 0) {
      newPotion = 1;
      break;
    }
  }
  inventory.potion += newPotion;
  dangerZone();
}

generateNewMap();

function drawHp(max, x, y) {
  let width = 0;
  let height = 0;
  for (let i = 0; i < max; i++) {
    if (width > 32) {
      width = 0;
      height += 2;
    }
    context.fillRect(x + width, y + 30 - height, 1, 2);
    width++;
  }
}

function drawSplit(s, posx, posy, height) {
  s = s.toString();
  let toWrite = s.split('\n');
  for (let i = 0; i < toWrite.length; i++)
    context.fillText(toWrite[i], posx, posy + i * height);
}

function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);
  if (menu) {
    context.fillText("tap to start", canvas.width / 2, canvas.height - 10);
  } else if (!end) {
    for (let i = 0; i < grid.length; i++) {
      context.drawImage(tileImage, 0, 0, 32, 32, grid[i].x, grid[i].y, 32, 32);
      if (grid[i].danger.length > 0)
        context.drawImage(tileImage, 7 * 32, 0, 32, 32, grid[i].x, grid[i].y, 32, 32);
      if (grid[i].highlight == 1)
        context.drawImage(tileImage, 8 * 32, 0, 32, 32, grid[i].x, grid[i].y, 32, 32);
      if (grid[i].highlight == 2)
        context.drawImage(tileImage, 9 * 32, 0, 32, 32, grid[i].x, grid[i].y, 32, 32);
    }
    for (let i = 0; i < map.w.length; i++)
      context.drawImage(tileImage, 2 * 32, 0, 32, 32, grid[coordinate(map.w[i].x, map.w[i].y)].x, grid[coordinate(map.w[i].x, map.w[i].y)].y, 32, 32);
    context.drawImage(tileImage, 32, 0, 32, 32, grid[coordinate(map.exit.x, map.exit.y)].x, grid[coordinate(map.exit.x, map.exit.y)].y, 32, 32);
    if (enemyUnits[0].hp > 0)
      context.drawImage(tileImage, 5* 32, 0, 32, 32, grid[coordinate(map.e[0].x, map.e[0].y)].x, grid[coordinate(map.e[0].x, map.e[0].y)].y, 32, 32);
    if (enemyUnits[1].hp > 0)
      context.drawImage(tileImage, 6* 32, 0, 32, 32, grid[coordinate(map.e[1].x, map.e[1].y)].x, grid[coordinate(map.e[1].x, map.e[1].y)].y, 32, 32);
    for (let i = 2; i < map.e.length; i++)
      if (enemyUnits[i].hp > 0)
        context.drawImage(tileImage, 4 * 32, 0, 32, 32, grid[coordinate(map.e[i].x, map.e[i].y)].x, grid[coordinate(map.e[i].x, map.e[i].y)].y, 32, 32);
    for (let i = 0; i < map.p.length; i++)
      if (playerUnits[i].hp > 0)
        context.drawImage(tileImage, 3 * 32, 0, 32, 32, grid[coordinate(map.p[i].x, map.p[i].y)].x, grid[coordinate(map.p[i].x, map.p[i].y)].y, 32, 32);

    context.font = "20px Arial";
    context.fillStyle = "white";
    for (let i = 0; i < playerUnits.length; i++) {
      if (playerUnits[i].hp < 1)
        continue;
      context.drawImage(tileImage, (11 + playerUnits[i].type) * 32, 0, 32, 32, grid[coordinate(map.p[playerUnits[i].binding].x, map.p[playerUnits[i].binding].y)].x, grid[coordinate(map.p[playerUnits[i].binding].x, map.p[playerUnits[i].binding].y)].y, 32, 32);
      if (playerUnits[i].wait)
        context.drawImage(tileImage, 10 * 32, 0, 32, 32, grid[coordinate(map.p[playerUnits[i].binding].x, map.p[playerUnits[i].binding].y)].x, grid[coordinate(map.p[playerUnits[i].binding].x, map.p[playerUnits[i].binding].y)].y, 32, 32);
      drawHp(playerUnits[i].maxhp, grid[coordinate(map.p[playerUnits[i].binding].x, map.p[playerUnits[i].binding].y)].x, grid[coordinate(map.p[playerUnits[i].binding].x, map.p[playerUnits[i].binding].y)].y);
      context.fillStyle = "blue";
      drawHp(playerUnits[i].hp, grid[coordinate(map.p[playerUnits[i].binding].x, map.p[playerUnits[i].binding].y)].x, grid[coordinate(map.p[playerUnits[i].binding].x, map.p[playerUnits[i].binding].y)].y);
      context.fillStyle = "white";
    }
    for (let i = 0; i < enemyUnits.length; i++) {
      if (enemyUnits[i].hp < 1)
        continue;
      if (i != 1)
        context.drawImage(tileImage, (11 + enemyUnits[i].type) * 32, 0, 32, 32, grid[coordinate(map.e[enemyUnits[i].binding].x, map.e[enemyUnits[i].binding].y)].x, grid[coordinate(map.e[enemyUnits[i].binding].x, map.e[enemyUnits[i].binding].y)].y, 32, 32);
      drawHp(enemyUnits[i].maxhp, grid[coordinate(map.e[enemyUnits[i].binding].x, map.e[enemyUnits[i].binding].y)].x, grid[coordinate(map.e[enemyUnits[i].binding].x, map.e[enemyUnits[i].binding].y)].y);
      context.fillStyle = "red";
      drawHp(enemyUnits[i].hp, grid[coordinate(map.e[enemyUnits[i].binding].x, map.e[enemyUnits[i].binding].y)].x, grid[coordinate(map.e[enemyUnits[i].binding].x, map.e[enemyUnits[i].binding].y)].y);
      context.fillStyle = "white";
    }






    for (let i = 0; i < playerUnits.length; i++) {
      playerUnits[i].attack[1] = 0;
      playerUnits[i].defense[1] = 0;
    }
    for (let i = 0; i < enemyUnits.length; i++) {
      enemyUnits[i].attack[1] = 0;
      enemyUnits[i].defense[1] = 0;
    }
    for (let i = 0; i < playerUnits.length; i++)
      groupAttack(playerUnits[i], map.p);
    groupAttack(enemyUnits[0], map.e);
    for (let i = 0; i < playerUnits.length; i++)
      groupDefense(playerUnits[i], map.p);
    groupDefense(enemyUnits[0], map.e);
    for (let i = 0; i < playerUnits.length; i++)
      crossAttack(playerUnits[i], map.p[playerUnits[i].binding], enemyUnits, map.e);
    for (let i = 0; i < playerUnits.length; i++)
      crossDefense(playerUnits[i], map.p[playerUnits[i].binding], enemyUnits, map.e);





    context.textAlign = "center";
    if (activDetails) {
      context.textAlign = "left";
      context.drawImage(shadow, 0, 0, shadow.width, shadow.height, 0, 0, canvas.width, canvas.height);
      context.drawImage(cross, crossFrame * cross.width / 2, 0, cross.width / 2, cross.height, canvas.width - cross.width / 2, 0, cross.width / 2, cross.height);
      context.fillStyle = "white";
      context.font = "20px Arial";
      context.fillRect(20, 80, 48, 48);
      context.drawImage(tileImage, (detailedUnit.type + 11) * 32, 0, 32, 32, 20, 80, 48, 48);
      context.fillText("hp :" + detailedUnit.hp + "/" + detailedUnit.maxhp, 80, 120);
      context.fillText("atk:" + (detailedUnit.attack[0] + detailedUnit.attack[1]), 180, 120);
      context.fillText("def:" + (detailedUnit.defense[0] + detailedUnit.defense[1]), 80, 150);
      context.fillText("spe:" + detailedUnit.speed, 180, 150);
      let talentY = 190;
      for (let i = 0; i < detailedUnit.ability.length; i++) {
        context.fillText(detailedUnit.ability[i].name, 0, talentY);
        drawSplit(detailedUnit.ability[i].description, 10, talentY + 20, 20);
        talentY += 70;
      }







    } else if (activMenu) {
      context.drawImage(shadow, 0, 0, shadow.width, shadow.height, 0, 0, canvas.width, canvas.height);
      context.drawImage(cross, crossFrame * cross.width / 2, 0, cross.width / 2, cross.height, canvas.width - cross.width / 2, 0, cross.width / 2, cross.height);
      context.drawImage(tileImage, 14 * 32, 0, 32, 32, 0, 0, 64, 64);
      context.fillStyle = "white";
      context.font = "30px Arial";
      context.fillText("x " + inventory.potion, 84, 50);
      context.font = "20px Arial";
      for (let i = 0; i < playerUnits.length; i++) {
        context.fillStyle = "white";
        context.fillRect(40 + i * 90, 100, 48, 48);
        context.drawImage(tileImage, (playerUnits[i].type + 11) * 32, 0, 32, 32, 40 + i * 90, 100, 48, 48);
        context.fillText(playerUnits[i].hp + "/" + playerUnits[i].maxhp, 65 + i * 90, 170);
        context.fillText("atk:" + (playerUnits[i].attack[0] + playerUnits[i].attack[1]), 65 + i * 90, 190);
        context.fillText("def:" + (playerUnits[i].defense[0] + playerUnits[i].defense[1]), 65 + i * 90, 210);
        context.fillText("spe:" + playerUnits[i].speed, 65 + i * 90, 230);
        for (let j = 0; j < 50; j++)
          context.fillRect(40 + i * 90 + j, 240, 1, 3);
        context.fillStyle = "blue";
        for (let j = 0; j < playerUnits[i].exp; j += 2)
          context.fillRect(40 + i * 90 + j / 2, 240, 1, 3);
        context.drawImage(detailsImage, detailsButtons[i].frame * detailsImage.width / 2, 0, detailsImage.width / 2, detailsImage.height, detailsButtons[i].x, detailsButtons[i].y, detailsImage.width / 2, detailsImage.height);
        if (playerUnits[i].hp != playerUnits[i].maxhp)
          context.drawImage(healImage, healButtons[i].frame * healImage.width / 2, 0, healImage.width / 2, healImage.height, healButtons[i].x, healButtons[i].y, healImage.width / 2, healImage.height);
      }
    }







    if (endMapMenu == 1) {
      context.drawImage(shadow, 0, 0, shadow.width, shadow.height, 0, 0, canvas.width, canvas.height);
      context.fillStyle = "white";
      context.font = "20px Arial";
      for (let i = 0; i < playerUnits.length; i++) {
        if (playerUnits[i].hp > 0)  {
          context.fillRect(40 + i * 90, 100, 48, 48);
          context.drawImage(tileImage, (playerUnits[i].type + 11) * 32, 0, 32, 32, 40 + i * 90, 100, 48, 48);
          context.drawImage(selectImage, selectButtons[i].frame * selectImage.width / 2, 0, selectImage.width / 2, selectImage.height, selectButtons[i].x, selectButtons[i].y, selectImage.width / 2, selectImage.height);
        }
      }
    } else if (endMapMenu == 2) {
      context.textAlign = "left";
      context.drawImage(shadow, 0, 0, shadow.width, shadow.height, 0, 0, canvas.width, canvas.height);
      context.drawImage(cross, crossFrame * cross.width / 2, 0, cross.width / 2, cross.height, canvas.width - cross.width / 2, 0, cross.width / 2, cross.height);
      context.fillStyle = "white";
      context.font = "20px Arial";
      context.fillRect(20, 80, 48, 48);
      context.drawImage(tileImage, (detailedUnit.type + 11) * 32, 0, 32, 32, 20, 80, 48, 48);
      context.fillText("hp :" + detailedUnit.hp + "/" + detailedUnit.maxhp, 80, 120);
      context.fillText("atk:" + (detailedUnit.attack[0] + detailedUnit.attack[1]), 180, 120);
      context.fillText("def:" + (detailedUnit.defense[0] + detailedUnit.defense[1]), 80, 150);
      context.fillText("spe:" + detailedUnit.speed, 180, 150);
      let talentY = 190;
      for (let i = 0; i < detailedUnit.ability.length; i++) {
        context.fillText(detailedUnit.ability[i].name, 0, talentY);
        talentY += 20;
      }
      talentY += 40;
      for (let i = 0; i < 2; i++) {
        if (shownTalent[detailedUnit.binding][i] >= 0) {
          context.fillText(talents[shownTalent[detailedUnit.binding][i] + 5 * detailedUnit.type].name, 0, talentY);
          drawSplit(talents[shownTalent[detailedUnit.binding][i] + 5 * detailedUnit.type].description, 10, talentY + 20, 20);
          talentY += 70;
          context.drawImage(numberImage, (talentButtons[i].frame + i * 2) * (numberImage.width / 4), 0, numberImage.width / 4, numberImage.height, talentButtons[i].x, talentButtons[i].y, numberImage.height * 1.5, numberImage.height * 1.5);
        }
      }
    }







    if (phase == 0) {
      let count = 0;
      for (let i = 0; i < playerUnits.length; i++)
        if (playerUnits[i].wait)
          count++;
      if (count == playerUnits.length) {
        for (let i = 0; i < enemyUnits.length; i++)
          if (enemyUnits[i].hp > 0)
            enemyUnits[i].wait = false;
        phase = 1;
      }
    } else if (phase == 1) {
      let go = true;
      for (let i = 2; i < enemyUnits.length; i++) {
        if (!enemyUnits[i].wait) {
          go = false;
          break;
        }
      }
      if (go) {
        for (let i = 0; i < playerUnits.length; i++)
          if (playerUnits[i].hp > 1)
            playerUnits[i].wait = false;
        phase = 2;
      }
    } else if (phase == 2) {
      goToSpot(enemyUnits[1], map.e[1], map.exit);
      if (map.e[1].x == map.exit.x && map.e[1].y == map.exit.y)
        enemyUnits[1].hp = 0;
      phase = 3;
    } else {
      if (enemyUnits[0].hp > 0) {
        enemyUnits[0].hp += 2;
        if (enemyUnits[0].hp > enemyUnits[0].maxhp)
          enemyUnits[0].hp = enemyUnits[0].maxhp;
        chooseTarget(enemyUnits[0]);
      }
      phase = 0;
    }







    let change = 0;
    for (let i = 0; i < enemyUnits.length; i++)
      if (enemyUnits[i].hp < 1)
        change++;
    if (change == enemyUnits.length) {
      phase = 0;
      if (endMapMenu == 0 && mapNumber < 5) {
        selectTalent();
        endMapMenu = 1;
      }
    }
    if (mapNumber == 5) {
      end = true;
      return;
    }








    let death = 0;
    for (let i = 0; i < playerUnits.length; i++)
      if (playerUnits[i].hp < 1)
        death++;
    if (death == playerUnits.length)
      end = true;
  } else {
    context.textAlign = "center";
    context.fillStyle = "black";
    context.font = "30px Arial";
    context.fillText("money : " + inventory.money, canvas.width / 2, 30);
    context.fillText("obj1 : " + inventory.obj1, canvas.width / 2, 60);
    context.fillText("obj2 : " + inventory.obj2, canvas.width / 2, 90);
    context.fillText("obj3 : " + inventory.obj3, canvas.width / 2, 120);
    context.font = "20px Arial";
    context.fillText("tap to restart", canvas.width / 2, canvas.height - 10);
  }
}








function heal(unitA, unitB) {
  if (unitA.hp < 1 || unitB.hp < 1)
    return;
  unitB.hp += unitA.attack[0] + 2;
  if (unitB.hp > unitB.maxhp)
    unitB.hp = unitB.maxhp;
  if (talentPresent(unitA, "self-heal")) {
    unitA.hp += Math.floor((unitA.attack[0] + 2) / 2);
    if (unitA.hp > unitA.maxhp)
      unitA.hp = unitA.maxhp;
  }
  unitA.exp += 10;
  for (let i = 0; i < playerUnits.length; i++)
    playerUnits[i].levelUp();
}

function addExp(unitA, unitB, expA, expB) {
  unitA.exp += expA;
  unitB.exp += expB;
  for (let i = 0; i < playerUnits.length; i++)
    playerUnits[i].levelUp();
}

function fight(unitA, unitB) {
  if (unitA.hp < 1 || unitB.hp < 1)
    return;
  let damageA = (unitA.attack[0] + unitA.attack[1]) - (unitB.defense[0] + unitB.defense[1]);
  damageA = (talentPresent(unitA, "half-measure")) ? Math.floor(unitB.hp / 2) : damageA;
  damageA = (damageA < 1 && !talentPresent(unitA, "half-measure")) ? 1 : damageA;
  let damageB = (unitB.attack[0] + unitB.attack[1]) - (unitA.defense[0] + unitA.defense[1]);
  damageB = (damageB < 1) ? 1 : damageB;

  unitB.hp -= damageA;
  if (unitB.hp <= 0) {
    addExp(unitA, unitB, 50, 0);
    return;
  }
  let rB = unitB.range;
  rB = (rB == 0) ? 1 : rB;
  if (unitA.range == rB || talentPresent(unitB, "distant counter") || talentPresent(unitB, "close counter"))
    unitA.hp -= damageB;
  if (unitA.hp <= 0) {
    addExp(unitA, unitB, 0, 50);
    return;
  }
  damageA = (talentPresent(unitA, "half-measure")) ? Math.floor(unitB.hp / 2) : damageA;
  if ((unitA.speed > unitB.speed + 3 && !talentPresent(unitB, "antidouble")) || talentPresent(unitA, "guaranteed double"))
    unitB.hp -= damageA;
  if (unitB.hp <= 0) {
    addExp(unitA, unitB, 50, 0);
    return;
  }
  addExp(unitA, unitB, 10, 10);
}

function startFight(pos, cx, cy, r, align) {
  let disty = Math.abs(pos.y - cy);
  let distx = Math.abs(pos.x - cx);

  if (distx + disty != r)
    return false;
  if (align == 0) {
    if (findEnemy({x:cx, y:cy}) != -1)
      return true;
  } else {
    if (findUnit({x:cx, y:cy}) != -1)
      return true;
  }
  return false;
}










function playerCanHeal(onClick) {
  if (selected == -1 || playerUnits[selected].type != 2)
    return false;
  if (onClick == selected || onClick == -1)
    return false;
  if (playerUnits[onClick].hp == playerUnits[onClick].maxhp)
    return;
  let max = talentPresent(playerUnits[selected], "distant heal") ? 2 : 1;
  if (getDistance(map.p[playerUnits[selected].binding], map.p[playerUnits[onClick].binding]) > max)
    return false;
  return true;
}

function addObject() {
  let oType = Math.floor(Math.random() * 4);

  if (oType == 0)
    inventory.money += 50;
  else if (oType == 1)
    inventory.obj1++;
  else if (oType == 2)
    inventory.obj2++;
  else
    inventory.obj3++;
}

document.addEventListener('click', function(e) {
  let relativeX = e.x - canvas.offsetLeft;
  let relativeY = e.y - canvas.offsetTop;

  if (menu) {
    menu = false;
    return;
  }










  if (end) {
    menu = true;
    end = false;
    mapNumber = 0;
    playerUnits = [];
    inventory = {money:0, obj1:0, obj2:0, obj3:0, potion:0};
    for (let i = 0; i < 3; i++) {
      playerUnits.push(new Unit(Math.floor(Math.random() * 3), i));
      playerUnits[i].attack += 2;
      playerUnits[i].defense += 2;
      playerUnits[i].maxhp += 2;
      playerUnits[i].hp += 2;
      playerUnits[i].speed += 2;
    }
    generateNewMap();










  } else if (phase == 0) {
    let unitOnClick = findUnit({y:Math.floor(relativeY / 32), x:Math.floor(relativeX / 32)});
    let enemyOnClick = findEnemy({y:Math.floor(relativeY / 32), x:Math.floor(relativeX / 32)});

    if (!activMenu) {
      if (playerCanHeal(unitOnClick)) {
        heal(playerUnits[selected], playerUnits[unitOnClick]);
        for (let i = 0 ; i < grid.length; i++)
          grid[i].highlight = 0;
        playerUnits[selected].wait = true;
        selected = -1
        dangerZone();
        return;
      }
      if (grid[Math.floor(relativeY / 32) * 10 + Math.floor(relativeX / 32)].highlight == 0 || (unitOnClick != -1 && unitOnClick != selected)) {
        for (let i = 0 ; i < grid.length; i++)
          grid[i].highlight = 0;
        if (selected != -1) {
          map.p[playerUnits[selected].binding].x = lastPosition.x;
          map.p[playerUnits[selected].binding].y = lastPosition.y;
          selected = -1;
        }

      } else if (!playerUnits[selected].wait && grid[Math.floor(relativeY / 32) * 10 + Math.floor(relativeX / 32)].highlight != 0 && startFight(map.p[playerUnits[selected].binding], Math.floor(relativeX / 32), Math.floor(relativeY / 32), playerUnits[selected].range, 0)) {
        fight(playerUnits[selected], enemyUnits[enemyOnClick]);
        if (enemyOnClick == 1 && enemyUnits[1].hp < 1)
          addObject();
        playerUnits[selected].wait = true;
        selected = -1;
        for (let i = 0 ; i < grid.length; i++)
          grid[i].highlight = 0;
        dangerZone();
        return;

      } else if (selected != -1 && grid[Math.floor(relativeY / 32) * 10 + Math.floor(relativeX / 32)].highlight == 1 && !playerUnits[selected].wait) {
        if (selected == unitOnClick) {
          playerUnits[selected].wait = true;
          selected = -1;
          dangerZone();
          for (let i = 0 ; i < grid.length; i++)
            grid[i].highlight = 0;
          return;
        }
        map.p[playerUnits[selected].binding].x = Math.floor(relativeX / 32);
        map.p[playerUnits[selected].binding].y = Math.floor(relativeY / 32);
        return;
      }
      map.p.forEach(function(pos) {
        if (relativeX >= pos.x * 32 && relativeX < (pos.x + 1) * 32 && relativeY >= pos.y * 32 && relativeY < (pos.y + 1) * 32) {
          selected = findUnit(pos);
          if (selected != -1) {
            lastPosition.x = pos.x;
            lastPosition.y = pos.y;
            fillPlayer(pos, playerUnits[selected].movement, playerUnits[selected].range);
          }
        }
      });
    }
  }
});

document.addEventListener('mousedown', function(e) {
  let relativeX = e.x - canvas.offsetLeft;
  let relativeY = e.y - canvas.offsetTop;
  let unitOnClick = findUnit({y:Math.floor(relativeY / 32), x:Math.floor(relativeX / 32)});
  let enemyOnClick = findEnemy({y:Math.floor(relativeY / 32), x:Math.floor(relativeX / 32)});

  if (phase != 0 || end || menu)
    return;
  if (endMapMenu == 1) {
    for (let i = 0; i < 3; i++) {
      if (relativeX >= selectButtons[i].x && relativeX < selectButtons[i].x + healImage.width / 2 && relativeY >= selectButtons[i].y && relativeY < selectButtons[i].y + healImage.height) {
        selectButtons[i].frame = 1;
        return;
      }
    }
    return;
  }
  if (endMapMenu == 2) {
    if (relativeX > canvas.width - cross.width / 2 && relativeX < canvas.width && relativeY > 0 && relativeY < cross.height) {
      crossFrame = 1;
      return;
    }
    for (let i = 0; i < 2; i++) {
      if (relativeX >= talentButtons[i].x && relativeX < talentButtons[i].x + numberImage.width / 4 * 1.5 && relativeY >= talentButtons[i].y && relativeY < talentButtons[i].y + numberImage.height * 1.5) {
        talentButtons[i].frame = 1;
        return;
      }
    }
    return;
  }
  if (enemyOnClick != -1 && ((selected != -1 && getDistance(map.p[selected], map.e[enemyOnClick]) != playerUnits[selected].range) || selected == -1)) {
    activDetails = true;
    detailedUnit = enemyUnits[enemyOnClick];
    return;
  }
  if (relativeX > canvas.width - cross.width / 2 && relativeX < canvas.width && relativeY > 0 && relativeY < cross.height) {
    crossFrame = 1;
    return;
  }
  if (endMapMenu == 0 && unitOnClick == -1 && selected == -1 && !activMenu && enemyOnClick == -1) {
    activMenu = true;
    return;
  }
  for (let i = 0; i < 3; i++) {
    if (relativeX >= healButtons[i].x && relativeX < healButtons[i].x + healImage.width / 2 && relativeY >= healButtons[i].y && relativeY < healButtons[i].y + healImage.height) {
      healButtons[i].frame = 1;
      return;
    }
  }
  for (let i = 0; i < 3; i++) {
    if (relativeX >= detailsButtons[i].x && relativeX < detailsButtons[i].x + detailsImage.width / 2 && relativeY >= detailsButtons[i].y && relativeY < detailsButtons[i].y + detailsImage.height) {
      detailsButtons[i].frame = 1;
      return;
    }
  }
});

document.addEventListener('mouseup', function(e) {
  let relativeX = e.x - canvas.offsetLeft;
  let relativeY = e.y - canvas.offsetTop;

  if ((!activMenu && !activDetails && endMapMenu == 0) || phase != 0 || end || menu)
    return;
  crossFrame = 0;
  for (let i = 0; i < 3; i++)
    healButtons[i].frame = 0;
  for (let i = 0; i < 3; i++)
    detailsButtons[i].frame = 0;
  for (let i = 0; i < 3; i++)
    selectButtons[i].frame = 0;
  for (let i = 0; i < 2; i++)
    talentButtons[i].frame = 0;
  if (endMapMenu == 1) {
    for (let i = 0; i < 3; i++) {
      if (relativeX >= selectButtons[i].x && relativeX < selectButtons[i].x + healImage.width / 2 && relativeY >= selectButtons[i].y && relativeY < selectButtons[i].y + healImage.height) {
        detailedUnit = playerUnits[i];
        talentButtons[0].value = shownTalent[detailedUnit.binding][0];
        talentButtons[1].value = shownTalent[detailedUnit.binding][1];
        endMapMenu = 2;
        return;
      }
    }
    return;
  }
  if (endMapMenu == 2) {
    if (relativeX >= canvas.width - cross.width / 2 && relativeX < canvas.width && relativeY >= 0 && relativeY < cross.height) {
      endMapMenu = 1;
      return;
    }
    for (let i = 0; i < 2; i++) {
      if (relativeX >= talentButtons[i].x && relativeX < talentButtons[i].x + numberImage.width / 4 * 1.5 && relativeY >= talentButtons[i].y && relativeY < talentButtons[i].y + numberImage.height * 1.5) {
        assignTalent(talentButtons[i].value);
        endMapMenu = 0;
        mapNumber++;
        inventory.money += 100;
        generateNewMap();
        return;
      }
    }
    return;
  }
  for (let i = 0; i < 3; i++) {
    if (relativeX >= healButtons[i].x && relativeX < healButtons[i].x + healImage.width / 2 && relativeY >= healButtons[i].y && relativeY < healButtons[i].y + healImage.height) {
      usePotion(playerUnits[i]);
      return;
    }
  }
  if (activDetails && relativeX >= canvas.width - cross.width / 2 && relativeX < canvas.width && relativeY >= 0 && relativeY < cross.height) {
    activDetails = false;
    return;
  }
  if (relativeX >= canvas.width - cross.width / 2 && relativeX < canvas.width && relativeY >= 0 && relativeY < cross.height) {
    activMenu = false;
    return;
  }
  for (let i = 0; i < 3; i++) {
    if (relativeX >= detailsButtons[i].x && relativeX < detailsButtons[i].x + healImage.width / 2 && relativeY >= detailsButtons[i].y && relativeY < detailsButtons[i].y + healImage.height) {
      activDetails = true;
      detailedUnit = playerUnits[i];
      return;
    }
  }
});







function increment() {
  if (phase != 1)
    return;
  if (enemyToMove + 1 >= enemyUnits.length) {
    enemyToMove = 1;
    return;
  }
  enemyToMove++;
  if (enemyUnits[enemyToMove].hp < 1 || enemyUnits[enemyToMove].wait)
    return;
  if (enemyUnits[enemyToMove].type != 2 || !goHealing(enemyUnits[enemyToMove]))
    chooseTarget(enemyUnits[enemyToMove]);
  enemyUnits[enemyToMove].wait = true;
}

setInterval(increment, 500);

requestAnimationFrame(loop);