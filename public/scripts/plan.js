function add2plan(item){
    const day = nextEmptyDay();
    day.innerHTML = item.innerHTML;
    item.parentNode.removeChild(item);
}

function removeFromPlan(item){
    const destination = document.getElementById("meals-list");
    const listItem = document.createElement('li');
    listItem.innerHTML = item.innerHTML;
    listItem.className = "img_wrap";

    destination.appendChild(listItem);

    item.parentNode.removeChild(item);

}

function addAll(){
    const list = document.getElementById("meals-list");
    for (item of list.children){
        add2plan(item);
    }
}

function removeAll(){
    const list = document.getElementById("meals-list");

    const plan = document.getElementById("plan");
    for (wrapper of plan.getElementsByClassName("img_wrap")){
        removeFromPlan(wrapper);
    }
}

function nextEmptyDay(){
    const plan = document.getElementById("plan");
    for (wrapper of plan.getElementsByClassName("img_wrap")){
        if(wrapper.innerHTML == ""){
            return wrapper;
        }
    }
}