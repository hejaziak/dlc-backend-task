var express = require('express');
var router = express.Router();
var createError = require('http-errors');

const postsController = require('../controllers/postsController')

/* GET home page. */
router.post('/', (req, res, next) => {
    // console.log(req.body.mentions)
    postsController.createPost(req.body).then(response => {
        console.log(response)
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

router.get('/recent', (req, res, next) => {
    // console.log(req.body.mentions)
    postsController.getRecent(req.body).then(response => {
        console.log(response)
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

module.exports = router;