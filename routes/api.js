'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const SudokuSolver = require('../controllers/sudoku-solver.js');

const app = express();
app.use(bodyParser.json());

const solver = new SudokuSolver();

module.exports = function (app) {

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value ) {
        return res.json({ error: 'Required field(s) missing' });
      }

      const validation = solver.validate(puzzle);
      if (!validation.valid) {
        return res.json({ error: validation.error });
      }

      const match = coordinate.match(/^([A-I])([1-9])$/);
      if (!match) {
        res.json({ error: 'Invalid coordinate' });
      }

      const row = coordinate[0].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
      const col = parseInt(coordinate[1]) - 1;

      if (isNaN(row) || isNaN(col) || row < 0 || row > 8 || col < 0 || col > 8) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (isNaN(value) || value < 1 || value > 9) {
        return res.json({ error: 'Invalid value' });
      }

      if (puzzle[row * 9 + col] === value) {
        return res.json({ valid: true });
      }

      const rowValid = solver.checkRowPlacement(puzzle, row, col, value);
      const colValid = solver.checkColPlacement(puzzle, row, col, value);
      const regionValid = solver.checkRegionPlacement(puzzle, row, col, value);

      const conflicts = [];
      if (!rowValid) conflicts.push('row');
      if (!colValid) conflicts.push('column');
      if (!regionValid) conflicts.push('region');

      res.json({
        valid: rowValid && colValid && regionValid,
        conflict: conflicts
      });
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validation = solver.validate(puzzle);
      if (!validation.valid) {
        return res.json({ error: validation.error });
      }

      const solution = solver.solve(puzzle);
      if (solution === 'Puzzle cannot be solved') {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      res.json({ solution });
    });
};
