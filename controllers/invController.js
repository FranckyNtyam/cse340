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
// build management 
invCont.buildManagementView = async function (req, res, next){

    const management_view = await utilities.buildManagementView()
    let nav = await utilities.getNav()
    
    res.render("../views/inventory/management_view.ejs", {
        title: "Vehicle Management",
        nav,
        management_view, 
        errors: null,
    })
}

// build add classification
 invCont.buildAddClassification = async function (req, res, next){
    let nav = await utilities.getNav()
    const adclass_view = await utilities.buildAddClassificationView()
    res.render("./inventory/add_classification", {
        title:"Add New Classification",
        nav,
        errors: null,
        adclass_view,
    })
}

// Build add new vehicle
invCont.buildAddVehicle = async function (req, res, next){
    let nav = await utilities.getNav()
    const advehicle_view = await utilities.buildAddVehicleView()
    res.render("./inventory/add_new_vehicle",{
        title:"Add New Vehicle",
        nav,
        advehicle_view,
        errors: null,
    }
    )
}

/*****************************************
 * Process Add classification
 ***************************************** */
 invCont.addClassification = async function (req,res) {
    let nav = await utilities.getNav()
    const {classification_name} = req.body
console.log("req.body:", req.body)
    const classificationResult = await invModel.addNewClassification(classification_name)
    const adclass_view = await utilities.buildAddClassificationView()
    const management_view = await utilities.buildManagementView()
    if (classificationResult) {
        req.flash(
            "notice",
            `Congratulations, ${classification_name} is added in classification.`
        )
        res.status(201).render("./inventory/management_view", {
            title: "Vehicle Management",
            nav,
            management_view, 
            errors: null,
            
        })
    } else {
        req.flash("notice", "Sorry, add new classification failed.")
        res.status(501).render("./inventory/add_classification", {
            title:"Add New Classification",
            nav,
            errors: null,
            adclass_view
        })
    }
}

/*****************************************
 * Process Add inventory
 ***************************************** */
invCont.addVehicle = async function (req, res) {
    let nav = await utilities.getNav()
    const advehicle_view = await utilities.buildAddVehicleView()
    const management_view = await utilities.buildManagementView()
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,classification_name} = req.body
   classification_id = parseInt(req.body.classification_name)
//    console.log("classification_id", classification_id)
    const inventoryResult = await invModel.addNewVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
 console.log("inventory result: ", inventoryResult)
    if (inventoryResult) {
        req.flash(
            "notice",
            `Congratulations, ${inv_make} ${inv_model} ${inv_year} is added in inventory.`
        )
        res.status(201).render("./inventory/management_view", {
            title: "Vehicle Management",
            nav,
            management_view, 
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, add new vehicle failed.")
        res.status(501).render("./inventory/add_new_vehicle", {
            title:"Add New Vehicle",
            nav,
            errors: null,
            advehicle_view
        })
    }

}



module.exports = invCont