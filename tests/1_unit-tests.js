const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {

  suite('Validation tests', () => {

    test('Logic handles a valid puzzle string of 81 characters', () => {
      const puzzleString = '1.....2...............498.6...8.....714.9.38...371.64..9..7..1...84.....2...63...';
      const result = solver.validate(puzzleString);
      assert.equal(result.valid, true);
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
      const puzzleString = '1.....2...............498.6...8.....714.9.38...371.64..9..7..1...84.....2...63..a';
      const result = solver.validate(puzzleString);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Invalid characters in puzzle');
    });

    test('Logic handles a puzzle string that is not 81 characters in length', () => {
      const puzzleString = '1.5..2.84..63.12.7.2..5..9.....1....8.2.3674.3..8..1.1.2..3.6.4....7....5....5....6.';
      const result = solver.validate(puzzleString);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Expected puzzle to be 81 characters long');
    });
  });

  suite('Placement tests', () => {
    
    const puzzleString = '1.....2...............498.6...8.....714.9.38...371.64..9..7..1...84.....2...63...';

    test('Logic handles a valid row placement', () => {
      const row = 0;
      const col = 1;
      const value = 3;
      assert.isTrue(solver.checkRowPlacement(puzzleString, row, col, value));
    });

    test('Logic handles an invalid row placement', () => {
      const row = 0;
      const col = 1;
      const value = 1;
      assert.isFalse(solver.checkRowPlacement(puzzleString, row, col, value));
    });

    test('Logic handles a valid column placement', () => {
      const row = 0;
      const col = 1;
      const value = 3;
      assert.isTrue(solver.checkColPlacement(puzzleString, row, col, value));
    });

    test('Logic handles an invalid column placement', () => {
      const row = 0;
      const col = 1;
      const value = 1;
      assert.isFalse(solver.checkColPlacement(puzzleString, row, col, value));
    });

    test('Logic handles a valid region (3x3 grid) placement', () => {
      const row = 0;
      const col = 1;
      const value = 3;
      assert.isTrue(solver.checkRegionPlacement(puzzleString, row, col, value));
    });

    test('Logic handles an invalid region (3x3 grid) placement', () => {
      const row = 0;
      const col = 1;
      const value = 1;
      assert.isFalse(solver.checkRegionPlacement(puzzleString, row, col, value));
    });
  });

  suite('Solver tests', () => {
    
    test('Valid puzzle strings pass the solver', () => {
      const puzzleString = '4......8.7.8.......9....57......3....4.9.86..6...7.823..4...9...5.3....68....6...';
      const result = solver.solve(puzzleString);
      assert.isString(result);
      assert.notEqual(result, 'Puzzle cannot be solved');
    });

    test('Invalid puzzle strings fail the solver', () => {
      const puzzleString = '47......412.8.......9....57......3....4.9.86..6...7.883..4...9...5.3....68....6...';
      const result = solver.solve(puzzleString);
      assert.equal(result, 'Puzzle cannot be solved');
    });

    test('Solver returns the expected solution for an incomplete puzzle', () => {
      const puzzleString = '4......8.7.8.......9....57......3....4.9.86..6...7.823..4...9...5.3....68....6...';
      const expectedSolution = '435769182728145369196832574587623491243918657619574823364257918952381746871496235';
      const result = solver.solve(puzzleString);
      assert.equal(result, expectedSolution);
    });
  });

});
