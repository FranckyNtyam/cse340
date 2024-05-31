const utilities = require("./index")
const {body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}
/*********************************
 * Classification Data validation Rules
 ********************************** */
validate.classificationRules = () => {
    return[
        //classification name is required and must be string
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isAlpha()
        .isLength({min: 1})
        .withMessage("Please provide a classification name with only letters.")
    
    ]
}

/**************************************
 * Check data and return errors or continue to add classification
 ************************************** */
validate.checkClassData = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        const adclass_view = await utilities.buildAddClassificationView()
        res.render("inventory/add_classification", {
            errors,
            title:"Add New Classification",
            nav,
            adclass_view,
            classification_name
        })
        return
    }
    next()
}

/*********************************
 * Inventory Data validation Rules
 ********************************** */
validate.inventoryRules = () => {
    return [
        body("inv_make")
        .trim()
        .isAlpha()
        .withMessage('Make is required and  must contains just letters'),

        body("inv_model")
        .trim()
        .isAlpha()
        .withMessage('Model is required and must contain just letters'),

        body("inv_year")
        .trim()
        .isInt({min:2000, max:2024})
        .withMessage('Year is required and must contains integer between 2000 and 2024'),

        body("inv_description")
        .trim()
        .isLength({min:1})
        .withMessage('Description is required'),

        body("inv_image")
        .trim()
        .isLength({min:1})
        .withMessage('Image path is required'),

        body("inv_thumbnail")
        .trim()
        .isLength({min:1})
        .withMessage('Thumbnail path is required'),

        body("inv_price")
        .trim()
        .isInt({min:0})
        .withMessage('Price is required and cannot be negative number'),

        body("inv_miles")
        .trim()
        .isInt({min:0})
        .withMessage('Miles is required and cannot be negative number'),

        body("inv_color")
        .trim()
        .isAlpha()
        .withMessage('Color name is required and must contain only letters'),

        // body("classification_id")
        // .isInt({min:1})

    ]

}

/**************************************
 * Check data and return errors or continue to add inventory
 ************************************** */
validate.checkInvData = async (req, res, next) => {
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body
    console.log("check inventory data req.body:", req.body)
    let errors = validationResult(req);
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        const advehicle_view = await utilities.buildAddVehicleView()
        res.render("inventory/add_new_vehicle", {
            errors,
            title:"Add New Vehicle",
            nav,
            advehicle_view,
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
        return
    }
    next()
}
module.exports = validate