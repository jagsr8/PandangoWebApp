var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();
app.use(express.bodyParser());
/* GET home page. */
router.get('/', function(req, res) {
  //res.render('index', { title: 'Express' });
  res.send(req.body);
});

module.exports = router;
