const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');


router.get('/', controller.loadSignup);
router.get('/login', controller.loadLogin);
router.get('/home', controller.loadHome);
router.get('/', controller.loadHome);
router.get('/plan', controller.loadPlan);
router.get('/list', controller.loadList);

router.get('/basket', controller.loadBasket);
router.get('/profile', controller.loadProfile);
router.get('/contact', controller.loadContact);

router.get('/meals', controller.loadMeals);
router.get('/meal', controller.SearchMeal);
router.get('/filtermeal',controller.FilterMeal);

router.get('/ingredients', controller.loadIngredients);
router.get('/ingredient', controller.SearchIngredient);
router.get('/filteringredient',controller.FilterIngredient);

router.get('/addMeal/:id', controller.addMeal);
router.get('/addIngredient/:id', controller.addIngredient);
router.post('/addItemFromList', controller.addItemFromList);

router.delete('/clearlist', controller.clearlist);

<<<<<<< HEAD
router.get('/api', controller.getItem);
router.get('/api/:id', controller.getOneItem);
router.post('/api', controller.addItem);
=======
router.get('/checkuser', controller.checkUser);
router.post('/adduser', controller.addUser);
router.post('/userlogin', controller.userLogin);
router.get('/thing', controller.thing);
>>>>>>> a2ff1f973e821bba6b70a068b2e4eeb77b0c3ab1

module.exports = router;