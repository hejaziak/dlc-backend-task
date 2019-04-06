var express = require('express');
var router = express.Router();

const postsController = require('../controllers/postsController')

/* GET home page. */
router.post('/', (req, res, next) => {
  // console.log(req.body.mentions)
  res.json( postsController.createPost(req.body))
});

module.exports = router;
