$(function(){
    $("form").submit(function(e){
        filterText = $('.search').val();
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: "/meal",
            data: {search: filterText},
            success: function(result){
                console.log(result);
                var html="";
                for (var i = 0; i< result.length; i++) {
                    html += "<div class=\"item\"><p><img width='250' src='" + result[i].image + "'>" +
                        "<br>" + result[i].name +
                        "</p><button type=\"button\" id=\"" + result[i].id +
                        "\" onclick=\"addMealfromlist("+result[i].id+")\">Add to basket</button>"+
                        "</a></div>";
                }
                $('.items').html(html);
            }

        });

    });
});