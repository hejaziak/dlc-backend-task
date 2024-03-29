const passport = require('passport');
const passportJWT = require("passport-jwt");
const { users } = require('../models');
const userController = require('../controllers/userControllers')

const ExtractJWT = passportJWT.ExtractJwt;


const JWTStrategy = passportJWT.Strategy;
passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'secret'
    },
    function(jwtPayload, cb) {

        //find the user in db if needed
        return users.findOne({ username: jwtPayload.username })
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));