$(function(){
    $("#form1").submit(function(e){
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
                    html += "<div class=\"meal\"><a href=\"/addMeal/" + result[i].id + "\">" +
                        "<p><img width='250' src='" + result[i].image + "'><br>" + result[i].name +
                        "</p></a></div>";
                }
                $('.meals').html(html);
            }

        });

    });
});