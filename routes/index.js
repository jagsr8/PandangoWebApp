var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/:username', function(req, res) {
  //res.render('index', { title: 'Express' });
  res.send(req.params.username);
});

module.exports = router;
