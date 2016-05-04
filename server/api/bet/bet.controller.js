/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/bets              ->  index
 * POST    /api/bets              ->  create
 * GET     /api/bets/:id          ->  show
 * PUT     /api/bets/:id          ->  update
 * DELETE  /api/bets/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Bet from './bet.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    console.log(err);
    res.status(statusCode).send(err);
  };
}

// Gets a list of Bets
export function index(req, res) {
  return Bet.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Bet from the DB
export function show(req, res) {
  return Bet.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Bet in the DB
export function create(req, res) {
  return Bet.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Bet in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Bet.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Bet from the DB
export function destroy(req, res) {
  return Bet.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Gets a single Bet from the DB by its user
export function getByUser(req, res) {
  return Bet.findOne({'_user': req.params.user}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
