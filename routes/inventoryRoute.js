// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const pool = require("../database/index")
const utilities = require("../utilities/index")



//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory vehicules details.
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))

// intentional error route
router.get("/err500", utilities.intentionalErrorHandler(invController.intentionalError))



module.exports = router;