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
    const addCart_view = await utilities.buildAddCart(inv_id)
    const make_model = data_detail[0].inv_make + " " + data_detail[0].inv_model
    res.render("../views/inventory/vehicles_details.ejs", {
        title: make_model,
        nav,
        addCart_view,
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

/*******************************************
 * return Inventory by Classification As JSON
 ******************************************* */
invCont.getInventoryJSON = async (req, res, next) =>{
    const classification_id = parseInt(req.params.classification_id)
    const invData =await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    }else{
        next(new Error("No data returned"))
    }
}

/*********************************************
 * Build edit inventory view
 ********************************************** */
invCont.getInventoryRowToUpdate = async function (req, res, next){
    const inv_id =parseInt (req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehiclesDetailsByInventoryId(inv_id)
    console.log("itemData: ", itemData)
    const classification_select_view= await utilities.buildClassificationList(itemData[0].classification_id)
    const make_model = `${itemData[0].inv_make}  ${itemData[0].inv_model}`
    res.render("../views/inventory/edit-inventory", {
        title: "Edit " + make_model,
        nav,
        classification_select_view: classification_select_view,
        errors: null,
        inv_id: itemData[0].inv_id,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_year: itemData[0].inv_year,
        inv_description: itemData[0].inv_description,
        inv_image: itemData[0].inv_image,
        inv_thumbnail: itemData[0].inv_thumbnail,
        inv_price: itemData[0].inv_price,
        inv_miles: itemData[0].inv_miles,
        inv_color: itemData[0].inv_color,
        classification_id: itemData[0].classification_id
    })
   
}

/*****************************************
 * Process Add inventory
 ***************************************** */
invCont.updateInventory = async function (req, res) {
    let nav = await utilities.getNav()
    const {inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
    console.log("requeste body: ",req.body)
   const classification_id = parseInt(req.body.classification_name)
    const updateResult = await invModel.updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
 console.log("update result: ", updateResult)
    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash(
            "notice",
            `Congratulations, ${itemName} was successfully updated.`
        )
        res.redirect("/inv")
    } else {
        const classification_select_view = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("./inventory/edit-inventory", {
            title:"Edit" + itemName,
            nav,
            errors: null,
            classification_select_view,
            inv_id, 
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color, 
            classification_id
        })
    }

}
/*****************************
 * Build delete confirmation view
 *******************************/
invCont.deleteView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehiclesDetailsByInventoryId(inv_id)
    console.log("itemData: ", itemData)
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("./inventory/delete", {
        title:"Delete " + itemName,
        nav,
        errors: null,
        inv_id: itemData[0].inv_id,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_price: itemData[0].inv_price,
        inv_year: itemData[0].inv_year,
    })
}


/*****************************
 * Delete Inventory Item
 ******************************/
invCont.deleteItem = async function(req, res, next){
    let nav = await utilities.getNav()
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if(deleteResult){
        req.flash("notice", 'The deletion was successful.')
        res.redirect("/inv")
    }else{
        req.flash("notice", 'Sorry, the delete failed.')
        res.redirect("/inv/delete/inv_id")
    }
}

invCont.buildCart= async function (req, res, next){
    let nav= await utilities.getNav()
    console.log("request body: ", req.body)
    res.render("./inventory/cart", {
        title:"Shopping Cart",
        nav,
        errors:null,
    })
}
invCont.addToCartController = async function(req, res){
    let nav = await utilities.getNav()
    let {inv_id, cart_quantity, cart_price} = req.body
     inv_id = parseInt(req.body.inv_id)
     cart_quantity = parseInt(req.body.cart_quantity)
     cart_price = parseInt(req.body.cart_price)
    
    const addCartResult = await invModel.addToCart(inv_id, cart_quantity, cart_price )

    if(addCartResult){
        req.flash("notice","Product added to cart successfully." )
        const invData = await invModel.getVehiclesDetailsByInventoryId(inv_id)
        res.render("./inventory/cart", {
            title: "Shopping Cart",
            nav,
            errors: null,
          invData: invData,
          inv_make: invData[0].inv_make,
          inv_model: invData[0].inv_model,
          inv_price: invData[0].inv_price,
          inv_year: invData[0].inv_year,
          inv_image: invData[0].inv_image,
          cart_quantity,
          cart_price,
         
        })
    }else{
        req.flash("notice", "Sorry, the adding product failed")
        res.redirect("/")
    }

   

}
module.exports = invCont