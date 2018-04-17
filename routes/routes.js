const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');


router.get('/', controller.loadSignup);
router.get('/login', controller.loadLogin);
router.get('/home', controller.loadHome);
router.get('/plan', controller.loadPlan);
router.get('/list', controller.loadList);

router.get('/basket', controller.loadBasket);
router.get('/profile', controller.loadProfile);

router.get('/contact', controller.loadContact);

router.get('/meals', controller.loadMeals);

router.get('/ingredients', controller.loadIngredients);

router.get('/addMeal/:id', controller.addMeal);

router.get('/addIngredient/:id', controller.addIngredient);

router.get('/clearlist', controller.clearlist);



module.exports = router;