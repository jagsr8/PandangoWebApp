var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require("mysql");

//var lastRegisteredID = 2;


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

setInterval(function () {
    con.query('SELECT 1');
}, 5000);

router.get('/:username/:password', function(req, res){
  var username = req.params.username;
  var password = req.params.password;
  con.query('SELECT * FROM users WHERE username = ?', username, function(err, rows){
    if (err) {
      res.send('0');
    } else {
      console.log(rows);
      if (rows.length === 0) {
      	res.send('0');
      } else {
      	if (rows[0].password === password) {
      		con.query('UPDATE users SET loginStatus = ? Where username = ?', [1, username], function(err, result) {
      			if (err) {
      				console.print(err);
      			} else {
      				res.send(username);
      			}
      		});
      	} else {
        	res.send('0');
      	}
      }
    }
  });
});

router.post('/userRegistration', function(req, response){
  console.log(req.body.username);
  con.query('SELECT * FROM users WHERE username = ?', req.body.username, function(err, rows){
      if (err) {
           console.log(err); 
      } else {
        if (rows.length === 0) {
          var newUser = {name: req.body.name, username: req.body.username, password: req.body.password};
            con.query('INSERT INTO users SET ?', newUser, function(err, res){
                if (err) {
                  console.log(err);
                } else {

                  response.send('user added sucessfully!');
                }

            });
          } else {
            response.send('User already added');
          }
      }
  });
});

router.post('/editProfile/:username/:password', function(req, res){
  var username = req.params.username;
  var password = req.params.password;
  con.query('UPDATE users SET password = ? Where username = ?', [password, username],function (err, result) {
    if (err){
      console.log(err); 
      throw err;
    } else {
      console.log('Changed password!!');
      res.send('Changed Password Sucessfully!');
    }
  }
);
});

/*con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});*/
module.exports = router;
