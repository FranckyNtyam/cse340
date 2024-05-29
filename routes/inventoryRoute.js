// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const validate = require("../utilities/classification_validation")
const {route} = require("./static")



//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory vehicules details.
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))

// intentional error route
router.get("/err500", utilities.intentionalErrorHandler(invController.intentionalError))

// management route
router.get("/management", utilities.handleErrors(invController.buildManagementView))

//add classification route
router.get("/add_classification", utilities.handleErrors(invController.buildAddClassification))

 //classification post
 router.post("/add_classification",
  validate.classificationRules(), 
  validate.checkClassData,
  utilities.handleErrors(invController.addClassification))

  //add vehicle route
  router.get("/add_new_vehicle", utilities.handleErrors(invController.buildAddVehicle))

  //Inventory post
router.post("/add_new_vehicle",
 validate.inventoryRules(),
//  validate.checkInvData,
 utilities.handleErrors(invController.addVehicle)
)

module.exports = router;