const Product = require('../models/product')

const getProductSchemaKey = async ()=>{
    const productSchema = await Product.schema;
    let key=[]
    for(let k in productSchema.obj)
    key.push(k)
    return key
}



module.exports = getProductSchemaKey