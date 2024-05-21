const express = require('express');
const router = express.Router();
const User = require("../models/signIn");
const bcrypt = require('bcrypt')


router.get('/', (req, res) => {
    console.log("Session: " + JSON.stringify(req.session.passport))
    res.send(req.user);const express = require('express');
    const router = express.Router();
    const User = require("../models/signIn");
    const bcrypt = require('bcrypt')
    
    
    router.get('/', (req, res) => {
        console.log("Session: " + JSON.stringify(req.session.passport))
        res.json({ message: "hello  " + req.user});
    });
    /* 
    router.post('/', passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash: true
    })) */
    
    /* router.delete('/logout', (req,res)=>{
        req.logOut()
        req.redirect('/login')
    }) */
    
    router.post('/', async (req, res) => {
        console.log("userName: " + req.body.userName + " email: " + req.body.email + " password: " + req.body.password + " server")
    
        const existingUser = await User.findOne({email:req.body.email})
    
        if(existingUser)
        {
            console.log("existing User: " + existingUser)
            return res.status(400).json({ error: "Email already taken" });
        }
    
        const user = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10)
        });
    
        console.log("User: " + user.userName + " server")
    
        try {
            const newUser = await user.save();
            console.log("newUser: " + newUser);
            res.status(201).json(newUser); // Send the new user data back to the client
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "An error occurred while creating user" });
        }
    });
    
    router.get('/allUsers', async (req,res) => {
        try{
            const users = await User.find()
            if(users != null){
                console.log(users)
                res.send({"users":users});
                console.log("Session data from all users", req.session);
            }
            else{
                console.log("No users saved in db!")
            }
            
        }catch(error){
            console.error(error)
        }
    } )
    
    
    /* function checkNonAuthenticted(req, res, next){
        if(req.isAuthenticated()){
            return res.redirect('/')
        }
    
        next()
        
    }
     */
    module.exports = router;
});
/* 
router.post('/', passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash: true
})) */

/* router.delete('/logout', (req,res)=>{
    req.logOut()
    req.redirect('/login')
}) */

router.post('/', async (req, res) => {
    console.log("userName: " + req.body.userName + " email: " + req.body.email + " password: " + req.body.password + " server")

    const existingUser = await User.findOne({email:req.body.email})

    if(existingUser)
    {
        console.log("existing User: " + existingUser)
        return res.status(400).json({ error: "Email already taken" });
    }

    const user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10)
    });

    console.log("User: " + user.userName + " server")

    try {
        const newUser = await user.save();
        console.log("newUser: " + newUser);
        res.status(201).json(newUser); // Send the new user data back to the client
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while creating user" });
    }
});

router.get('/allUsers', async (req,res) => {
    try{
        const users = await User.find()
        if(users != null){
            console.log(users)
            res.send({"users":users});
            console.log("Session data from all users", req.session);
        }
        else{
            console.log("No users saved in db!")
        }
        
    }catch(error){
        console.error(error)
    }
} )


/* function checkNonAuthenticted(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }

    next()
    
}
 */
module.exports = router;
