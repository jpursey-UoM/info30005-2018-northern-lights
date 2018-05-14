var mealsWithDates = [];

/// NOT WORKING YET
// 1. Update ingredient plandates properly
// 2. allow meals to be removed from plan

function updateBasketDb(){
  // update the basket in the db
    const ingredients = [];
    for (var i=0; i<mealsWithDates.length; i++){
        for (var j=0; j<mealsWithDates[i].meal.components.length; j++){
            ingredients.push(mealsWithDates[i].meal.components[j]);
            console.log(mealsWithDates[i].meal.components[j]);
        }
    }
    console.log("making request to update basket");
    $.ajax({
        url: "/updateBasket",
        type: "POST",
        data: {"basket":ingredients}
    }).done = function () {
    };
}

function loadPlan(){
    // get basket from server
    $.ajax({
        url: "/getBasket",
        type: "GET"
    }).done(function(basket) {
        if (!basket) {
        }else{
            mealsWithDates = getMeals(basket);
            // loop over meals:
            for (var i=0; i < mealsWithDates.length; i++) {
                var meal = mealsWithDates[i];
                console.log(meal);
                if (meal.planDate) {
                    //  if have plan date -> put on right day
                    add2Plan(meal, i);
                }else {
                    //  else -> put in meals list
                    add2MealsList(meal, i);
                }
            }
        }
    });


}

function add2Plan(meal, i){
    const planDate = meal.planDate;
    const planDay = findPlanDay(planDate);
    if (planDay) {
        const div = createMealDiv(meal, i);
        planDay.appendChild(div);
    }
}

function add2MealsList(meal, i) {
    const mealsList = document.getElementById("meals-list");
    const li = document.createElement("li");
    const div = createMealDiv(meal, i);
    li.appendChild(div);
    mealsList.appendChild(li);
}

function findPlanDay(date){
    // return the plan-day div that matches date
    const days = document.getElementsByClassName("plan-day");
    for (var i=0; i<days.length; i++){
        var dateStr = days[i].getElementsByTagName("h3")[0].innerhtml.split(" ")[1];
        var possibleDate = makeDate(dateStr);
        if (possibleDate == date){
            return days[i];
        }
    }
    return null;
}
function createMealDiv(meal, i){
    const options = {weekday:'', year:'numeric', month:'numeric', day:'numeric'};

    const div = document.createElement("div");
    div.classList.add("img_wrap");
    div.draggable = true;
    div.ondragstart = drag;
    div.onclick = "add2plan(" + meal.meal.id +")"; // this might not work
    div.id = i;

    const img = document.createElement('img');
    img.src = meal.meal.image;
    img.width = 200;
    img.alt = meal.meal.name;
    img.title = "Add " + meal.meal.name + " to my plan";
    img.draggable = false;
    div.appendChild(img);

    const p = document.createElement("p");
    p.innerHTML = meal.meal.name;
    const dateSpan = document.createElement("span");
    dateSpan.classList.add("exp-date");
    const date = new Date(meal.expDate);
    dateSpan.innerHTML = " ("+ date.toLocaleDateString("en-AU") +")";
    p.appendChild(dateSpan);
    div.appendChild(p);
    return div;
}


function getMeals(basket){
    var mealsWithDates = [];
    var prevMealName;
    var ingredientsFound;
    var needed;
    var candidateMeal;
    var earliestExpiry;
    for (var i = 0; i < basket.length; i++){
        var ingredient = basket[i];
        if(ingredient.meal) {
            console.log(ingredient);
            if (prevMealName == null || ingredient.meal.name != prevMealName){
                prevMealName = ingredient.meal.name;
                candidateMeal = ingredient.meal;
                needed = candidateMeal.components.length;
                ingredientsFound = 1;
                earliestExpiry = ingredient.expiryDate;
            }else{
                ingredientsFound ++;
                if (ingredient.expiryDate < earliestExpiry){
                    earliestExpiry = ingredient.expiryDate;
                }
                if (ingredientsFound == needed){
                    if (ingredient.planDate){
                        mealsWithDates.push({"meal":candidateMeal,
                            "expDate":earliestExpiry,
                            "planDate":ingredient.planDate});
                    }else{
                        mealsWithDates.push({"meal":candidateMeal,
                            "expDate":earliestExpiry});
                    }
                }
            }
        }
    }
    return mealsWithDates;
}

function makeDate(dateStr) {
    // make date objects from strings in aus format
    // (dodgy, I know)
    // eg "10/5/2018"
    console.log(typeof(dateStr));
    const parts = dateStr.split("/");
    const date = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
    return date;
}

function makeMealDate(item){
    const dateStr = item.getElementsByClassName("exp-date")[0].innerHTML;
    return makeDate(dateStr);

};



function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("mealIndex", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var index = event.dataTransfer.getData("mealIndex");

    // get the new plan date
    const planDateStr = event.target.getElementsByTagName("h3")[0].innerHTML;
    const newPlanDate = makeDate(planDateStr.split(" ")[1]);

    // add the new plan date to each ingredient
    addPlanDate(mealsWithDates[index], newPlanDate);

    // NEED TO CHECK IF EXPIRY DATE NEEDS A WARNING
    console.log(mealsWithDates);
    event.target.appendChild(document.getElementById(index));
}

function addPlanDate(mealWithDates, date){
    mealWithDates.planDate = date;
    for (var i=0; i<mealWithDates.meal.components.length; i++){
        mealWithDates.meal.components[i].planDate = date;
    }
}