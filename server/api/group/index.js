'use strict';

var express = require('express');
var controller = require('./group.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/stage/:stage', controller.getFromStage);
router.get('/table/:name', controller.getTable);
router.get('/id/:id', controller.show);
router.post('/', controller.create);
router.post('/batch', controller.createBatch);
router.put('/id/:id', controller.update);
router.patch('/id/:id', controller.update);
router.delete('/id/:id', controller.destroy);

module.exports = router;
