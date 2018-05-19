$(document).ready(function(){
    // load ingredients


    var ingredientTable = $('#ingredients');
    $.ajax({
        type: 'GET',
        url: '/getBasket',
        success: function(basket) {
            $.each(basket, function(i, ingredient) {
                var name = ingredient.ingredient.name;
                var id = ingredient._id;
                var expiryDate = convertToDate(ingredient.expiryDate);

                var shelfLife = getShelfLife(expiryDate);
                var barWidth = "width:" + shelfLifeLen(shelfLife) + "% ";
                var barColor = getColor(shelfLife);

                var shelfLifeMsg = ' data-balloon= "' + name+' will expire in '+shelfLife + ' days"';

                ingredientTable.append('<tr data-id=' + id + '>\n' +
                    '<td class="ingredient_name"><button data-balloon="Remove" data-balloon-pos="left" class="delete_button"> - </button> ' +  name + '</td>\n' +
                    '<td class="life_bar_track">\n' +
                    '<button class="w3-' + barColor + ' w3-round-large life_bar" style='+ barWidth + shelfLifeMsg +' data-balloon-pos="up"' + '></button></td>' +
                    '<td class="len_handler">\n' +
                    '<button class="button_left" data-balloon="Reduce" data-balloon-pos="left"> < </button> \n' +
                    '<button class="button_right" data-balloon="Extend" data-balloon-pos="right"> > </button>\n' +
                    '</td>\n' +
                    '</tr>');
            });
        },
        error: function(){
            alert('error loading ingredients');
        }
    });


    // dynamically show dates
    var calendar = '#calendar tr:last';
    var numOfDays = 7;

    for (var i=0; i<numOfDays; i++){

        var row = "<td>"+ moment().add(i, 'd').format('ddd')+ "<br>" + moment().add(i, 'd').format("MMM D") +  "</td>";
        $(row).appendTo(calendar);
    }





    // remove ingredients from basket table
    $('#ingredients').on('click', 'tr > .ingredient_name > .delete_button', function () {

        var $tr = $(this).closest("tr");

        $.ajax({
            type: 'DELETE',
            url: '/deleteFromBasket/' + $tr.attr('data-id'),
            success: function(){
                // $tr.remove();
            },
            error: function() {
                alert("Error removing ingredient to basket, please refresh and try again");
            }
        });
        // make it seems faster than it actually is..
        $tr.remove();
    });


    // reduce the length of the life bar
    $("#ingredients").on("click", "tr > .len_handler > .button_left", function(event){

        var id = $(this).closest("tr").attr('data-id');

        $.ajax({
            type: 'POST',
            url: '/updateExpiry',
            data: {id: id, action: -1},
            success: function (ingredient) {
                var lifeBar = $(event.target.parentElement.previousElementSibling).find(".life_bar");

                var name = ingredient.ingredient.name;

                updateBar(ingredient.expiryDate, lifeBar, name);


            },
            error: function () {
                alert("Error changing expiry date, please refresh and try again");
            }
        });
    });

    // extend the length of the life bar
    $("#ingredients").on("click", "tr > .len_handler > .button_right", function(event){

        var id = $(this).closest("tr").attr('data-id');

        $.ajax({
            type: 'POST',
            url: '/updateExpiry',
            data: {id: id, action: 1},
            success: function(ingredient) {

                var lifeBar = $(event.target.parentElement.previousElementSibling).find(".life_bar");

                var name = ingredient.ingredient.name;

                updateBar(ingredient.expiryDate, lifeBar, name);

            },
            error: function () {
                alert("Error changing expiry date, please refresh and try again");
            }
        });


    });


    // if the add button is clicked, add the ingredients to the ingredients table, and initialise the button size to be 5/7
    // $(".search_result").on("click", ".plus_button", function(event) {
    //
    //
    //     // get the button index
    //     var button_id = $(this).attr("id");
    //     var ingredientId = parseInt(button_id.slice(7));
    //     $.ajax({
    //         type: 'POST',
    //         url: '/addToBasket',
    //         data: {ingredientId: ingredientId},
    //         success: function (addedItem) {
    //             var name = addedItem.ingredient.name;
    //             var id = addedItem._id;
    //             var today = new Date();
    //             // alert("shelflife is: "+addedItem.expiryDate);
    //             var expiry = new Date(Date.parse(addedItem.expiryDate));
    //             var shelfLife = getShelfLife(expiry);
    //             var html =
    //                 "<tr data-id=" + id + "><td class=\"ingredient_name\"><input type='button' class=\"delete_button\" value='-'  />" + " " + name +
    //                 "</td><td class=\"life_bar_track\">" +
    //                 "<input type=\"range\" class=\" w3-green w3-round-large life_bar\" style=\"width:" + shelfLife + "%\"></td>" +
    //                 "<td class=\"len_handler\"><input type=\"button\" class=\"button_left\" value=\"<\">\n" +
    //                 "<input type=\"button\" class=\"button_right\" value=\">\"></td></tr>";
    //             $("#ingredients tr:last").after(html);
    //         },
    //         error: function () {
    //             console.log("Error adding ingredient to basket, please try again.");
    //         }
    //     });
    // });

    function convertToDate(dateInString){
        var date = new Date(Date.parse(dateInString));
        return date;
    }

    function getShelfLife(date){
        var today = new Date();
        var shelfLife = parseInt(date.getDate()) - parseInt(today.getDate());
        return shelfLife

    }

    function shelfLifeLen(shelfLife){
        var len = Math.floor(shelfLife/7 * 100);
        if (len < 0){
            len = 0;
        } else if(len >= 98){
            len = 98;
        }
        return len;
    }

    function getColor(shelfLife){
        var s = parseInt(shelfLife);
        if (s<=2){
            return "red";
        } else {
            return "green";
        }
    }

    function updateBar(expiryDate, lifeBar, name){
        var newDate = convertToDate(expiryDate);
        var shelfLife = getShelfLife(newDate);
        var len = shelfLifeLen(shelfLife);
        $(lifeBar).css("width", len + "%");

        var balloon = name + " will expire in " + shelfLife + " days";
        $(lifeBar).attr("data-balloon", balloon);

        var color = getColor(shelfLife);
        $(lifeBar).removeClass('w3-green');
        $(lifeBar).removeClass('w3-red');
        $(lifeBar).addClass('w3-' + color);

    }
});