const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    suite('Functional Tests', () => {

        suite('POST /api/solve', () => {
            test('Solve a puzzle with valid puzzle string', done => {
                chai.request(server)
                    .post('/api/solve')
                    .send({ puzzle: '6.9..............4.8...........713..7..3.51.6....4.9.8.....6...45..87..3.97.3.5..' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        assert.property(res.body, 'solution');
                        done();
                    });
            });

            test('Solve a puzzle with missing puzzle string', done => {
                chai.request(server)
                    .post('/api/solve')
                    .send({})
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        assert.property(res.body, 'error');
                        assert.equal(res.body.error, 'Required field missing');
                        done();
                    });
            });

            test('Solve a puzzle with invalid characters', done => {
                chai.request(server)
                    .post('/api/solve')
                    .send({ puzzle: '6.9..............4.8...........713..7..3.51.6....4.9.8.....6...45..87..3.97.3.5a.' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        assert.property(res.body, 'error');
                        assert.equal(res.body.error, 'Invalid characters in puzzle');
                        done();
                    });
            });

            test('Solve a puzzle with incorrect length', done => {
                chai.request(server)
                    .post('/api/solve')
                    .send({ puzzle: '6.9..............4.8...........713..7..3.51.6....4.9.8.....6...45..87..3.97.3.5..5' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body, 'error');
                        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                        done();
                    });
            });

            test('Solve a puzzle that cannot be solved', done => {
                chai.request(server)
                    .post('/api/solve')
                    .send({ puzzle: '6.9..............4.8...........713..7..3.51.6....4.9.8.....6...45..87..3.97.35555' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        assert.property(res.body, 'error');
                        assert.equal(res.body.error, 'Puzzle cannot be solved');
                        done();
                    });
            });
        });

        suite('POST /api/check', () => {
            test('Check a puzzle placement with all fields', done => {
                chai.request(server)
                    .post('/api/check')
                    .send({ puzzle: '6.9..............4.8...........713..7..3.51.6....4.9.8.....6...45..87..3.97.3.5..', coordinate: 'A1', value: '6' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        assert.property(res.body, 'valid');
                        assert.isTrue(res.body.valid);
                        done();
                    });
            });

            test('Check a puzzle placement with single placement conflict', done => {
                chai.request(server)
                    .post('/api/check')
                    .send({ puzzle: '6.9..............4.8...........713..7..3.51.6....4.9.8.....6...45..87..3.97.3.5..', coordinate: 'A3', value: '6' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isFalse(res.body.valid);
                        assert.isArray(res.body.conflict);
                        assert.include(res.body.conflict, 'row');
                        done();
                    });
            });

            test('Check a puzzle placement with multiple placement conflicts', done => {
                chai.request(server)
                    .post('/api/check')
                    .send({ puzzle: '6.9..............4.8...........713..7..3.51.6....4.9.8.....6...45..87..3.97.3.5..', coordinate: 'A6', value: '6' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isFalse(res.body.valid);
                        assert.isArray(res.body.conflict);
                        assert.include(res.body.conflict, 'row');
                        assert.include(res.body.conflict, 'column');
                        done();
                    });
            });

            test('Check a puzzle placement with all placement conflicts', done => {
                chai.request(server)
                    .post('/api/check')
                    .send({ puzzle: '6.9..............4.8...........713..7..3.51.6....4.9.8.....6...45..87..3.97.3.5..', coordinate: 'E5', value: '7'})
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isFalse(res.body.valid);
                        assert.isArray(res.body.conflict);
                        assert.include(res.body.conflict, 'row');
                        assert.include(res.body.conflict, 'column');
                        assert.include(res.body.conflict, 'region');
                        done();
                    });
            });

            test('Check a puzzle placement with missing required fields', done => {
                chai.request(server)
                    .post('/api/check')
                    .send({ puzzle: '6.9..............4.8...........713..7..3.51.6....4.9.8.....6...45..87..3.97.3.5..' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        assert.property(res.body, 'error');
                        assert.equal(res.body.error, 'Required field(s) missing');
                        done();
                    });
            });

            test('Check a puzzle placement with invalid characters', done => {
                chai.request(server)
                    .post('/api/check')
                    .send({ puzzle: '6.9..............4.8...........713..7..3.51.6....4.9.8.....6...45..87..3.97.3.5.a', coordinate: 'A1', value: '6' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        assert.property(res.body, 'error');
                        assert.equal(res.body.error, 'Invalid characters in puzzle');
                        done();
                    });
            });

            test('Check a puzzle placement with incorrect length', done => {
                chai.request(server)
                    .post('/api/check')
                    .send({ puzzle: '6.9..............4.8...........713..7..3.51.6....4.9.8.....6...45..87..3.97.3.5.', coordinate: 'A1', value: '6' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        assert.property(res.body, 'error');
                        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                        done();
                    });
            });

            test('Check a puzzle with invalid placement coordinate', done => {
                chai.request(server)
                    .post('/api/check')
                    .send({ puzzle: '6.9..............4.8...........713..7..3.51.6....4.9.8.....6...45..87..3.97.3.5..', coordinate: 'A0', value: '6' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        assert.property(res.body, 'error');
                        assert.equal(res.body.error, 'Invalid coordinate');
                        done();
                    });
            });

            test('Check a puzzle placement with invalid placement value', done => {
                chai.request(server)
                    .post('/api/check')
                    .send({ puzzle: '6.9..............4.8...........713..7..3.51.6....4.9.8.....6...45..87..3.97.3.5..', coordinate: 'A1', value: '0' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        assert.property(res.body, 'error');
                        assert.equal(res.body.error, 'Invalid value');
                        done();
                    });
            });
        });
    });
});

