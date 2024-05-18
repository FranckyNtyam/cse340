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
        data_detail.forEach(vehicle => {
            grid_detail+= '<li>'
            grid_detail+= '<img src="' + vehicle.inv_image +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
            +' on CSE Motors"/>'
            grid_detail+= '<div class="details">'
            grid_detail+= '<hr />'
            grid_detail+= '<h2>'
            grid_detail+= vehicle.inv_make + ' '+ vehicle.inv_model + ' '+ vehicle.inv_year
            grid_detail+= '</h2>'
            grid_detail+= '<p>'
            grid_detail+= vehicle.inv_description
            grid_detail+='</p>'
            grid_detail+= '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + 
            '</span>'
            grid_detail+='<hr/>'
            grid_detail+= '<span>'
                vehicle.inv_miles 
            grid_detail+='</span>'
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