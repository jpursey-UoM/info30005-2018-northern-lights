function showNewMeal(){
    document.getElementById("new-meal-form").style.display = "block";
    console.log("Showing new meal form");
}

function hideNewMeal(){
    document.getElementById("new-meal-form").style.display = "none";
    document.getElementById("new-meal-form").reset();
}