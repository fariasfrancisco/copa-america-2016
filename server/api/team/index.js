'use strict';

import {Router} from 'express';
import * as controller from './team.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.post('/batch', auth.hasRole('admin'), controller.createBatch);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
