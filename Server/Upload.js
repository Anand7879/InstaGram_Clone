let mongoose = require('mongoose')
let uploadSchema=mongoose.Schema({
    imgUrl:{
        type:String,
        require:true
    },
    likeCount:{
        type:Number,
        default:0
    },
    // LINKING USER SCHEMA
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   // reference to user model
        required: true
    }],
    likedBy: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",

}]

})



let Upload = mongoose.model('Upload',uploadSchema)
module.exports = Upload
