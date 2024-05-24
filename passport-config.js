const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
 
  const authenticateUser = async (email, password, done) => {
    console.log("email: " + email)
    const user =  await getUserByEmail(email)
    console.log("User: " + user)
    if (!user) {
      return done(null, false, { message: 'No user with that email' })
    }
  
    try {
      if (await bcrypt.compare(password, user.password)) {
        console.log("pasp-config: " + user)
        return done(null, user)
      } else {
        console.log("Password incorrect")
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      console.log("Error: " + e)
      return done(e)
    }
  }
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))

  passport.serializeUser((user, done) => {
    console.log("Uslo 1 " + user.id)
    done(null, user.id); 
  });
  
  passport.deserializeUser(async (id, done) => {
    console.log("Uslo 2")
    try {
      const user = await getUserById(id);
      done(null, user);
  } catch (err) {
      done(err, null);
  }
  });
}


module.exports = initialize