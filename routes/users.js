const express = require('express');
const router = express.Router();
var passport = require('passport');
const userController = require('../controllers/userControllers')
const jwt = require('jsonwebtoken');
var createError = require('http-errors');


/* GET users listing. */
router.get('/',passport.authenticate('jwt', { session: false }), (req, res, next) => {
  userController.getAllUsers().then(users => {
    console.log(users)
    res.json(users)
  }).catch(err => {
    next(err)
  })

});

router.post('/', (req, res, next) => {
  console.log(userController)
  console.log(req.body)
  userController.createUser(req.body);
  res.json(users)

});

router.post('/login', async function(req, res, next) { 
  const { username, password } = req.body;
  
  userController.login(username,password).then(response =>{
    let {error} = response
    if(error){
      let err = createError(401,error);
      next(err)
    } else{
      res.json(response)
    }
  }).catch(err => {
    next(err)
  })
});

router.post('/signup', async function(req, res, next) { 

  userController.signup(req.body).then(response => {
    console.log(response)
    let { error } = response
    if(error){
      let err = createError(401, error);
      next(err)
    } else{
      res.json(response)
    }
    
  }).catch(err => {
    next(err)
  })
});

module.exports = router;