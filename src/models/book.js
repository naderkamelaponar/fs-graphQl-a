/** بسم الله الرحمن الرحيم */
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        minLength:3
    },
    published:{
        type:Number
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
      },
    genres:{
        type:[
            {type:String}
        ]
    }
})
module.exports = mongoose.model('Book',schema)