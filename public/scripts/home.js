var newMeal = null;
var newComponent;

function showNewMeal(){
    document.getElementById("new-meal-form").style.display = "block";
    newMeal = {"components":[]};
}

function hideNewMeal(){
    document.getElementById("new-meal-form").style.display = "none";
    document.getElementById("new-meal-form").reset();
    newMeal = null;
}

function showAddComponent(){
    document.getElementById("add-component-form").style.display="block";
    document.getElementById("ingredient-name-input").removeAttribute("readonly");
    document.getElementById("ingredient-name-input").setAttribute("placeholder", "Start typing...");

    // add ingredients until something gets typed
    const div = document.getElementById("add-ingredient-dropdown");
    const elems = div.getElementsByClassName("dropdown-item");
    for (i = 0; i < elems.length; i++) {
        elems[i].style.display = "none";
    }
}

function cancelAddComponent(){
    document.getElementById("add-component-form").style.display="none";
    document.getElementById("add-component-form").reset();
}

function filterIngredients() {
    var input, filter, ul, li, elems, div, i;
    input = document.getElementById("ingredient-name-input");
    filter = input.value.toLowerCase();
    div = document.getElementById("add-ingredient-dropdown");
    elems = div.getElementsByClassName("dropdown-item");
    for (i = 0; i < elems.length; i++) {
        if (elems[i].innerHTML.toLowerCase().indexOf(filter) > -1) {
            elems[i].style.display = "";
        } else {
            elems[i].style.display = "none";
        }
    }
}

function selectComponent(id){
    $.ajax({
        url: "/lookupIngredient",
        type: "GET",
        data: {
            "id":id
        }

    }).done(function(data) {
        if (!data) {
        }else{
            newComponent = data;
            setComponentName(data.name);
        }
    });
}

function setComponentName(name){
    document.getElementById("ingredient-name-input").value = name;
    document.getElementById("ingredient-name-input").setAttribute("readonly","readonly");

    // stop showing the dropdown
    var elems, div, i;
    div = document.getElementById("add-ingredient-dropdown");
    elems = div.getElementsByClassName("dropdown-item");
    for (i = 0; i < elems.length; i++) {
        elems[i].style.display = "none";
    }
}
function addComponent(){
    const qty = document.getElementById("add-component-qty").value;
    newMeal.components.push({"component": newComponent,
                                "quantity": qty});
    // update the list view
    const list = document.getElementById("components-list");
    var li = document.createElement("li");
    var qtySpan = document.createElement("span");
    qtySpan.classList.add("comp-qty");
    qtySpan.innerHTML = qty;
    var nameSpan = document.createElement("span");
    nameSpan.classList.add("comp-name");
    nameSpan.innerHTML = newComponent.name;
    li.appendChild(qtySpan);
    li.appendChild(nameSpan);
    list.appendChild(li);
    cancelAddComponent();
}

function createMeal(){
    // get values from form
    const name = document.getElementById("meal-name").value;
    const imageURL = document.getElementById("meal-url").value;
    const type = document.getElementById("meal-type").value;
    const description = document.getElementById("description").value;

    // components are already added as they are picked

    newMeal.name = name;
    newMeal.image = imageURL;
    newMeal.type = type;
    newMeal.description = description;

    // add to db
    $.ajax({
        url: "/createMeal",
        type: "POST",
        data: newMeal

    }).done(function(data) {
        if (!data) {
        }else{
            alert(data.name + " successfully added to db");
            console.log(data);
            hideNewMeal();
        }
    });
}

function showNewIngredient(){
    console.log("showing new ingredient form");
    document.getElementById("add-ingredient-form").style.display = "block";
}

function hideNewIngredient(){

    document.getElementById("add-ingredient-form").style.display = "none";
    document.getElementById("add-ingredient-form").reset();
}
function createIngredient(){
    // get values from form
    const name = document.getElementById("new-ingredient-name").value;
    const imageURL = document.getElementById("new-ingredient-image").value;
    const type = document.getElementById("new-ingredient-type").value;
    const shelfLife = document.getElementById("new-ingredient-shelf-life").value;
    // make object

    const ingredient = {
        "name":name,
        "image":imageURL,
        "type":type,
        "shelflife": shelfLife}

    // send to db
    $.ajax({
        url: "/createIngredient",
        type: "POST",
        data: ingredient

    }).done(function(data) {
        if (!data) {
        }else{
            alert(data.name + " successfully added to db");
            console.log(data);
            hideNewIngredient();
        }
    });
}