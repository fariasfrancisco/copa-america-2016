/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/teams              ->  index
 * POST    /api/teams              ->  create
 * GET     /api/teams/:id          ->  show
 * PUT     /api/teams/:id          ->  update
 * DELETE  /api/teams/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Team from './team.model';

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
    res.status(statusCode).send(err);
  };
}

// Gets a list of Teams
export function index(req, res) {
  return Team.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Team from the DB
export function show(req, res) {
  return Team.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Team in the DB
export function create(req, res) {
  return Team.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Creates new Teams in the DB
export function createBatch(req, res) {
  var teamsArray = req.body;
  teamsArray.forEach(function (current) {
    Team.create(current)
      .then(respondWithResult(res, 201))
      .catch(handleError(res));
  });
}

// Updates an existing Team in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Team.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Team from the DB
export function destroy(req, res) {
  return Team.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
