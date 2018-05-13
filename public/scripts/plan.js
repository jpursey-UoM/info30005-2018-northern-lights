
function makeDate(dateStr) {
    // make date objects from strings in aus format
    // (dodgy, I know)
    // eg "10/5/2018"
    const parts = dateStr.split("/");
    const date = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
    return date;
}

function makeMealDate(item){
    const dateStr = item.getElementsByClassName("exp-date")[0].innerHTML;
    return makeDate(dateStr);

};

function add2plan(item){
    const wrapper = nextEmptyDay();
    const day = wrapper.parentElement;
    const dateStr = day.getElementsByTagName("h3")[0].innerHTML;
    const planDate = makeDate(dateStr.split(" ")[1]);
    const mealDate = makeMealDate(item);
    if (mealDate < planDate){
        day.classList.add("warning");
    }
    wrapper.innerHTML = item.innerHTML;
    item.parentNode.removeChild(item);
}

function removeFromPlan(item){
    const destination = document.getElementById("meals-list");
    const listItem = document.createElement('li');
    listItem.innerHTML = item.innerHTML;
    listItem.className = "img_wrap";
    listItem.setAttribute("onclick", "add2plan(this)");

    destination.appendChild(listItem);

    // remove the warning class from plan-day
    const day = item.parentElement;
    day.classList.remove("warning");
    //item.parentNode.removeChild(item);
    item.innerHTML = "";

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

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data));
}