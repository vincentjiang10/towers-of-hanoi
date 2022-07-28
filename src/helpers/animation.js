// Contains animation logic and solution steps
// play and pause functions should create side effects to screen (a fading play or pause icon)

// get animation steps (every move should be valid)
const getAnimationSteps = (procedure, gameState, initDisks, destination) => {
  const diskPositions = new Array(initDisks.length);
  // replace initDisks (with ordered disk radii) with disk positions based on gameState
  // index represents disk number ranked from least to largest
  // Ex: [0,0,1] means all disks are on the tower 0 except the largest disk, which is on the tower 1
  gameState.forEach((tower, towerIndex) => {
    tower.forEach((disk) => {
      const index = initDisks.length - 1 - initDisks.indexOf(disk);
      diskPositions[index] = towerIndex;
    })
  })

  // populating animationSteps
  const animationSteps = [];
  (diskPositions[0] === undefined) || 
  (
    procedure === 0 ? standardSteps(animationSteps, diskPositions, destination) :
    procedure === 1 ? bicolorSteps(animationSteps, diskPositions, destination) :
    procedure === 2 ? adjacentSteps(animationSteps, diskPositions, initDisks.length || -1, destination) :
    alert(false)
  );

  // first move should hover ([from, from], using first move's from)
  const from = animationSteps[0] ? animationSteps[0][0] : -1;
  animationSteps.unshift([from, from]);

	return animationSteps; 
}

// iterative solution following standard puzzle rules
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
        for (let j = i-1; j >= 0; j--) {
          targets[j] = target;
          target = 3 - target - diskPositions[j];
        }
        break; // restart from beginning (until all disks are at destination tower)
      }
    }
  }
}

// recursive solution following bicolor puzzle rules
const bicolorSteps = (animationSteps, diskPositions, destination) => {

}


// recursive solution following adjacent puzzle rules 
// solves for the first n discs in diskPositions
// adapted from: Stack Overflow, July 2022 (https://stackoverflow.com/questions/62235341/solving-tower-of-hanoi-with-given-arrangements) 
const adjacentSteps = (animationSteps, diskPositions, disksToMove, destination) => {
  for (let badDisk = disksToMove-1; badDisk >= 0; badDisk--) {
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