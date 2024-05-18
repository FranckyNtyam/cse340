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
            grid+= '<hr />'
            grid+= '<h2>'
            grid+= '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'+ vehicle.inv_make + ' '+ vehicle.inv_model +  '</a>'
            grid+= '</h2>'
            grid+= '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + 
            '</span>'
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
            grid_detail+='<li>'
            grid_detail+= '<div class="details">'
            grid_detail+= '<hr />'
            grid_detail+= '<h2>'
            grid_detail+= details.inv_make + ' '+ details.inv_model + ' '+ details.inv_year
            grid_detail+= '</h2>'
            grid_detail+= '<div>'
            grid_detail+= details.inv_description
            grid_detail+='</div>'
            grid_detail+='<br />'
            grid_detail+= '<h3>Price</h3>'
            grid_detail+= '<span>$'
            + new Intl.NumberFormat('en-US').format(details.inv_price) 
            grid_detail+='</span>'
            grid_detail+= '<br />'
            grid_detail+= '<h3>Mileage</h3>'
            grid_detail+='<span>'
            + new Intl.NumberFormat('en-US').format(details.inv_miles) 
            grid_detail+='</span>'
            grid_detail+='<hr/>'
            grid_detail+= '</div>'
            grid_detail+= '</li>'
            
        
        })
        
        
        grid_detail+= '</ul>'
    } else {
        grid_detail+= '<p class="notice">Sorry, no details vehicles could be found.</p>'
    }
    return grid_detail
}

module.exports = Util