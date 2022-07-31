// Contains helper functions for checking valid moves and winning conditions

// checks whether a move is valid
export const isValidMove = (gameState, procedure, from, to) => {
	return commonCheck(gameState, from, to) && (
		procedure <= 1 ? true :
		procedure === 2 ? adjacentCheck(from, to) : 
		false
	);
}

// check if a move follows common rule (larger disk cannot be stacked on top of a smaller one)
const commonCheck = (gameState, from, to) => {
	const radius = gameState[from].at(-1);
	const toTower = gameState[to];
	return (
		from !== to && (
			toTower.length === 0 || 
			radius < toTower.at(-1) ||
			radius - toTower.at(-1) < 0.002
		)
	);
}

// check if a move is valid based on adjacent puzzle rules
const adjacentCheck = (from, to) => {
	return Math.abs(to - from) === 1;
}

// checks for winning condition
export const winCondition = (procedure, numDisks, sourceTower, destTower) => {
	return procedure === 1 ? 
		bicolorWinCondition(numDisks, sourceTower, destTower) : 
		commonWinCondition(numDisks, destTower);
}

// checks for common win condition (all disks at destTower)
const commonWinCondition = (numDisks, destTower) => 
	destTower && destTower.length === numDisks;

// checks for winning condition based on bicolor puzzle rules
// 1. towers are both monochrome and are at src and dest
// 2. bottom disks need to be switched
const bicolorWinCondition = (numDisks, sourceTower, destTower) => {
	const patternCheck = () => {
		let isWin = true;
		sourceTower && sourceTower.forEach((radius, index) => {
			const compare = (0.7-0.38*index/(numDisks-1) - (index%2 ? 0 : 0.001));
			isWin = isWin && Math.abs(radius - compare) < 0.0001;
		});
		return isWin;
	}
	
	return (
		sourceTower && 
		destTower &&
		sourceTower.length === numDisks &&
		destTower.length === numDisks &&
		patternCheck()
	);
}