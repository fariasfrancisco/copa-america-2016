'use strict';

import {Router} from 'express';
import * as controller from './bet.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', controller.index);
router.get('/id/:id', controller.show);
router.get('/user/:user', controller.getByUser);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
