const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')


router.get('/', controller.loadHome);

router.get('/contact', controller.loadContact);

router.get('/addMeal/:id', controller.addMeal);

router.get('/addIngredient/:id', controller.addIngredient);

router.get('/clearlist', controller.clearlist);

module.exports = router;