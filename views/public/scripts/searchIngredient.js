$(function(){
    $("form").submit(function(e){
        filterText = $('.search').val();
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: "/ingredient",
            data: {search: filterText},
            success: function(result){
                console.log(result);
                var html="";
                for (var i = 0; i< result.length; i++) {
                    html += "<div class=\"item\"><a href=\"/addIngredient/" + result[i].id + "\">" +
                        "<p><img width='250' src='" + result[i].image + "'><br>" + result[i].name + "</p></a></div>";
                }
                $('.items').html(html);
            }

        });

    });
});