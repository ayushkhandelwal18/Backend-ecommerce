class ApiFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    //searching ka system bnaya hai
    search(){
        const keyword = this.queryStr.keyword ? {
   name:{
         $regex:this.queryStr.keyword,
         $options:'i',//  i ka mtlb :case insensitive   
   },
        }:{};
         console.log(keyword);
        this.query = this.query.find({...keyword});
        return this;
    }

     //filter ka system bnaya hai ye
    filter(){
    const queryCopy = {...this.queryStr};

     console.log(queryCopy);
    //removing fields from the query
    const removeFields = ['keyword','limit','page'];

    removeFields.forEach(key => delete queryCopy[key]);
    
   //filter for price and rating , price to range me hogi
   
   let queryStr = JSON.stringify(queryCopy); 
   console.log(queryStr);
   queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key => `$${key}`);
   this.query = this.query.find(JSON.parse(queryStr));


   console.log(queryStr);
    return this;
}

//pagination lgana hai
pagination(productperpage){
    const currentPage = Number(this.queryStr.page) || 1;

    //hme kitne product skip krne honge
    //mano total 50 product hai or 10 page hai mtlb ek
    //page me 5 product hai to first page pe starting ke 5 product honge 
    //to secondpage ke liye hume 5 product skip krne honge
    const skip=productperpage*(currentPage-1);

    this.query = this.query.limit(productperpage).skip(skip);
    return this;
}

}

module.exports = ApiFeatures;