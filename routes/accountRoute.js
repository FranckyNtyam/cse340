const express = require("express")
const accountRouter = new express.Router()
const accountController = require("../controllers/accountController")
// const pool = require("../database")
const utilities = require("../utilities/index")

// login route
accountRouter.get("/login", utilities.handleErrors(accountController.buildLogin)) 

// registretion route
accountRouter.get("/register", utilities.handleErrors(accountController.buildRegistration))

 //register post
 accountRouter.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = accountRouter