const express = require('express');
const router = express.Router();
var passport = require('passport');
const userController = require('../controllers/userControllers')
var createError = require('http-errors');



router.get('/:username', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    console.log(req.params)
    userController.getUser(req.params).then(users => {
        console.log(users)
        res.json(users)
    }).catch(err => {
        next(err)
    })

});


router.post('/login', async function(req, res, next) {
    const { username, password } = req.body;

    userController.login(username, password).then(response => {
        let { error } = response
        if (error) {
            let err = createError(error.status, error.text);
            next(err)
        } else {
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
        if (error) {
            let err = createError(error.status, error.text);
            next(err)
        } else {
            res.json(response)
        }

    }).catch(err => {
        next(err)
    })
});

module.exports = router;