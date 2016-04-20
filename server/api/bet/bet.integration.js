'use strict';

var app = require('../..');
import request from 'supertest';

var newBet;

describe('Bet API:', function() {

  describe('GET /api/bets', function() {
    var bets;

    beforeEach(function(done) {
      request(app)
        .get('/api/bets')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          bets = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      bets.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/bets', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/bets')
        .send({
          name: 'New Bet',
          info: 'This is the brand new bet!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBet = res.body;
          done();
        });
    });

    it('should respond with the newly created bet', function() {
      newBet.name.should.equal('New Bet');
      newBet.info.should.equal('This is the brand new bet!!!');
    });

  });

  describe('GET /api/bets/:id', function() {
    var bet;

    beforeEach(function(done) {
      request(app)
        .get('/api/bets/' + newBet._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          bet = res.body;
          done();
        });
    });

    afterEach(function() {
      bet = {};
    });

    it('should respond with the requested bet', function() {
      bet.name.should.equal('New Bet');
      bet.info.should.equal('This is the brand new bet!!!');
    });

  });

  describe('PUT /api/bets/:id', function() {
    var updatedBet;

    beforeEach(function(done) {
      request(app)
        .put('/api/bets/' + newBet._id)
        .send({
          name: 'Updated Bet',
          info: 'This is the updated bet!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBet = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBet = {};
    });

    it('should respond with the updated bet', function() {
      updatedBet.name.should.equal('Updated Bet');
      updatedBet.info.should.equal('This is the updated bet!!!');
    });

  });

  describe('DELETE /api/bets/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/bets/' + newBet._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when bet does not exist', function(done) {
      request(app)
        .delete('/api/bets/' + newBet._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
