if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config() //loading .env file to process.env from where we can access KEY and VALUE pairs
}

const express = require ('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const passport = require('passport') //authentication middleware 
const flash = require('connect-flash')
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

app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 30000 }
}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

initializePassport(passport, 
    email => User.findOne({ email }),  // Using findOne() instead of find() to find a single document
    id =>  User.findById(id)
)

app.use((req, res, next) => {
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});

mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', ()=>{console.log('Connected to Mongoose')})

const signInRouter = require('./routes/signIn')
const logInRouter = require('./routes/logIn')

app.use('/signUp',signInRouter)
app.use('/logIn',logInRouter)

app.use(methodOverride('_method'))

app.get('/', (req,res)=>{
    res.json({message:"First message"})
})

app.post('/logout', (req, res, next) => {
    console.log('Logout route called');
    req.logout(err => {
        if (err) {
            console.error('Logout error:', err);
            return next(err);
        }
        req.session.destroy(err => {
            if (err) {
                console.error('Session destruction error:', err);
                return next(err);
            }
            res.clearCookie('connect.sid');
            if(!req.session){
                console.log('User logged out and session destroyed' + req.session);
                res.redirect('/');
            }
    
        });
    });
});

app.listen(process.env.PORT || 8080)

 


