const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const pool = require("../database")


router.get("/login", accountController.buildLogin)

module.exports = buildLogin