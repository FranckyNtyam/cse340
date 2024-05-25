const express = require("express")
const accountRouter = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const regValidate = require("../utilities/account-validation")

// login route
accountRouter.get("/login", utilities.handleErrors(accountController.buildLogin)) 

// registretion route
accountRouter.get("/register", utilities.handleErrors(accountController.buildRegistration))

 //register post
 accountRouter.post('/register',
  regValidate.registationRules(), 
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount))

module.exports = accountRouter