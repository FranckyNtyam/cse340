const pool = require("../database/index.js")

/* ***************************
* Get all data from classification table
****************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
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


/*******************************
 * Check for existing name
 ******************************* */
async function checkExistingName(classification_name){
    try {
        const sql = "SELECT * FROM public.classification WHERE classification_name =$1"
        const name = await pool.query(sql, [classification_name])
        return name.rows
    } catch (error){
        return error.message
    }
}

async function addNewVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
    try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])

    return data.rows
} catch(error) {
    return error.message
}
}


module.exports = {getClassifications, getInventoryByClassificationId, getVehiclesDetailsByInventoryId, addNewClassification,checkExistingName, addNewVehicle};
