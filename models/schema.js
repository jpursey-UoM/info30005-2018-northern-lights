var mongoose = require('mongoose');
var ingredientSchema = mongoose.Schema(
    {
        "id":String,
        "name":String,
        "image":String,
        "type":String,
        "shelfLife":Number
}
);
var mealSchema = mongoose.Schema(
    {
        "id":String,
        "name":String,
        "components":[{"component":ingredientSchema,
                        "quantity":Number}],
        "image":String,
        "type":String,
        "description":String
    }
);
var ownedIngredientSchema = mongoose.Schema(
    {
        "ingredient": ingredientSchema,
        "quantity": Number,
        "expiryDate": Date,
        "meal":mealSchema,
        "planDate":Date
    }
);
var userSchema = mongoose.Schema(
    {
        "email":String,
        "password":String,
        "username":String,
        "basket":[ownedIngredientSchema],
        "shoppinglist":[ownedIngredientSchema]
    }
);
mongoose.model('ingredients',ingredientSchema);
mongoose.model('ownedIngredient',ownedIngredientSchema);
mongoose.model('meals',mealSchema);
mongoose.model('user',userSchema);