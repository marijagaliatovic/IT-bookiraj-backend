const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require("../models/signIn");

router.get('/', (req,res) => {
    console.log("req.session.passport: " + req.session.passport)
    console.log("Is user authenticated after authentication:", req.isAuthenticated());
    //res.redirect('login/profile')
    res.send('Log')
})     

router.post('/', passport.authenticate('local', {
        failureFlash: true,
        successFlash:true
    }), (req, res) => {
         res.status(200).json(req.session);
        // Log session data 
        console.log("Is user authenticated after authentication:", req.isAuthenticated());
        console.log("Session data after authenticaytion:", req.session.passport.user);
    })

/* router.get('/profile', (req, res) => {
    res.send('Welcome to your profile: ' + JSON.stringify(req.session));
  }); */
    
router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId; 
    try {
        const user = await User.findById(userId);

        if (user) {
            console.log("User found:", user);
            res.status(200).json(user);
        } else {
            console.log("User not found.");
            res.status(404).json({ message: "User not found." });
        }
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ error: "An error occurred while retrieving the user from the database." });
    }
});

router.get('/status', (req, res) => {
  const isAut = isAuthenticated(req,res);
  console.log("isAut:" + isAut);
  if(!isAut){
    res.json({ authenticated: false, user: null });
  }
  else{
    console.log("User is authenticated " + req.user)
    res.json({ authenticated: isAut, user: req.user }); 
  }
  });

/* router.post('/logOut', (req,res) =>{
  req.logout(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }

    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Session destruction failed' });
      }
      
      res.clearCookie('connect.sid'); 
      return 
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
}) */
 

function isAuthenticated(req, res) {
    if (req.isAuthenticated()) {
      return true; // User is authenticated, proceed to the next middleware
    }
    //return res.status(401).json({ message: 'Unauthorized' }); 
    if(req.user != null){
      console.log("req.user" + req.user);
      return true;
    }
    return false;
  }
module.exports = router;