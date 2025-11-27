let mongoose = require('mongoose')
let userSchema= mongoose.Schema({
    userName:{
        type:String

    },
    email:{
        type:String
    },
    passWord:{
        type:String
    },
    FullName:{
        type:String
    },
    role:{
        type:String,
        enum:['user','admin','instructor'],
        default:'user'                                                  
    },
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   // reference to user model
    }],
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   // reference to user model
    }],
    resetToken: String,
    resetTokenExpiry: Date,
    
})

let User=   mongoose.model("User",userSchema)
module.exports=User;