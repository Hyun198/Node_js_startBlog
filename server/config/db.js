const mongoose = require('mongoose');
const connectDB = async ()=>{
    try{
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.DATABASE_URI)
        console.log(`database connected: ${conn.connection.host}`)
    }catch (err){
        console.log(err);
    }
}

module.exports = connectDB;