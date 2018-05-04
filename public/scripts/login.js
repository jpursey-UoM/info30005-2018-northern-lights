// not sure which directory this should go in
const users = [];
users.push({email: "jpursey@student.unimelb.edu.au", password:"password"});


function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    for (var user of users){
        if(user.email === email){
            if(user.password === password){
                window.location = "/home";
                return false;
            }else{

                alert("Incorrect login details");
                return false;
            }
        }
    }
    alert("Incorrect login details");
}

function verifyUserInfo(){
    try {
        // insecure af?
        const email = document.getElementById("email").value;
        const password1 = document.getElementById("password1").value;
        const password2 = document.getElementById("password2").value;
        if (password1 != password2){
           alert("Passwords must match!");
           return -1
        }
        // check if email already exists
        checkEmail(email, addUser, rejectUser);
        // add new user to db (maybe)

        function addUser(){
            console.log("adding user " + email);
        }
        function rejectUser(){
            console.log("user " + email + " already exists");
        }
        // login
    }catch(e){
        return -1
    }
    return 1
}

function checkPassMatch(){
    try{
        const password1 = document.getElementById("password1").value;
        const password2 = document.getElementById("password2").value;
        if (password1 != password2){
            alert("Passwords must match")
        }
    }catch(e){

    }
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
