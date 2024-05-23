if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config() //loading .env file to process.env from where we can access KEY and VALUE pairs
}

const express = require ('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const passport = require('passport') //authentication middleware 
const flash = require('express-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override')
const initializePassport = require('./passport-config.js')
const mongoose = require('mongoose')
const User = require("./models/signIn");

const store = MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    collectionName: 'mySessions',
    ttl: 14 * 24 * 60 * 60, // 14 days
    autoRemove: 'native'
});

app.use(cors({
    //origin: 'http://localhost:3000', 
    origin: 'https://it-bookiraj-frontend.vercel.app',
    credentials: true
  }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { maxAge: 30000 }
}))

initializePassport(passport, 
    email => User.findOne({ email }),  // Using findOne() instead of find() to find a single document
    id =>  User.findById(id)
)

app.use(flash())

app.use(passport.session())
app.use(passport.initialize())

const signInRouter = require('./routes/signIn')
const logInRouter = require('./routes/logIn')

app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(methodOverride('_method'))

mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', ()=>{console.log('Connected to Mongoose')})

app.use('/signUp',signInRouter)
app.use('/logIn',logInRouter)

app.get('/', (req,res)=>{
    res.json({message:"First message"})
})

app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });
});

app.listen(process.env.PORT || 8080)

 


