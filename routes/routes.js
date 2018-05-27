const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const userController = require('../controllers/userController');
const foodController = require('../controllers/foodController');
// loading pages using main controller
router.get('/signup', controller.loadSignup);
router.get('/login', controller.loadLogin);
router.get('/home', controller.loadHome);
router.get('/', controller.loadHome);
router.get('/plan', controller.loadPlan);
router.get('/list', controller.loadList);
router.get('/basket', controller.loadBasket);
router.get('/contact', controller.loadContact);
router.get('/ingredients', controller.loadIngredients);
router.get('/meals', controller.loadMeals);


// routes related to users
router.get('/checkuser', userController.checkUser);
router.post('/adduser', userController.addUser);
router.post('/userlogin', userController.userLogin);
router.get('/logout', userController.logout);
router.post('/signup', userController.addUser);

// routes dealing with manipulating meals, ingredients and collections of

router.post('/finishShopping', foodController.finishShopping);

router.get('/getBasket', foodController.getBasket);
router.post('/addToBasket', foodController.addToBasket);
router.post('/updateExpiry', foodController.updateExpiry);
router.delete('/deleteFromBasket/:id', foodController.deleteFromBasket);
router.post('/updateBasket', foodController.updateBasket);

router.get('/meal', foodController.SearchMeal);
router.get('/filtermeal',foodController.FilterMeal);

router.get('/ingredient', foodController.SearchIngredient);
router.get('/filteringredient',foodController.FilterIngredient);
router.get('/lookupIngredient', foodController.getIngredientById);

router.post('/addItemFromList', foodController.addItemFromList);
router.post('/deleteItem', foodController.deleteItem);
router.get('/updateBasket', foodController.updateBasket);


router.delete('/clearlist', foodController.clearlist);


router.post('/createMeal', foodController.createMeal);
router.post('/createIngredient', foodController.createIngredient);

module.exports = router;