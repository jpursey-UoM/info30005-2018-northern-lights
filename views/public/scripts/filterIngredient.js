$(function(){
    $(".category").click(function() {
        var category = [];
        $('.checkbox :checked').each(function () {
            category.push($(this).val());
        });
        $.ajax({
            type: "GET",
            url: "/filteringredient",
            data: {category:category},
            success: function(result){
                console.log(result);
                var html="";
                for (var i = 0; i< result.length; i++) {
                    html += "<div class=\"item\"><p><img width='250' src='" + result[i].image + "'>" +
                        "<br>" + result[i].name +
                        "</p><button type=\"button\" id=\"" + result[i].id +
                        "\" onclick=\"addIngredientfromlist("+result[i].id+")\">Add to basket</button>"+
                        "</a></div>";
                }
                $('.items').html(html);
            }

        });
    });
});



