const invModel = require("../models/inventory-model")
const utilities = require("../utilities/index")

const invCont = {}

/*******************************
 * Build inventory by classification view
 ******************************** */

invCont.buildByClassificationId = async function (req, res, next){
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("../views/inventory/classification.ejs", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

invCont.buildByInventoryId = async function (req, res, next){
    const inv_id = req.params.inventoryId
    const data_detail = await invModel.getVehiclesDetailsByInventoryId(inv_id)
    const grid_detail = await utilities.buildInventoryGridDetail(data_detail)
    let nav = await utilities.getNav()
    const make_model = data_detail[0].inv_make + " " + data_detail[0].inv_model
    res.render("../views/inventory/vehicles_details.ejs", {
        title: make_model,
        nav,
        grid_detail, 
    })
}

module.exports = invCont