const express = require("express")
const accountRouter = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const regValidate = require("../utilities/account-validation")

// login route
accountRouter.get("/login", utilities.handleErrors(accountController.buildLogin)) 

 //login post
 accountRouter.post('/login',
  regValidate.loginRules(), 
  regValidate.checkLogData,
  utilities.handleErrors(accountController.loginAccount))

// registretion route
accountRouter.get("/register", utilities.handleErrors(accountController.buildRegistration))

 //register post
 accountRouter.post('/register',
  regValidate.registationRules(), 
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount))

  // Process the login attempt
  accountRouter.post(
    "/login", (req,res) => {
        res.status(200).send('login process')
    }
  )

module.exports = accountRouter