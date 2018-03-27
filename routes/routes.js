const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')


router.get('/', controller.loadHome);

router.get('/contact', controller.loadContact);

module.exports = router;