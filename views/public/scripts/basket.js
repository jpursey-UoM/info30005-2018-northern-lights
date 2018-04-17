$(document).ready(function(){

    // reduce the length of the life bar
    $("#ingredients").on("click", "tr > .len_handler > .button_left", function(event){
        // button > td > td > life_bar
        var life_bar = $(event.target.parentElement.previousElementSibling).find(".life_bar");

        var width = 100 * parseFloat($(life_bar).css('width')) / parseFloat($(life_bar).parent().css('width'));

        var new_width = width - 1/7*100;

        if (new_width < -10) {
            return;
        } else {
            $(life_bar).css("width", new_width + "%");
        }
    });

    // extend the length of the life bar
    $("#ingredients").on("click", "tr > .len_handler > .button_right", function(event){
        // button > td > td > life_bar

        var life_bar = $(event.target.parentElement.previousElementSibling).find(".life_bar");

        var width = 100 * (parseFloat($(life_bar).css('width')) / parseFloat($(life_bar).parent().css('width')));

        var new_width = width + 1/7*100;

        if (new_width >= 100) {
            return;
        } else {
            $(life_bar).css("width", new_width + "%");
        }
    });

    // remove ingredients
    $('#ingredients').on('click', 'tr > .ingredient_name > .delete_button', function () {
        $(this).closest("tr").remove();
    } );

    //
    // $("#ingredients").on("mouseover", "td input", function(){
    //     // alert($(this).val());
    // });


});