const mongoose = require('mongoose')

const { ObjectId } = mongoose.Schema.Types

const postSchema= mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    picture:{
        type: String,
        required:true
    },
    postedBy:{
        type: ObjectId,
        ref:'Users'
    },
    likes:[{
        type:ObjectId,
         ref:'Users'
    }],
    comments:[{
        text:String,
        postedBy:{
            type: ObjectId,
            ref:'Users'
        }
    }]
})

mongoose.model("Post", postSchema)
