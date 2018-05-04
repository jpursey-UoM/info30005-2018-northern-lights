// not sure which directory this should go in
const users = [];
users.push({email: "jpursey@student.unimelb.edu.au", password:"password"});


function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    for (var user of users){
        console.log(user.email);
        if(user.email === email){
            if(user.password === password){
                window.location = "/home";
                return false;
            }else{

                alert("Incorrect password");
                return false;
            }
        }
    }
    alert("Email address not found.");

}


