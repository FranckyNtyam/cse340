const form = document.querySelector("#update-vehicle-form")

form.addEventListener("change", function(){
    const updateBtn = document.querySelector("#submitForm")
    updateBtn.removeAttribute("disabled")
})