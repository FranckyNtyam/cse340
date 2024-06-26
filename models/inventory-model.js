const pool = require("../database/index.js")

/* ***************************
* Get all data from classification table
****************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}
/* ***************************
* Get all data from inventory table
****************************** */
async function getInventory(){
    return await pool.query("SELECT * FROM public.inventory ORDER BY inv_make")
}

/**********************************
 * Get all inventory items and classification_name by classification_id
 ********************************** */
async function getInventoryByClassificationId(classification_id){
    try {
        const data = await pool.query(`SELECT * FROM public.inventory AS i
        JOIN public.classification AS c
        ON i.classification_id = c.classification_id
        WHERE i.classification_id = $1`,
        [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationid error " + error)
    }
}
/************************************
 * Insert classification name
 *************************************/
async function addNewClassification(classification_name){
    try {
        const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
        const data = await pool.query(sql, [classification_name])
        return data.rows
    }catch (error) {
        return error.message
    }
}
async function getVehiclesDetailsByInventoryId(inv_id){
    try{
        const data_detail = await pool.query(`SELECT * FROM public.inventory
        WHERE inv_id=$1`, [inv_id])
        return data_detail.rows
    } catch (error) {
        console.error("getinventoryid error " + error)
    }
}



/******************************
 * Add new inventory
 ****************************** */
async function addNewVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
    try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])

    return data.rows
} catch(error) {
    return error.message
}
}

/******************************
 * Add new inventory
 ****************************** */
async function updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
    try {
    const sql = "UPDATE public.inventory SET inv_make=$1, inv_model=$2, inv_year=$3, inv_description=$4, inv_image=$5, inv_thumbnail=$6, inv_price=$7, inv_miles=$8, inv_color=$9, classification_id=$10 WHERE inv_id=$11 RETURNING *"
    const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id])

    return data.rows[0]
} catch(error) {
    console.error("model error: " + error)
}
}

/********************************
 * Query to delete inventory item
 *********************************/
async function deleteInventoryItem(inv_id) {
    try{
        const sql = "DELETE FROM public.inventory WHERE inv_id = $1"
        const data = await pool.query(sql, [inv_id])
        return data
    }catch(error){
        new Error("Delete Inventory Error")
    }
}


 /******************************
 * Add new vehicle in cart
 ****************************** */
 async function addToCart(inv_id, cart_quantity, cart_price){
    try {
    const sql = "INSERT INTO public.cart (inv_id, cart_quantity, cart_price) VALUES ($1, $2, $3) RETURNING *"
    const data = await pool.query(sql, [ inv_id, cart_quantity, cart_price])
    return data.rows
} catch(error) {
    return error.message
}
}

module.exports = {getClassifications, getInventory, getInventoryByClassificationId, getVehiclesDetailsByInventoryId, addNewClassification, addNewVehicle, updateInventory, deleteInventoryItem, addToCart};
