class SudokuSolver {

  validate(puzzleString) {
    const validCharacters = /^[1-9.]+$/;
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    if (!validCharacters.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const start = row * 9;
    for (let i = 0; i < 9; i++) {
      if (puzzleString[start + i] === String(value)) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzleString[column + i * 9] === String(value)) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (puzzleString[(startRow + r) * 9 + startCol + c] === String(value)) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const findEmpty = str => {
      for (let i = 0; i < str.length; i++) {
        if (str[i] === '.') {
          return i;
        }
      }
      return null;
    }

    const solveHelper = str => {
      const emptyPos = findEmpty(str);
      if (emptyPos === null) {
        return str;
      }
      const row = Math.floor(emptyPos / 9);
      const col = emptyPos % 9;
      for (let num = 1; num <= 9; num++) {
        if (this.checkRowPlacement(str, row, col, num) && this.checkColPlacement(str, row, col, num) && this.checkRegionPlacement(str, row, col, num)) {
          const newStr = str.substring(0, emptyPos) + num + str.substring(emptyPos + 1);
          const result = solveHelper(newStr);
          if (result) {
            return result;
          }
        }
      }
      return null;
    }

    const result = solveHelper(puzzleString);
    if (result) {
      return result;
    } else {
      return 'Puzzle cannot be solved';
    }
  }
}

module.exports = SudokuSolver;
