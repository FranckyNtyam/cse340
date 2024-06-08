const express = require("express")
const accountRouter = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const validate = require("../utilities/account-validation")
// const validate = require("../utilities/classification_validation")

// login route
accountRouter.get("/login",

utilities.handleErrors(accountController.buildLogin)) 
// registretion route
accountRouter.get("/register",
utilities.handleErrors(accountController.buildRegistration))

// management route
accountRouter.get("/management", 
utilities.checkLogin,
utilities.handleErrors(accountController.buildAccountManagement))

// update get route
accountRouter.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))


 //login post
 accountRouter.post('/login',
 validate.loginRules(),
  validate.checkLogData,
  utilities.handleErrors(accountController.loginAccount))

 //register post
 accountRouter.post('/register',
  validate.registationRules(), 
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount))

  // update post route
  accountRouter.post("/update", utilities.checkLogin, validate.updateAccountRules(), utilities.handleErrors(accountController.updateAccount))

accountRouter.post('/', utilities.handleErrors(accountController.accountLogout))

accountRouter.post("/update-password", validate.updatePasswordRules(),
utilities.handleErrors(accountController.passwordUpdate))



module.exports = accountRouter