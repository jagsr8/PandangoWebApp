var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var username = '';
var password = '';

var mysql = require("mysql");

// First you need to create a connection to the db
var con = mysql.createConnection({
  host: "us-cdbr-iron-east-03.cleardb.net",
  user: "b8c1a58913c797",
  password: "05ec03a0",
  database: "heroku_d5011e791776e3d"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

router.get('/:username/:password', function(req, res){
  username = req.params.username;
  password = req.params.password;
  con.query('SELECT * FROM users WHERE username = ?', username, function(err, rows){
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      res.send('USER DETECTED');
    }
  });
});

con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});
module.exports = router;
