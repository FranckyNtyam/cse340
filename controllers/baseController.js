const utilities = require("../utilities/index")
const baseContro = {}

baseContro.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    // req.flash("notice", "This is a flash message.")
    res.render("index", {title: "Home", nav})
}



module.exports = baseContro