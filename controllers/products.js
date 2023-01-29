const Product = require('../models/product');
const getProductSchemaKey = require('../utils/productSchema');

const getAllProductsStatic = async (req,res) => {
    const products = await Product.find({}).sort('name')
    res.status(200).json({products,nbHits:products.length});
}

const getAllProducts = async (req,res) => {
    
    //getting the key from schema and filtering out the value from req.query
    // const keyArr = await getProductSchemaKey()
    // let queryObject = {}
    // keyArr.map((key)=>{
    //     console.log(key);
    //    if(req.query.hasOwnProperty(key)){
    //        if(key && key === 'featured'){
    //            queryObject[key] = req.query[key] === 'true'? true : false
    //        }else{
    //            queryObject[key] = req.query[key] 
    //        }
    //    }
    // })

    const {featured, company, name, sort, fields, numericFilters} = req.query;
    const queryObject = {}

    if(featured){
        queryObject.featured = featured === "true" ? true : false
    }

    if(company){
        queryObject.company = company
    }

    if(name){
        queryObject.name = {$regex: name, $options:'i'}
    }

        // numeric filtering; eg,- price>30, rating>=4 etc...
        if(numericFilters){
            const operatorMap = {
                ">":"$gt",
                ">=":"$gte",
                "=":"$eq",
                "<":"$lt",
                "<=":"$lte"
            }
            
            const regEx = /\b(<|>|=|>=|<=)\b/g
            let filters = numericFilters.replace(regEx, (match)=>`-${operatorMap[match]}-`)
    
            // options where numberic filter should apply
            const options = ['price','rating']
            filters.split(',').forEach(item => {
                const [field,operator,value] = item.split("-");
                if(options.includes(field)){
                    queryObject[field] = {[operator]: Number(value)}
                }
                // console.log(item);
            });
            console.log(filters);
            
        }
        console.log(queryObject);

  
    let result = Product.find(queryObject).setOptions({ strictQuery: false });
    //strictQuery: false - if query is not present in schema, then, mongoose will not by-pass and will result empty array = [] as query is not valid

    // sort
    if(sort){
        const sortList = sort.split(",").join(" ");
        result = result.sort(sortList)
    }else{
        result = result.sort('createdAt')
    }

    // select fields
    if(fields){
        const fieldsList = fields.split(",").join(" ")
        result = result.select(fieldsList)
    }

    // page,limit and skip - pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = ( page - 1 ) * limit

    result=result.skip(skip).limit(limit)


    const products = await result
    res.status(200).json({products,nbHits:products.length});
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}