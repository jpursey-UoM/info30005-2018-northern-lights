const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')


router.get('/', controller.loadHome);

router.get('/items', controller.loadItemList);

router.get('/item/:id', controller.loadItem);

module.exports = router;