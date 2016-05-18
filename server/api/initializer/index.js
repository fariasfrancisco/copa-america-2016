'use strict';

import {Router} from 'express';
import * as controller from './controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.initialize);

module.exports = router;
