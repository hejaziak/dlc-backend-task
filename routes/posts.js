var express = require('express');
var router = express.Router();
var createError = require('http-errors');
const passport = require('passport')

const postsController = require('../controllers/postsController')

/* GET home page. */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    console.log(req.user.username)
    postsController.createPost({ content: req.body.content, username: req.user.username }).then(response => {
        let { error } = response
        if (error) {
            let err = createError(401, error);
            next(err)
        } else {
            res.json(response)
        }
    }).catch(err => {
        next(err)
    });
});

router.get('/recent', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    console.log(req.user)
    postsController.getRecent().then(response => {
        let { error } = response
        if (error) {
            let err = createError(error.status, error.text);
            next(err)
        } else {
            res.json(response)
        }
    }).catch(err => {
        next(err)
    });
});

router.get('/hashtag/:hashtag', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    console.log(req.params)
    postsController.getPostsByHashtag(req.params).then(response => {
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
    });
});


module.exports = router;