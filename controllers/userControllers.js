const { users } = require('../models');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;


module.exports ={
  createUser :async ({ username, firstname, lastname, email, password }) => { 
    return await users.create({ username, firstname, lastname, email, password });
  },
  getAllUsers : async () => {
    return await users.findAll();
  },
  getUser : async obj => {
    return await users.findOne({
    where: obj,
    });
  },
  login: async (username, password) => {
    if (username && password) {
      var user = await users.findOne({where: {username}});
      if (!user) {
        return({ error: 'username is incorrect' });
      }
      if (user.validPassword(password)) {
        var payload = { id: user.username};
        var token = jwt.sign(payload, 'secret');
        return ({ message: 'ok', token: token });
      } else {
        return({ error: 'Password is incorrect' });
      }
    }
  },
  signup: async ({ username, firstname, lastname, email, password }) => {
    let user = await users.findOne({where: {username}});
    console.log(user)
    if(user != null){
      console.log('ss')
      return(false,{error:'username is taken'})
    } else {
      let user = await users.findOne({where: {email}});
      if(user != null){
        return({error:'email is taken'})
      } else {
        users.create({ username, firstname, lastname, email, password }).then(user => {
          return({message:'successful'})
        }).catch( err => {
          console.log("heee")
          return({error:'Error saving the instance'})
        });
      }
    }

  }
}