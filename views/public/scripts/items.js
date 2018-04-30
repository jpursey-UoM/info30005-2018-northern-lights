function addToBasket(item){
    $.post("/addItemFromList",
        {
            item: item
        },
        function(){
        });
}

function addItemfromlist(item){
    document.getElementById(item.id).innerHTML="Added";
    document.getElementById(item.id).disabled = true;
    addToBasket(item);
}


