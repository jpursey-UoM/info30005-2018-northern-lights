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
        "meal":mealSchema
    }
);
var planSchema = mongoose.Schema(
    {
        "date":Date,
        "components":[ownedIngredientSchema]
    }
);
var userSchema = mongoose.Schema(
    {
        "email":String,
        "password":String,
        "username":String,
        "plan":[planSchema],
        "basket":[ownedIngredientSchema],
        "shoppinglist":[ownedIngredientSchema]
    }
);
mongoose.model('ingredients',ingredientSchema);
mongoose.model('ownedIngredient',ownedIngredientSchema);
mongoose.model('meals',mealSchema);
mongoose.model('plan',planSchema);
mongoose.model('user',userSchema);