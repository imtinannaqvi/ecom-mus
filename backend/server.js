require('dotenv').config()


const app = require('./src/app')
const connectDb = require('./src/db/db')
const Port = process.env.PORT



connectDb()






app.listen(Port , ()=>{
    console.log(`server is running on port ${Port}`)
})