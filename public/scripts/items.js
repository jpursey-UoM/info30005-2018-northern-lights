function openRightMenu() {
    document.getElementById("rightMenu").style.display = "block";
}
function closeRightMenu() {
    document.getElementById("rightMenu").style.display = "none";
}
function updateBasket(){
    $.ajax({
        url: '/updateBasket',
        type: 'GET',
        success: function(result) {
            console.log(result.length)
            var items="";
            for (var i=0;i<result.length; i++){
                items+="<li>"
                items+="<img onclick=\"DeleteItem("+ JSON.stringify(result[i].ingredient)+")\" class=\"remove\" src=\"public/images/icons24/clear-button.png\" width=\"24\" height=\"24\">"
                items+="<div>"+ result[i].ingredient.name+ "</div>"
                items+="</li>";
            }
            $('.list').html(items);
        }
    });
}

function addToBasket(item){
    if (item.components) {
        var selected = [];
        $('.'+item._id+' :checked').each(function () {
            selected.push($(this).val());
        });
        $.post("/addItemFromList",
            {
                item: item,
                selected:selected
            },
            function (result) {
                $('.'+item._id).css({'display' : 'none'});
            });
    }else {
        $.post("/addItemFromList",
            {
                item: item
            },
            function (result) {
            });
    }
}

function addfromHome(item) {
    if (item.components) {
        var selected = [];
        $('.'+item._id+' :checked').each(function () {
            selected.push($(this).val());
        });
        $.post("/addItemFromList",
            {
                item: item,
                selected:selected
            },
            function (result) {
                window.location.reload();
            });
    }else {
        $.post("/addItemFromList",
            {
                item: item
            },
            function (result) {
                window.location.reload();
            });
    }
}

function clearList(){
    $.ajax({
        url: '/clearlist',
        type: 'DELETE',
        success: function(result) {
            window.location.reload();
        }
    });
}


function DeleteItem(item){
    $.post("/deleteItem",
        {
            id: item._id
        },
        function(result){
            var items="";
            for (var i=0;i<result.length; i++){
                items+="<li>"
                items+="<img onclick=\'DeleteItem(" + JSON.stringify(result[i].ingredient) + ")\' class=\"remove\" src=\"public/images/icons24/clear-button.png\" width=\"24\" height=\"24\">"
                items+="<div>"+ result[i].ingredient.name+ "</div>"
                items+="</li>";
            }
            $('.list').html(items);
        });
}

function showModel(item){
    $('.'+item._id).css({'display' : 'block'});
}

function closeModel(item){
    $('.'+item._id).css({'display' : 'none'});
}

function DisplayIngredient(id){
    var html="<img onclick=\'CollapseIngredient(" +id+ ")\' id=\""+ id+ "\" class=\"fold\""+"src=\"public/images/icons24/up-chevron.png\" width=\"24\" height=\"24\"></li>";
    $("."+id).removeClass("collapse");
    $("#"+id).replaceWith(html);
}

function CollapseIngredient(id){
    var html="<img onclick=\'DisplayIngredient(" +id+ ")\' id=\""+ id+ "\" class=\"expand\""+"src=\"public/images/icons24/expand-button.png\" width=\"24\" height=\"24\"></li>";
    $("."+id).addClass("collapse");
    $("#"+id).replaceWith(html);
}

function groupByMeal(checkbox,basket){
    var items="";
    var meals={};
    if(checkbox.checked == true) {
        for (var i = 0; i < basket.length; i++) {
            var ingredientName = basket[i].ingredient.name;
            //individual ingredient
            if (!basket[i].meal) {
                //console.log(ingredientName)
                if (!("ingredients" in meals)) {
                    meals.ingredients = {};
                    if (!(ingredientName in meals.ingredients)) {
                        meals.ingredients[ingredientName] = {};
                        meals.ingredients[ingredientName].object = basket[i].ingredient;
                        meals.ingredients[ingredientName].quantity = 1;
                        meals.ingredients[ingredientName].name = basket[i].ingredient.name;
                    } else {
                        meals.ingredients[ingredientName].quantity = meals.ingredients[ingredientName].quantity + 1;
                    }
                } else {
                    if (!(ingredientName in meals.ingredients)) {
                        meals.ingredients[ingredientName] = {};
                        meals.ingredients[ingredientName].object = basket[i].ingredient;
                        meals.ingredients[ingredientName].quantity = 1;
                        meals.ingredients[ingredientName].name = basket[i].ingredient.name;
                    } else {
                        meals.ingredients[ingredientName].quantity = meals.ingredients[ingredientName].quantity + 1;
                    }
                }
                //ingredient compose meal
            } else {
                var mealID = basket[i].meal.id;
                if (!(mealID in meals)) {
                    meals[mealID] = {};
                    meals[mealID].mealName = basket[i].meal.name;
                    if (!(ingredientName in meals[mealID])) {
                        meals[mealID][ingredientName] = {};
                        meals[mealID][ingredientName].object = basket[i].ingredient;
                        meals[mealID][ingredientName].quantity = 1;
                        meals[mealID][ingredientName].name = basket[i].ingredient.name;
                    } else {
                        meals[mealID][ingredientName].quantity = meals[mealID][ingredientName].quantity + 1;
                    }
                } else {
                    if (!(ingredientName in meals[mealID])) {
                        meals[mealID][ingredientName] = {};
                        meals[mealID][ingredientName].object = basket[i].ingredient;
                        meals[mealID][ingredientName].quantity = 1;
                        meals[mealID][ingredientName].name = basket[i].ingredient.name;
                    } else {
                        meals[mealID][ingredientName].quantity = meals[mealID][ingredientName].quantity + 1;
                    }
                }
            }
        }
        for (var key in meals) {
            //display meal
            if (key != "ingredients") {
                items += "<li><span class=\"meal\">" + meals[key].mealName + "</span>";
                items += "<img onclick=\'DisplayIngredient(" + key + ")\' id=\"" + key + "\" class=\"expand\"" + "src=\"public/images/icons24/expand-button.png\" width=\"24\" height=\"24\"></li>";
                for (var mealkey in meals[key]) {
                    if (mealkey != "mealName") {
                        for (var i = 0; i < meals[key][mealkey].quantity; i++) {
                            items += "<li class='collapse " + key + "'><img onclick=\'DeleteItem(" + JSON.stringify(meals[key][mealkey].object) + ")\' class=\"remove\" src=\"public/images/icons24/clear-button.png\" width=\"24\" height=\"24\">";
                            items += "<div class=\"shopping_list_item\">" + meals[key][mealkey].name + "</div></li>";
                        }
                    }
                }
                //display ingredient
            } else {
                for (var ingrekey in meals[key]) {
                    console.log(ingrekey)
                    items += "<li class='" + key + "'><img onclick=\'DeleteItem(" + JSON.stringify(meals[key][ingrekey].object) + ")\' class=\"remove\" src=\"public/images/icons24/clear-button.png\" width=\"24\" height=\"24\">";
                    items += "<div class=\"shopping_list_item\">" + ingrekey + "</div></li>";
                }
            }

        }
        }else{
            for(var i=0;i<basket.length; i++) {
                items += "<li><img onclick=\'DeleteItem(" + JSON.stringify(basket[i].ingredient) + ")\' class=\"remove\" src=\"public/images/icons24/clear-button.png\" width=\"24\" height=\"24\">";
                items += "<div class=\"shopping_list_item\">" + basket[i].ingredient.name + "</div></li>";
            }
        }
        $('.list').html(items);
}

function addItemfromlist(item){
    document.getElementById(item.id).innerHTML="Added";
    document.getElementById(item.id).disabled = true;
    addToBasket(item);
    updateBasket();
}

function getNextPage(itemList,place){
    $("#pre").removeClass("disable_a_href");
    $("#next").removeClass("disable_a_href");
    var ItemOnOnePage = 12;
    var items="";
    var nextPage =parseInt($("#next").attr("class"));
    var max = (nextPage+1)*ItemOnOnePage;
    if(max > itemList.length){
        max = itemList.length
    }
    if(place == 'previous'){
        nextPage = parseInt($("#pre").attr("class")) - 1;
        max=(nextPage+1)*ItemOnOnePage;
    }
    if(itemList[0].components) {
        for (var i = nextPage * ItemOnOnePage; i < max; i++) {
            items += "<div class=\"item\"><p><img width='250' src='" + itemList[i].image + "'>" +
            "<br>" + itemList[i].name +
            "</p><button type=\"button\" id=\"" + itemList[i].id +
            "\" onclick=\'showModel(" + JSON.stringify(itemList[i]) + ")\'" +
            ">Add to basket</button>" +
            "<div class=\"modal " + itemList[i]._id + "\">" +
            "<div class=\"modal-content\">" +
            "<div class=\"modal-header\">" +
            "<span onclick=\"closeModel(" + JSON.stringify(itemList[i]) + ")\" class=\"close\">&times;</span>" +
            "<h2>" + itemList[i].name + "</h2>" +
            "</div>" +
            "<div class=\"modal-body\">"
        for (var j = 0; j < itemList[j].components.length; j++) {
            items += "<div class=\"" + itemList[i]._id + "\" >" +
                "<input value=\"" + itemList[i].components[j].component.id + "\" type=\"checkbox\" checked>" +
                itemList[i].components[j].component.name + "</div>";
        }
        items += "<button onclick=\'addItemfromlist(" + JSON.stringify(itemList[i]) + ")\'" + ">Add to basket</button>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
    }
    }else{
        for (var i = nextPage * ItemOnOnePage; i < max; i++) {

            items += "<div class=\"item\"><p><img width='250' src='" + itemList[i].image + "'>" +
                "<br>" + itemList[i].name +
                "</p><button type=\"button\" id=\"" + itemList[i].id +
                "\" onclick=\'addItemfromlist(" + JSON.stringify(itemList[i]) + ")\'" +
                ">Add to basket</button>" +
                "</a></div>";
        }
    }
    $('.items').html(items);
    var preClass=parseInt($("#pre").attr("class"));
    var nextClass=parseInt($("#next").attr("class"));
    if(place == 'next'){
        $('#pre').attr('class', preClass+1);
        $('#next').attr('class', nextClass+1);
        if(nextClass+1 == Math.ceil(itemList.length/12)){
            $('#next').addClass("disable_a_href");
        }
    }else if(place == 'previous'){
        $('#pre').attr('class', preClass-1);
        $('#next').attr('class', nextClass-1);
        if(preClass == 1){
            $('#pre').addClass("disable_a_href");
        }
    }
}

//search ingredient
$(function(){
    $(".ingredient").submit(function(e){
        filterText = $('.search').val();
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: "/ingredient",
            data: {search: filterText},
            success: function(result){
                formatResult(result,"ingredient")
            }

        });

    });
});

//search meal
$(function(){
    $(".meal").submit(function(e){
        filterText = $('.search').val();
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: "/meal",
            data: {search: filterText},
            success: function(result){
                formatResult(result,"meal")
            }

        });

    });
});

//filter ingredient
$(function(){
    $(".category_ingredient").click(function() {
        var category = [];
        $('.all').prop('checked', false);
        $(".all").attr("disabled", true);
        $('.checkbox :checked').each(function () {
            category.push($(this).val());
        });
        $.ajax({
            type: "GET",
            url: "/filteringredient",
            data: {category:category},
            success: function(result){
                formatResult(result,"ingredient")
            }

        });
    });
});

$(function(){
    $(".reset_ingredient").click(function() {
        $('.checkbox :checked').each(function () {
            $(this).prop('checked', false);
        });
        var category = [];
        $('.checkbox :not(:checked)').each(function () {
            category.push($(this).val());
        });
        $.ajax({
            type: "GET",
            url: "/filteringredient",
            data: {category:category},
            success: function(result){
                formatResult(result,"ingredient")
            }
        });
        $('.all').prop('checked', true);
    });
});

//filter meal
$(function(){
    $(".category_meal").click(function() {
        var category = [];
        $('.all').prop('checked', false);
        $(".all").attr("disabled", true);
        $('.checkbox :checked').each(function () {
            category.push($(this).val());
        });
        $.ajax({
            type: "GET",
            url: "/filtermeal",
            data: {category:category},
            success: function(result){
                formatResult(result,"meal")
            }

        });
    });
});

$(function(){
    $(".reset_meal").click(function() {
        $('.checkbox :checked').each(function () {
            $(this).prop('checked', false);
        });
        var category = [];
        $('.checkbox :not(:checked)').each(function () {
            category.push($(this).val());
        });
        $.ajax({
            type: "GET",
            url: "/filtermeal",
            data: {category:category},
            success: function(result){
                formatResult(result,"meal")
            }
        });
        $('.all').prop('checked', true);
    });
});

//type determine form result for meal or ingredient
function formatResult(result,type){
    var items="";
    var pages="";
    var max=result.length;
    if(max > 12){
        max=12
    }
    if(type == "meal"){
    for (var i = 0; i< max; i++) {

        items += "<div class=\"item\"><p><img width='250' src='" + result[i].image + "'>" +
            "<br>" + result[i].name +
            "</p><button type=\"button\" id=\"" + result[i].id +
            "\" onclick=\'showModel(" +JSON.stringify(result[i])+ ")\'" +
            ">Add to basket</button>"+
            "<div class=\"modal " + result[i]._id + "\">" +
            "<div class=\"modal-content\">" +
            "<div class=\"modal-header\">" +
            "<span onclick=\"closeModel("+JSON.stringify(result[i])+")\" class=\"close\">&times;</span>" +
            "<h2>"+result[i].name+"</h2>" +
            "</div>" +
            "<div class=\"modal-body\">"
        for(var j=0; j<result[j].components.length; j++){
            items += "<div class=\"" + result[i]._id + "\" >" +
                "<input value=\"" + result[i].components[j].component.id + "\" type=\"checkbox\" checked>" +
                result[i].components[j].component.name + "</div>";
        }
        items += "<button onclick=\'addItemfromlist(" +JSON.stringify(result[i])+ ")\'" + ">Add to basket</button>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>";
    }
    }else{
        for (var i = 0; i< max; i++) {

            items += "<div class=\"item\"><p><img width='250' src='" + result[i].image + "'>" +
                "<br>" + result[i].name +
                "</p><button type=\"button\" id=\"" + result[i].id +
                "\" onclick=\'addItemfromlist(" +JSON.stringify(result[i])+ ")\'" +
                ">Add to basket</button>"+
                "</a></div>";
        }
    }
    $('.items').html(items);
    pages += "<a href='#' id='pre' class=\"disable_a_href 0\" onclick=\'getNextPage(" +JSON.stringify(result)+ ",\"previous\")\'" +
        ">Previous</a>";
    if(result.length <= 12){
        pages += "<a href='#' id='next' class=\"disable_a_href 1\" onclick=\'getNextPage(" + JSON.stringify(result) + ",\"next\")\'" +
            ">Next</a>";
    }else {
        pages += "<a href='#' id='next' class=\"1\" onclick=\'getNextPage(" + JSON.stringify(result) + ",\"next\")\'" +
            ">Next</a>";
    }
    $('.pages').html(pages);
}