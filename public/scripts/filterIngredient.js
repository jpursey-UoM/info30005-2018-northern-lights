$(function(){
    $(".category").click(function() {
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
                formatResult(result)
            }

        });
    });
});

$(function(){
    $(".reset").click(function() {
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
                formatResult(result)
            }
        });
        $('.all').prop('checked', true);
    });
});


function formatResult(result){
    var items="";
    var pages="";
    var max=result.length;
    if(max > 12){
        max=12
    }
    for (var i = 0; i< max; i++) {

        items += "<div class=\"item\"><p><img width='250' src='" + result[i].image + "'>" +
            "<br>" + result[i].name +
            "</p><button type=\"button\" id=\"" + result[i].id +
            "\" onclick=\'addItemfromlist(" +JSON.stringify(result[i])+ ")\'" +
            ">Add to basket</button>"+
            "</a></div>";
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



