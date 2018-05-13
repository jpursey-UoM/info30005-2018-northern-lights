$(document).ready(function(){
    // var moment = require('moment');

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

                ingredientTable.append('<tr data-id=' + id + '>\n' +
                    '                <td class="ingredient_name"><input type=\'button\' class="delete_button" value=\'-\'/>' +  name + '</td>\n' +
                    '                <td class="life_bar_track">\n' +
                    '                    <input type="range" class="w3-green w3-round-large life_bar" style="width:'+ shelfLife + "%\"></td>" +
                    '                <td class="len_handler">\n' +
                    '                    <input type="button" class="button_left" value="<">\n' +
                    '                    <input type="button" class="button_right" value=">">\n' +
                    '                </td>\n' +
                    '            </tr>');
            });
        },
        error: function(){
            alert('error loading ingredients');
        }
    });


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
                var newDate = convertToDate(ingredient.expiryDate);

                var shelfLife = getShelfLife(newDate);
                // alert("changed successfully, new shelf life is "+ shelfLife);
                var life_bar = $(event.target.parentElement.previousElementSibling).find(".life_bar");
                $(life_bar).css("width", shelfLife + "%");

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
                // alert("changed successfully, new date is "+ convertToDate(ingredient.expiryDate));
                var newDate = convertToDate(ingredient.expiryDate);

                var shelfLife = getShelfLife(newDate);
                // alert("changed successfully, new shelf life is "+ shelfLife);
                var life_bar = $(event.target.parentElement.previousElementSibling).find(".life_bar");
                $(life_bar).css("width", shelfLife + "%");

            },
            error: function () {
                alert("Error changing expiry date, please refresh and try again");
            }
        });

        // var life_bar = $(event.target.parentElement.previousElementSibling).find(".life_bar");
        //
        // var width = 100 * (parseFloat($(life_bar).css('width')) / parseFloat($(life_bar).parent().css('width')));
        //
        // var new_width = width + 1/7*100;
        //
        // if (new_width >= 98) {
        //     new_width = 98;
        // }
        // $(life_bar).css("width", new_width + "%");

    });


    // if the add button is clicked, add the ingredients to the ingredients table, and initialise the button size to be 5/7
    $(".search_result").on("click", ".plus_button", function(event) {

        // get the button index
        var button_id = $(this).attr("id");
        var ingredientId = parseInt(button_id.slice(7));
        $.ajax({
            type: 'POST',
            url: '/addToBasket',
            data: {ingredientId: ingredientId},
            success: function (addedItem) {
                var name = addedItem.ingredient.name;
                var id = addedItem._id;
                var today = new Date();
                var expiry = new Date(Date.parse(addedItem.expiryDate));
                var shelfLife = Math.floor(Math.abs(parseInt(expiry.getDate()) - parseInt(today.getDate()))/7 * 100);
                var html =
                    "<tr data-id=" + id + "><td class=\"ingredient_name\"><input type='button' class=\"delete_button\" value='-'  />" + " " + name +
                    "</td><td class=\"life_bar_track\">" +
                    "<input type=\"range\" class=\" w3-green w3-round-large life_bar\" style=\"width:" + shelfLife + "%\"></td>" +
                    "<td class=\"len_handler\"><input type=\"button\" class=\"button_left\" value=\"<\">\n" +
                    "<input type=\"button\" class=\"button_right\" value=\">\"></td></tr>";
                $("#ingredients tr:last").after(html);
            },
            error: function () {
                console.log("Error adding ingredient to basket, please try again.");
            }
        });
    });

    function convertToDate(dateInString){
        var date = new Date(Date.parse(dateInString));
        return date;
    }

    function getShelfLife(date){
        var today = new Date();
        var shelfLife = Math.floor((parseInt(date.getDate()) - parseInt(today.getDate()))/7 * 100);
        if (shelfLife < 0){
            shelfLife = 0;
        } else if(shelfLife >= 98){
            shelfLife = 98;
        }
        return shelfLife;
    }



});