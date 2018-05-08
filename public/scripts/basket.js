$(document).ready(function(){


    // load ingredients
    var $ingredientTable = $('#ingredients');
    $.ajax({
        type: 'GET',
        url: '/getBasket',
        success: function(basket) {
            $.each(basket, function(i, ingredient) {
                $ingredientTable.append('<tr data-id=' + ingredient.ingredient.id + '>\n' +
                    '                <td class="ingredient_name"><input type=\'button\' class="delete_button" value=\'-\'/>' + ingredient.ingredient.name + '</td>\n' +
                    '                <td class="life_bar_track">\n' +
                    '                    <input type="range" class="w3-green w3-round-large life_bar" style="width:14%;">\n' +
                    '                </td>\n' +
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

    // remove ingredients from basket table
    $('#ingredients').on('click', 'tr > .ingredient_name > .delete_button', function () {

        var $tr = $(this).closest("tr");

        $.ajax({
            type: 'DELETE',
            url: '/deleteFromBasket/' + $tr.attr('data-id'),
            success: function(){
                $tr.remove();
            },
            error: function() {
                alert("Error removing ingredient to basket, please try again");
            }
        });
    });


    // reduce the length of the life bar
    $("#ingredients").on("click", "tr > .len_handler > .button_left", function(event){
        var life_bar = $(event.target.parentElement.previousElementSibling).find(".life_bar");

        var width = 100 * parseFloat($(life_bar).css('width')) / parseFloat($(life_bar).parent().css('width'));

        var new_width = width - 1/7*100;

        if (new_width < 0) {
            new_width = 0
        }
        $(life_bar).css("width", new_width + "%");

    });

    // extend the length of the life bar
    $("#ingredients").on("click", "tr > .len_handler > .button_right", function(event){
        // button > td > td > life_bar

        var life_bar = $(event.target.parentElement.previousElementSibling).find(".life_bar");

        var width = 100 * (parseFloat($(life_bar).css('width')) / parseFloat($(life_bar).parent().css('width')));

        var new_width = width + 1/7*100;

        if (new_width >= 98) {
            new_width = 98;
        }
        $(life_bar).css("width", new_width + "%");

    });

    // remove ingredients from basket table
    $('#ingredients').on('click', 'tr > .ingredient_name > .delete_button', function () {
        $(this).closest("tr").remove();
    } );


});