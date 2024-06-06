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
// Build Registration View
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

//Build Account management.
async function buildAccountManagement(req, res, next){
    let nav = await utilities.getNav()
    const accountData = res.locals
    console.log("response locals: ", res.locals)
    console.log("account data ", accountData)
    let regards = `Welcome ${accountData.accountData.account_firstname}`;
    res.render("account/management", {
        title:"Account Management",
        nav,
        errors: null,
        regards,
        
       
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
console.log("request body loginaccount: ", req.body)
    const accountData = await accountModel.getAccountByEmail(account_email)
     const login_view = await utilities.buildLoginView()
    if (!accountData) {
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
        if (await bcryptjs.compare(account_password, accountData.account_password)){
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600})
            if(process.env.NODE_ENV === 'development'){
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
            }else{
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000})
            }
            return res.redirect("/account/management")
        }
    } catch (errors) {
        return new Error('Access Forbidden')
    }
}

async function accountLogout(req, res){
    res.clearCookie("jwt");
    req.flash("notice", "Logged Out")
    res.redirect("/")
}

async function buildUpdateAccount(req, res){
    try{
        let nav = await utilities.getNav()
        const {accountData} = res.locals
        res.render("account/update", {
            title:"Update Account",
            nav,
            errors: null,
            accountData,
        })
    }catch(error){
        console.error("No update account:", error)
        req.flash("error", "An error occured")
        res.redirect("/account/")
    }
}

/*********************************
 * Account update process
 *********************************/
async function updateAccount(req, res){
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email} = req.body
   const account_id = parseInt(req.body.account_id)
    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
console.log("request body: ", req.body)
    if(updateResult){
        req.flash("notice","Information was updated successfully to your account")
        const accountData = await accountModel.getAccountById(account_id)
        console.log("account data update: ", accountData)
        let regards = `Welcome ${accountData[0].account_firstname}`
        res.render("account/management", {
            title:"Account Management",
            nav,
            errors: null,
            regards,
            accountData: accountData,
        })
    }else{
        req.flash("notice", "Update account information failed")
        res.render("account/management", {
            title: "Account Management",
            nav,
            errors:null,
            accountData: null,
        })

    }
}

async function passwordUpdate(req, res) {
    let nav = await utilities.getNav()
    const {newAccount_password} = req.body
    console.log("request body passwordUpdate: ", req.body)
    const account_id = parseInt(req.body.account_id)
    let hashedPassword = await bcryptjs.hashSync(newAccount_password, 10);
    const updatePasswordResult = await accountModel.passwordUpdate(account_id, hashedPassword)
    if(updatePasswordResult) {
        req.flash("notice", "Password was successful updated.")
        const accountData = await accountModel.getAccountById(account_id)
        let regards = `Welcome ${accountData[0].account_firstname}`
        res.render("account/management", {
            title: "Account Management",
            nav,
            errors: null,
            regards,
            accountData: accountData,
        })
    }else{
        req.flash("notice", "Update password failed.")
        res.render("account/update", {
            title:"Update Account",
            nav,
            errors:null,
            accountData: null,
        })
    }
}


module.exports = {buildLogin, buildRegistration, registerAccount, loginAccount, buildAccountManagement, accountLogout, buildUpdateAccount,updateAccount, passwordUpdate}