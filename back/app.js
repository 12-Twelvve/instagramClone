// nodejs framework module
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000


// module to handle mongoDB
const mongoose = require('mongoose')
// dbconnection keys
const { MONGOURI } = require('./config/keys')


// schema models.
require('./models/user')
require('./models/post')
// how to use models: BY model name in schema
// mongoose.model("User12") 


// insert the route
app.use(express.json())  // kind of middleware to parse the data
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


// mongoDBConnection 
mongoose.connect(MONGOURI,{
    useUnifiedTopology: true,
    useNewUrlParser: true});
mongoose.connection.on('connected', ()=>{  //connected is keyword.
    console.log("MONGODB connected !!")
})
mongoose.connection.on('error', (error)=>(console.log("err ", error)))



if(process.env.NODE_ENV == 'production'){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*", (req, res)=>{
        res.sendFile(path.resolve(__dirname, 'client','build','index.html'))
    })
}


// listening to the port 
app.listen(PORT, ()=>{
    console.log('server is listening on', PORT)
})



// nodemon -globally to automate the restarting process of node
// b4Iv1pXsDd19MbGo -password mongo
// app.get('/',(req, res)=>res.send(" KINNG"))
// app.get('/profile',customMiddleWare ,(req, res)=>{res.send("hello profile")})
// const customMiddleWare = (req,res, next)=>{
//     console.log('this is middleware')
//     next()
// }
// // app.use(customMiddleWare)
