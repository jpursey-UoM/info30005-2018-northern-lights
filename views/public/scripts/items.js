function addToBasket(basket,item){
    basket.push(item);
}

function addMealfromlist(basket,item,id){
    document.getElementById(id).innerHTML="Added";
    document.getElementById(id).disabled = true;
    addToBasket(basket,item);
}

function addIngredientfromlist(basket,item,id){
    document.getElementById(id).innerHTML="Added";
    document.getElementById(id).disabled = true;
    addToBasket(basket,item);
}