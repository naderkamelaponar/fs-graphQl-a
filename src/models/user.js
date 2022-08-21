/** بسم الله الرحمن الرحيم */
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        minLength:5
    },
    password:{
        type:String,
        required:true,
    },
    favouriteGenre: {
        type:String,
        required:true,
        minLength:3
      }
})
module.exports = mongoose.model('User',schema)