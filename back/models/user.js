const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    followers:[{
        type:ObjectId,
         ref:'Users'
    }],
    following:[{
        type:ObjectId,
         ref:'Users'
    }],
    profile:{
        type:String,
        default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png'

    }
})

// not exporting approse
mongoose.model("Users", userSchema)
// what does schemas does ???
