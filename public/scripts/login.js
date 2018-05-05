
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    $.ajax({
        url: "/userlogin",
        type: "POST",
        data: {
            "email":email,
            "password":password
        }

    }).done(function(data) {
        if (data.id != null) {
            setCurrentUser(data.id);
            window.location = "/home";
        } else {
            alert("Incorrect login details")
        }
    });
}

function verifyUserInfo(){
    try {
        // insecure af?
        const email = document.getElementById("email").value;
        const password1 = document.getElementById("password1").value;
        const password2 = document.getElementById("password2").value;
        if (!checkPassMatch()){
           return -1
        }
        // check if email already exists
        checkEmail(email, good, bad);
        // add new user to db (maybe)

        function good(){
            addUser(email, password1);
            alert("Woohoo! New user added successfully");
            window.location = "/login";
            // how 2 set the email value after redirecting? below not working
            document.getElementById("email").value = email;
        }
        function bad(){
            alert("User already exists!")
        }
    }catch(e){
        return -1
    }
    return 1
}

function addUser(email, password){
    $.ajax({
        url: "/adduser",
        type: "POST",
        data: {
            "email":email,
            "password":password}
    });
}

function checkEmail(email, trueCallback, falseCallback){
    $.ajax({
        url: "/checkuser",
        type: "GET",
        data: {"email":email},
        success: function(data){
            if (data){
                trueCallback();
            }else{
                falseCallback();
            }
        }
    });
}

function checkPassMatch(){
    try{
        const password1 = document.getElementById("password1").value;
        const password2 = document.getElementById("password2").value;
        if (password1 != password2){
            alert("Passwords must match")
            return false
        }
        return true
    }catch(e){
        return false
    }
}

function setCurrentUser(id){
    // do this somehow...
}
