'use strict'
const pwdBtn = document.querySelector("#pwdBtn");
pwdBtn.addEventListener("click", function() {
    const pwdInput = document.getElementById("pwd");
    const type = pwdInput.getAttribute("type");
    if (type == "password") {
        pwdInput.setAttribute("type", "text");
        pwdBtn.innerHTML = "Hide Password";
    } else {
        pwdInput.setAttribute("type", "password");
        pwdBtn.innerHTML = "Show Password";
    }
})

// Stick register form
const firstNameId=document.getElementById('firstName');
const lastNameId=document.getElementById('lastName');
const emailId=document.getElementById('email');
if(localStorage.account_firstname == undefined &localStorage.account_firstname == undefined & localStorage.account_firstname == undefined ){
    firstNameId.value = " "
    lastNameId.value=" "
    emailId.value =" "
}else{
    firstNameId.value =localStorage.account_firstname;
    lastNameId.value =localStorage.account_lastname;
    emailId.value =localStorage.account_email;
}

