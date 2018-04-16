const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')


router.get('/', controller.loadHome);
router.get('/plan', controller.loadPlan);

router.get('/contact', controller.loadContact);

router.get('/meals', controller.loadMeals);

router.get('/ingredients', controller.loadIngredients);

router.get('/addMeal/:id', controller.addMeal);

router.get('/addIngredient/:id', controller.addIngredient);

router.get('/clearlist', controller.clearlist);

module.exports = router;