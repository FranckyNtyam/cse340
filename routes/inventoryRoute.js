// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const pool = require("../database/index")

//Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build inventory vehicules details.
router.get("/detail/:inventoryId", invController.buildByInventoryId)

module.exports = router;