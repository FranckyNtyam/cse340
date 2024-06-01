const app = require("express")
const invModel = require("../models/inventory-model")
const Util = {}


/***************************
 * Constructs the nav HTML unordered list
 *************************** */
Util.getNav = async function (req, res, next){
    let data = await invModel.getClassifications()
    let list ="<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) =>{
        list += "<li>"
        list +=
        '<a href="/inv/type/' + 
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
        list += "</li>"  
    })
    list += "</ul>"
    return list
}


/*********************************************
 * Build the classification view HTML
 ********************************************* */
Util.buildClassificationGrid= async function(data){
    let grid=''
    if(data.length > 0){
        grid= '<div id="inv-display">'
        data.forEach(vehicle => {
            grid+= '<div>'
            grid+= '<a href="../../inv/detail/' + vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            +' details"><img src="' + vehicle.inv_thumbnail +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
            +' on CSE Motors"></a>'
            grid+= '</div>'
            grid+= '<div class="namePrice">'
           
            grid+= '<h2>'
            grid+= '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'+ vehicle.inv_make + ' '+ vehicle.inv_model +  '</a>'
            grid+= '</h2>'
            grid+= '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + 
            '</span>'
            grid+= '<hr >'
            grid+= '</div>'
            
           
        })
        
        grid+= '</div>'
    } else {
        grid+= '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/*********************************************
 * Build the details view HTML of vehicles
 ********************************************* */
Util.buildInventoryGridDetail = async function(data_detail){
    let grid_detail=''
    if(data_detail.length > 0){
        grid_detail= '<div id="inv-detail">'
        data_detail.forEach(details => {
            grid_detail+= '<div>'
            grid_detail+= '<img src="' + details.inv_image +'" alt="Image of '+ details.inv_make + ' ' + details.inv_model
            +' on CSE Motors">'
            grid_detail+='</div>'
            grid_detail+= '<div class="details">'
            grid_detail+= '<hr >'
            grid_detail+= '<h2>'
            grid_detail+= details.inv_make + ' '+ details.inv_model + ' '+ details.inv_year
            grid_detail+= '</h2>'
            grid_detail+= details.inv_description
            grid_detail+='<br >'
            grid_detail+='<div class ="price-mil-color">'
            grid_detail+= '<h3>'
            grid_detail+= "Price"
            grid_detail+='<br>'
            grid_detail+= '<span>$'
            + new Intl.NumberFormat('en-US').format(details.inv_price) 
            grid_detail+='</span>'
            grid_detail+='</h3>'
            grid_detail+='<hr>'
            grid_detail+= '<h3>'
            grid_detail+= "Mileage"
            grid_detail+= '<br>'
            grid_detail+='<span>'
            + new Intl.NumberFormat('en-US').format(details.inv_miles) 
            grid_detail+='</span>'
            grid_detail+= '</h3>'
            grid_detail+='<hr>'
            grid_detail+= '<h3>'
            grid_detail+= "Color"
            grid_detail+= '<br>'
            grid_detail+='<span>'
            + details.inv_color
            grid_detail+='</span>'
            grid_detail+= '</h3>'
            grid_detail+='</div>'
            grid_detail+= '</div>'
           
            // grid_detail+= '</li>'
            
        
        })
         
        grid_detail+= '</div>'
    } else {
        grid_detail+= '<p class="notice">Sorry, no details vehicles could be found.</p>'
    }
    return grid_detail
}
 
/**************************
 * build a login view
 ************************** */
Util.buildLoginView = async function(){
    let login_view=''
    login_view+= '<form class="login-form"  action="/account/login" method="post" >'
    login_view+='<label for="email">Email:</label>'
    login_view+='<input type="email" id="email"  name="account_email" required>'
    login_view+='<label for="pwd">Password:</label>'
    login_view+='<input type="password" name="account_password" id="pwd" required pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$">'
    login_view+='<div class="required-pwd"><i>Password must be at least 12 characters, one must be a number, one must be  a lowercase letter, one must be a capital letter, and one must be a non-alphanumeric character.</i></div>'
    login_view+='<span id="pwdBtn">Show Password</span><br><br>'
    login_view+='<input type="submit" value="Login">'
    login_view+='<br>'
    login_view+='<p>No account?<a href="/account/register">Sign-up</a></p>'
    login_view+='</form>'

    return login_view
}

/*******************************
 * build registration view
 ******************************* */
Util.buildRegistrationView = async function(){
    let registration_view=''
    
    registration_view+= '<form class="register-form" action="/account/register" method="post" >'
    registration_view+='<p class="ext-p-form">All fields are required</p>'
    registration_view+='<label for="firstName">First name</label>'
    registration_view+='<input type="text" name="account_firstname" id="firstName" required value="<%= locals.account_firstname %>">'
    registration_view+='<label for="lastName">Last name</label>'
    registration_view+='<input type="text" id="lastName" name="account_lastname" required value="<%= locals.account_lastname %>">'
    registration_view+='<label for="email">Email address</label>'
    registration_view+='<input type="email" id="email"  name="account_email" required placeholder="Enter a valid email address"  value="<%= locals.account_email %>">'
    registration_view+='<label for="pwd">Password</label>'
    registration_view+='<input type="password" name="account_password" id="pwd" required pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$">'
    registration_view+='<div class="required-pwd"><i>Password must be at least 12 characters, one must be a number, one must be  a lowercase letter, one must be a capital letter, and one must be a non-alphanumeric character.</i></div>'
     registration_view+='<span id="pwdBtn">Show Password</span><br><br>'
    registration_view+='<input type="submit" id="submit" value="Register">'
   
    registration_view+='</form>'

    return registration_view
}

// build management view

Util.buildManagementView = async function() {
    let management_view=""
    management_view+='<div class="view-management">'
    management_view+='<a href="/inv/add_classification" class="anchor-management-view">Add New Classification</a><br>'
    management_view+='<a href="/inv/add_new_vehicle" class="anchor-management-view">Add New Vehicle</a>'
    management_view+='</div>'

    return management_view
}

// Build add classification view.
Util.buildAddClassificationView = async function(){
          let adclass_view=''
          adclass_view+='<form id="add-class-form" action="/inv/add_classification" method="post">'
          adclass_view+='<p><i>Field is REQUIRED</i></p>'
          adclass_view+='<div class="class-name">'
          adclass_view+='<p>Classification Name</p>'
          adclass_view+='<label for="classificationName"><i>NAME MUST BE ALPHABETIC CHARACTERS ONLY.</i></label>'
          adclass_view+='<input type="text" name="classification_name" id="classificationName"  required pattern="[A-Za-z]+"><br>'
          adclass_view+='<input type="submit" value="Add Classification">'
          adclass_view+='</div>'
          adclass_view+='</form>'

          return adclass_view;
}

Util.buildAddVehicleView = async function(){
    let advehicle_view =''
    let classification_id = null
    let data = await invModel.getClassifications()
    advehicle_view+='<form id="add-vehicle-form" action="/inv/add_new_vehicle" method="post">' 
    advehicle_view+='<p>All fields are REQUIRED</p>'
    advehicle_view+='<div class="vehicle-form">'
    advehicle_view+='<label for="classification_name" >Classification</label>'
    advehicle_view+='<select id="classification_name" name="classification_name"  required>'
    advehicle_view+="<option value=''>Choose a classification</option>"
    data.rows.forEach((row) => {
        advehicle_view+='<option value="'+ row.classification_id + '"'
        if(classification_id != null && row.classification_id == classification_id){
            advehicle_view+="selected"
        }
        advehicle_view+=">" + row.classification_name + "</option>"
    })
    advehicle_view+='</select>'
    advehicle_view+='<label for="inv_make">Make</label>'
    advehicle_view+='<input type="text" name="inv_make" id="inv_make"  required pattern="[A-Za-z]+">'
    advehicle_view+='<label for="inv_model">Model</label>'
    advehicle_view+='<input type="text" name="inv_model" id="inv_model" required pattern="[A-Za-z]+">'
    advehicle_view+='<label for="inv_description">Description</label>'
    advehicle_view+='<textarea name="inv_description" id="inv_description" rows="6" cols="50"  required>describe the vehicle...</textarea>'
    advehicle_view+='<label for="inv_image">Image Path</label>'
    advehicle_view+='<input type="text" name="inv_image" id="inv_image"  required>'
    advehicle_view+='<label for="inv_thumbnail">Thumbnail Path</label>'
    advehicle_view+='<input type="text" name="inv_thumbnail" id="inv_thumbnail"  required>'
    advehicle_view+='<label for="inv_price">Price</label>'
    advehicle_view+='<input type="number" name="inv_price" id="inv_price"  required>'
    advehicle_view+='<label for="inv_year">Year</label>'
    advehicle_view+='<input type="number" name="inv_year" id="inv_year"  required>'
    advehicle_view+='<label for="inv_miles">Miles</label>'
    advehicle_view+='<input type="number" name="inv_miles" id="inv_miles" required>'
    advehicle_view+='<label for="inv_color">Color</label>'
    advehicle_view+='<input type="text" name="inv_color" id="inv_color"  required pattern="[A-Za-z]+">'
    advehicle_view+='<input type="submit" value="Add Vehicle">'
    advehicle_view+='</div>'

    advehicle_view+='</form>'

    return advehicle_view;
}

/*********************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 ********************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next).catch(next))

Util.intentionalErrorHandler = fn => (err, req, res, next) => Promise.resolve(fn(req, res, next).catch(next))


module.exports = Util
