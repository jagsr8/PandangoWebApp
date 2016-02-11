var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('User.db');

var username = "";
var password = "";

db.serialize(function() {
  console.log('creating table');
  db.run("CREATE TABLE if not exists Users (_id INTEGER, username TEXT, password TEXT)");
  console.log('table created');
  //var entry1 = db.prepare();
  //var entry2 = db.prepare("INSERT INTO Users (_id, username, password) VALUES (0, 'jagsr', 'password');");
  db.run("INSERT INTO Users VALUES(?, ?, ?)", (0, 'ganhari123', 'password'));
});


/* GET home page. */
router.get('/:username/:password', function(req, res) {
  //res.render('index', { title: 'Express' });
  db.serialize(function(){
    username = req.params.username;
    password = req.params.password;
    var sqlstat = "SELECT * FROM Users WHERE username = '";
    sqlstat = sqlstat.concat(username, "';");

    db.all("SELECT * FROM Users WHERE username=" + username, function(err, row){
      if (err) {
        res.send('User does not exist');
      } else {
        if (row.password === password) {
          res.send('0');
        } else {
          res.send('Password does not match!');
        }
      }
    });

    /*db.each(sqlstat, function(err, row) {
      
    });*/

  });
});

db.close();
module.exports = router;
