function addToBasket(item){
    $.post("/addItemFromList",
        {
            item: item
        },
        function(){
        });
}
function clearList(){
    console.log("test")
    $.ajax({
        url: '/clearlist',
        type: 'DELETE',
        success: function(result) {
        }
    });
}

function addItemfromlist(item){
    document.getElementById(item.id).innerHTML="Added";
    document.getElementById(item.id).disabled = true;
    addToBasket(item);
}

function getNextPage(itemList,place){
    console.log(itemList)
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

    for (var i = nextPage*ItemOnOnePage; i< max; i++) {
        items += "<div class=\"item\"><p><img width='250' src='" + itemList[i].image + "'>" +
            "<br>" + itemList[i].name +
            "</p><button type=\"button\" id=\"" + itemList[i].id +
            "\" onclick=\'addItemfromlist(" +JSON.stringify(itemList[i])+ ")\'" +
            ">Add to basket</button>"+
            "</a></div>";
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

function getFirstOrLastPage(meals,string){
    if(string == 'first'){
        getNextPage(meals,1,'first')

    }else{
        getNextPage(meals,Math.ceil(meals.length/12),'last')
    }
}


