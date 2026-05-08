const mongoose = require('mongoose')


const connectDb = async()=>{
    try{
       await mongoose.connect(process.env.MONGO_URI)
        console.log('connected db')
    }
    catch(err){
        console.log(err.message

        )
    }
}


module.exports = connectDb