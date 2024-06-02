const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken") 
require("dotenv").config()


async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    const login_view = await utilities.buildLoginView()
    res.render("../views/account/login.ejs", {
        title:"Login",
        nav,
        errors: null,
        login_view,
    })
}

async function buildRegistration(req, res, next){
    let nav = await utilities.getNav()
    const registration_view = await utilities.buildRegistrationView()
    res.render("../views/account/register.ejs", {
        title:"Register",
        nav,
        errors: null,
        registration_view,
    })
}
 
async function buildAccountManagement(req, res, next){
    let nav = await utilities.getNav()
    res.render("../views/account/account_management.ejs", {
        title:"You're logged in",
        nav,
        errors: null,
       
    })
}
/*****************************************
 * Process Registration
 ***************************************** */
async function registerAccount(req,res) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname,account_email, account_password} = req.body

    //Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcryptjs.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
            registration_view,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )
    const login_view = await utilities.buildLoginView()
    const registration_view = await utilities.buildRegistrationView()
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title:"Login",
            nav,
            errors: null,
            login_view,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title:"Registration",
            nav,
            errors: null,
            registration_view,
        })
    }
}

/*****************************************
 * Process login
 ***************************************** */
async function loginAccount(req,res) {
    let nav = await utilities.getNav()
    const {account_email, account_password} = req.body

    const accountDAta = await accountModel.getAccountByEmail(account_email)
     const login_view = await utilities.buildLoginView()
    if (!accountDAta) {
        req.flash(
            "notice",
            "Please check your credentials and try again."
        )
        res.status(400).render("account/login", {
            title:"Home",
            nav,
            errors: null,
            login_view,
            account_email,
        })
        return
    } 
    try{
        if (await bcryptjs.compare(account_password, accountDAta.account_password)){
            delete accountDAta.account_password
            const accessToken = jwt.sign(accountDAta, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600})
            if(process.env.NODE_ENV === 'development'){
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
            }else{
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000})
            }
            return res.redirect("/account/account_management")
        }
    } catch (errors) {
        return new Error('Access Forbidden')
    }
}

module.exports = {buildLogin, buildRegistration, registerAccount, loginAccount, buildAccountManagement}