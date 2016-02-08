var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/:username', function(req, res) {
  //res.render('index', { title: 'Express' });
  res.json(req.body);
});

module.exports = router;
