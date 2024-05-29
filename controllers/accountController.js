const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcryptjs = require("bcryptjs")

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

    const regResult = await accountModel.loginAccount(
        
        account_email,
        account_password
    )
     const login_view = await utilities.buildLoginView()
    if (logResult) {
        req.flash(
            "notice",
            `Welcome ${account_firstname}.`
        )
        res.status(201).render("/", {
            title:"Home",
            nav,
            errors,
            // login_view,
        })
    } else {
        req.flash("notice", "Sorry, your login failed check your password or email.")
        res.status(501).render("account/login", {
            title:"Login",
            nav,
            errors,
            login_view,
        })
    }
}

module.exports = {buildLogin, buildRegistration, registerAccount, loginAccount}