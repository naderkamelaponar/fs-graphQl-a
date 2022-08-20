/** بسم الله الرحمن الرحيم */
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        minLength:5
    },
    born:{
        type:Number
    }
})
module.exports = mongoose.model('Author',schema)