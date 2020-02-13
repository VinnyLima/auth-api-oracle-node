const express = require('express');
const router = new express.Router();

var publicThings = require('../Controllers/publicThings');
var protectedThings = require('../Controllers/protectedThings.js');
var users = require('../Controllers/Users.js');
var logins = require('../Controllers/logins.js');
var UserUpdate = require('../Controllers/UsersAdd');

router.get('/public_things/:teste?', publicThings.get);
router.get('/protected_things', protectedThings.get);
router.post('/users', users.post);
router.post('/logins', logins.post);
router.post('/update', UserUpdate.post);
//app.use('/api', router);

module.exports = router; 