var mongoose = require('mongoose');
var ingredientSchema = mongoose.Schema(
    {
        "name":String,
        "image":String,
        "type":String
}
);
var mealSchema = mongoose.Schema(
    {
        "name":String,
        "components":[ingredientSchema],
        "image":String,
        "type":String
    }
);
mongoose.model('ingredients',ingredientSchema);
mongoose.model('meals',mealSchema);