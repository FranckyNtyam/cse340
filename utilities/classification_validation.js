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
        .withMessage("Please provide a classification name with only letters."),
        // .custom(async (classification_name)=>{
        //     const nameExists = await invModel.checkExistingName(classification_name)
        //     if (nameExists){
        //         throw new Error("name exists. Please add different name")
        //     }
        // }),//on error this message is sent.
    
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
            errors: null,
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
        .withMessage('Contain only letters'),

        body("inv_model")
        .trim().isAlpha()
        .withMessage('Contain only letters'),

        body("inv_year")
        .trim()
        .isInt({min:1860, max:2099})
        .withMessage('Contain integer'),

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
        .withMessage('The cannot be negative number'),

        body("inv_miles")
        .trim()
        .isInt({min:0})
        .withMessage('Miles cannot be negative number'),

        body("inv_color")
        .trim()
        .isAlpha()
        .withMessage('Contain only letters'),

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
            errors: null,
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