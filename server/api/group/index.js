'use strict';

import {Router} from 'express';
import * as controller from './group.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', controller.index);
router.get('/match/:id', controller.getMatch);
router.get('/stage/:stage', controller.getFromStage);
router.get('/table/:name', controller.getTable);
router.get('/id/:id', controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.post('/batch', auth.hasRole('admin'), controller.createBatch);
router.put('/id/:id', auth.hasRole('admin'), controller.update);
router.patch('/id/:id', auth.hasRole('admin'), controller.update);
router.delete('/id/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
