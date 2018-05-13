const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');


router.get('/', controller.loadSignup);
router.get('/login', controller.loadLogin);
router.get('/home', controller.loadHome);
router.get('/', controller.loadHome);
router.get('/plan', controller.loadPlan);
router.get('/list', controller.loadList);
router.post('/finishShopping', controller.finishShopping);

router.get('/basket', controller.loadBasket);
router.get('/getBasket', controller.getBasket);
router.post('/addToBasket', controller.addToBasket);
router.post('/updateExpiry', controller.updateExpiry);
router.delete('/deleteFromBasket/:id', controller.deleteFromBasket);

router.get('/profile', controller.loadProfile);
router.get('/contact', controller.loadContact);

router.get('/meals', controller.loadMeals);
router.get('/meal', controller.SearchMeal);
router.get('/filtermeal',controller.FilterMeal);

router.get('/ingredients', controller.loadIngredients);
router.get('/ingredient', controller.SearchIngredient);
router.get('/filteringredient',controller.FilterIngredient);
router.get('/lookupIngredient', controller.getIngredientById);

router.post('/addItemFromList', controller.addItemFromList);
router.post('/deleteItem', controller.deleteItem);

router.delete('/clearlist', controller.clearlist);

router.get('/checkuser', controller.checkUser);
router.post('/adduser', controller.addUser);
router.post('/userlogin', controller.userLogin);
router.get('/logout', controller.logout);

router.post('/createMeal', controller.createMeal);

module.exports = router;