const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')


router.get('/', controller.loadHome);

router.get('/users', controller.loadUserList);

router.get('/user/:id', controller.loadProfile);

module.exports = router;