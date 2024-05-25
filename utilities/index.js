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
    let grid
    if(data.length > 0){
        grid= '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid+= '<li>'
            grid+= '<a href="../../inv/detail/' + vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            +' details"><img src="' + vehicle.inv_thumbnail +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
            +' on CSE Motors"/></a>'
            grid+= '<div class="namePrice">'
           
            grid+= '<h2>'
            grid+= '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'+ vehicle.inv_make + ' '+ vehicle.inv_model +  '</a>'
            grid+= '</h2>'
            grid+= '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + 
            '</span>'
            grid+= '<hr />'
            grid+= '</div>'
            
            grid+= '</li>'
        })
        
        grid+= '</ul>'
    } else {
        grid+= '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/*********************************************
 * Build the details view HTML of vehicles
 ********************************************* */
Util.buildInventoryGridDetail = async function(data_detail){
    let grid_detail
    if(data_detail.length > 0){
        grid_detail= '<ul id="inv-detail">'
        data_detail.forEach(details => {
            grid_detail+= '<li>'
            grid_detail+= '<img src="' + details.inv_image +'" alt="Image of '+ details.inv_make + ' ' + details.inv_model
            +' on CSE Motors"/>'
            grid_detail+='</li>'
            grid_detail+= '<div class="details">'
            grid_detail+= '<hr />'
            grid_detail+= '<h2>'
            grid_detail+= details.inv_make + ' '+ details.inv_model + ' '+ details.inv_year
            grid_detail+= '</h2>'
            grid_detail+= details.inv_description
            grid_detail+='<br />'
            grid_detail+='<div class ="price-mil-color">'
            grid_detail+= '<h3>'
            grid_detail+= "Price"
            grid_detail+='<br/>'
            grid_detail+= '<span>$'
            + new Intl.NumberFormat('en-US').format(details.inv_price) 
            grid_detail+='</span>'
            grid_detail+='</h3>'
            grid_detail+='<hr/>'
            grid_detail+= '<h3>'
            grid_detail+= "Mileage"
            grid_detail+= '<br/>'
            grid_detail+='<span>'
            + new Intl.NumberFormat('en-US').format(details.inv_miles) 
            grid_detail+='</span>'
            grid_detail+= '</h3>'
            grid_detail+='<hr/>'
            grid_detail+= '<h3>'
            grid_detail+= "Color"
            grid_detail+= '<br/>'
            grid_detail+='<span>'
            + details.inv_color
            grid_detail+='</span>'
            grid_detail+= '</h3>'
            grid_detail+='</div>'
            grid_detail+= '</div>'
            // grid_detail+= '</li>'
            
        
        })
         
        grid_detail+= '</ul>'
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
    login_view+= '<form class="login-form"  action="account/login" method="post" >'
    login_view+='<label for="email">Email:</label>'
    login_view+='<input type="email" name="account_email" required>'
    login_view+='<label for="pwd">Password:</label>'
    login_view+='<input type="password" name="account_password" id="pwd" required pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$">'
    login_view+='<div class="required-pwd"><i>Password must be at least 12 characters, one must be a number, one must be  a lowercase letter, one must be a capital letter, and one must be a non-alphanumeric character.</i></div>'
    login_view+='<input type="submit" value="Login">'
    login_view+='<br/>'
    login_view+='<p>No account?<a href="/account/register">Sign-up</a></p>'
    login_view+='</form>'

    return login_view
}

/*******************************
 * build registration view
 ******************************* */
Util.buildRegistrationView = async function(){
    let registration_view=''
    registration_view+='<p class="ext-p-form">All fields are required</p>'
    registration_view+= '<form class="register-form" action="/account/register" method="post" >'
    registration_view+='<label for="first_name">First name</label>'
    registration_view+='<input type="text" name="account_firstname" required>'
    registration_view+='<label for="last_name">Last name</label>'
    registration_view+='<input type="text" name="account_lastname" required>'
    registration_view+='<label for="email">Email address</label>'
    registration_view+='<input type="email" name="account_email" required placeholder="Enter a valid email address">'
    registration_view+='<label for="pwd">Password</label>'
    registration_view+='<input type="password" name="account_password" id="pwd" required pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$">'
    registration_view+='<div class="required-pwd"><i>Password must be at least 12 characters, one must be a number, one must be  a lowercase letter, one must be a capital letter, and one must be a non-alphanumeric character.</i></div>'

    registration_view+='<input type="submit" value="Register">'
   
    registration_view+='</form>'

    return registration_view
}

/*********************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 ********************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next).catch(next))

Util.intentionalErrorHandler = fn => (err, req, res, next) => Promise.resolve(fn(req, res, next).catch(next))


module.exports = Util
