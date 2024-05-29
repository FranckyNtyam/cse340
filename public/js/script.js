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