const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")

async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    const login_view = await utilities.buildLoginView()
    res.render("../views/account/login.ejs", {
        title:"Login",
        nav,
        login_view,
    })
}

async function buildRegistration(req, res, next){
    let nav = await utilities.getNav()
    const registration_view = await utilities.buildRegistrationView()
    res.render("../views/account/register.ejs", {
        title:"Register",
        nav,
        registration_view,
    })
}

/*****************************************
 * Process Registration
 ***************************************** */
async function registerAccount(req,res) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname,account_email, account_password} = req.body

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
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
            login_view,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title:"Registration",
            nav,
            registration_view,
        })
    }
}

module.exports = {buildLogin, buildRegistration, registerAccount}