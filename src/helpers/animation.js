// Contains animation logic and solution steps
// play and pause functions should create side effects to screen (a fading play or pause icon)

// get animation steps (every move should be valid)
const getAnimationSteps = (procedure, gameState, initDisks, source, destination) => {
  const initDisksCopy = initDisks.map(x => x - 0.001);
  const diskPositions = new Array((procedure !== 1 ? 1 : 2) * initDisks.length);
  // replace initDisks (with ordered disk radii) with disk positions based on gameState
  // index represents disk number ranked from least to largest
  // Ex: [0,0,1] means all disks are on the tower 0 except the largest disk, which is on the tower 1
  procedure !== 1 ?
    gameState.forEach((tower, towerIndex) => {
      tower.forEach((disk) => {
        const index = initDisks.length - 1 - initDisks.indexOf(disk);
        diskPositions[index] = towerIndex;
      })
    }) :
    gameState.forEach((tower, towerIndex) => {
      tower.forEach((disk) => {
        const index0 = initDisks.indexOf(disk);
        const index1 = initDisksCopy.indexOf(disk);
        const index = (initDisks.length - 1 - (index0 + index1 + 1)) * 2 + (index0 !== -1 ? 1 : 0);
        diskPositions[index] = towerIndex;
      })
    })

  // populating animationSteps
  const animationSteps = [];
  (diskPositions[0] === undefined) ||
    (
      procedure === 0 ? standardSteps(animationSteps, diskPositions, destination) :
        procedure === 1 ? bicolorSetup(animationSteps, diskPositions, diskPositions.length, source, destination) :
          procedure === 2 ? adjacentSteps(animationSteps, diskPositions, diskPositions.length, destination) :
            alert(false)
    );

  // first move should hover ([from, from], using first move's from)
  const from = animationSteps[0] ? animationSteps[0][0] : -1;
  animationSteps.unshift([from, from]);

  return animationSteps;
}

// iterative solution following standard procedure and rules
// adapted from: Stack Overflow, July 2022 (https://stackoverflow.com/questions/62235341/solving-tower-of-hanoi-with-given-arrangements) 
const standardSteps = (animationSteps, diskPositions, destination) => {
  const n = diskPositions.length;
  let target = destination; // current target for disk at index n-1
  // array containing target tower for disk corresponding to index, similar to disk's current tower in diskPositions
  const targets = new Array(n);

  for (let i = n - 1; i >= 0; i--) {
    targets[i] = target;
    // move smaller disk to auxiliary tower to enable move from current position to target
    if (diskPositions[i] !== target) target = 3 - target - diskPositions[i];
  }

  // checking for disk position completion: whether disks are have been moved to destination tower (starting from largest disk)
  let i = 0;
  while (i < n) {
    // find disk to be moved (smallest disk out of placement)
    for (i = 0; i < n; i++) {
      if (targets[i] !== diskPositions[i]) {
        target = targets[i];
        animationSteps.push([diskPositions[i], target]);
        diskPositions[i] = target; // swap towers to target
        // update targets for smaller disks
        for (let j = i - 1; j >= 0; j--) {
          targets[j] = target;
          target = 3 - target - diskPositions[j];
        }
        break; // restart from beginning (until all disks are at destination tower)
      }
    }
  }
}

// sets up solution animation for bicolor procedure and rules
const bicolorSetup = (animationSteps, diskPositions, disksToMove, source, destination) => {  // Second option (slower)
  // converge into a single tower
  bicolorHelper(animationSteps, diskPositions, disksToMove, 3 - source - destination);
  bicolorSteps(animationSteps, diskPositions, disksToMove, source, destination);
}

// recursive solution following bicolor procedure and rules
// precond: diskToMove disks starting from the smallest has been converged to a single tower that is not source or destination
// invariant: sorts towers in disk pairs
const bicolorSteps = (animationSteps, diskPositions, disksToMove, source, destination) => {
  for (let badDisk = disksToMove - 1; badDisk >= 0; badDisk -= 2) {
    if (diskPositions[badDisk] !== destination || diskPositions[badDisk - 1] !== destination) {
      const toDest = diskPositions[badDisk]; // largest out of place disk needed to be moved to destination
      const toSource = diskPositions[badDisk - 1]; // largest out of place disk needed to be moved to source
      const auxDest = 3 - toDest - destination;
      const auxSource = 3 - toSource - source;
      // toDest === toSource (stacked on top of each other)
      bicolorMove(animationSteps, diskPositions, badDisk - 1, badDisk, auxDest, toDest, destination); // move toDest to destination
      bicolorMove(animationSteps, diskPositions, badDisk - 1, badDisk - 1, auxSource, toSource, source); // move toSource to source
      bicolorHelper(animationSteps, diskPositions, badDisk - 1, 3 - source - destination);
      // recurse on smaller case (swap destination and source)
      bicolorSteps(animationSteps, diskPositions, badDisk - 1, destination, source);
      break;
    }
  }
}

// helper function for bicolor move
// moves disk from src to dest tower following bicolor procedure and rules
const bicolorMove = (animationSteps, diskPositions, disksToMove, diskIndex, aux, src, dest) => {
  bicolorHelper(animationSteps, diskPositions, disksToMove, aux); // move smaller disks to aux tower
  animationSteps.push([src, dest]); // move and add to animationSteps
  diskPositions[diskIndex] = dest; // update diskPositions
}

// heuristic helper function for stacking bicolor towers 
// stacks diskToMove number of towers starting from smallest at destination tower
// precond: diskToMove is even
const bicolorHelper = (animationSteps, diskPositions, disksToMove, destination) => {
  for (let badDisk = disksToMove - 1; badDisk >= 0; badDisk -= 2) {
    if (diskPositions[badDisk] !== destination || diskPositions[badDisk - 1] !== destination) {
      // stack even number of towers
      // heuristic algorithm (choose the fastest out of the two ways of moving: first then second, or second then first)
      const first = diskPositions[badDisk];
      const second = diskPositions[badDisk - 1];
      const aux1 = 3 - first - destination;
      const aux2 = 3 - second - destination;
      if (first !== destination && second === destination) {
        bicolorMove(animationSteps, diskPositions, badDisk - 1, badDisk, aux1, first, destination);
      }
      else if (second !== destination && first === destination) {
        bicolorMove(animationSteps, diskPositions, badDisk - 1, badDisk - 1, aux2, second, destination);
      }
      else {
        const animationSteps1 = [];
        const animationSteps2 = [];
        // add phantom copy of diskPositions to test which sequence of moving disks takes lesser amount of moves
        bicolorHelper(animationSteps1, diskPositions.map(x => x), badDisk - 1, aux1); // move smaller disks to aux1
        bicolorHelper(animationSteps2, diskPositions.map(x => x), badDisk - 1, aux2); // move smaller disks to aux2
        const isFirstShorter = animationSteps1.length < animationSteps2.length;
        // chosing option with less amount of moves
        bicolorMove(animationSteps, diskPositions, badDisk - 1,
          isFirstShorter ? badDisk : badDisk - 1, isFirstShorter ? aux1 : aux2, isFirstShorter ? first : second, destination);
        bicolorMove(animationSteps, diskPositions, badDisk - 1,
          isFirstShorter ? badDisk - 1 : badDisk, isFirstShorter ? aux2 : aux1, isFirstShorter ? second : first, destination);
      }
      bicolorHelper(animationSteps, diskPositions, badDisk - 1, destination) // set smaller disks to destination
      break;
    }
  }
}

// recursive solution following adjacent procedure and rules 
// solves for the first n disks in diskPositions
// adapted from: Stack Overflow, July 2022 (https://stackoverflow.com/questions/62235341/solving-tower-of-hanoi-with-given-arrangements) 
const adjacentSteps = (animationSteps, diskPositions, disksToMove, destination) => {
  for (let badDisk = disksToMove - 1; badDisk >= 0; badDisk--) {
    const current = diskPositions[badDisk];
    // find largest disk out of place
    if (current !== destination) {
      const aux = 3 - current - destination;
      if (Math.abs(destination - current) === 2) {
        // need to move badDisk to aux tower first, so move smaller disks to destination tower
        adjacentSteps(animationSteps, diskPositions, badDisk, destination);
        animationSteps.push([current, aux]); // adjacent move
        diskPositions[badDisk] = aux;
        // move smaller disks to current tower
        adjacentSteps(animationSteps, diskPositions, badDisk, current);
        // destination tower is now free
        animationSteps.push([aux, destination]);
        diskPositions[badDisk] = destination;
        // move smaller disks back
        adjacentSteps(animationSteps, diskPositions, badDisk, destination);
      }
      else {
        // move smaller disks out of the way
        adjacentSteps(animationSteps, diskPositions, badDisk, aux);
        animationSteps.push([current, destination]); // adjacent move
        diskPositions[badDisk] = destination;
        // move smaller disks back
        adjacentSteps(animationSteps, diskPositions, badDisk, destination);
      }
      break;
    }
  }
}

export default getAnimationSteps;