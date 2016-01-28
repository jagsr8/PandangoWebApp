var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('User.db');

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Users'",
       function(err, rows) {
  if(err !== null) {
    console.log(err);
  }
  else if(rows === undefined) {
    db.run("CREATE TABLE Users (_id INTEGER, user_name TEXT, password TEXT)", function(err) {
      if(err !== null) {
        console.log(err);
      }
      else {
        console.log("SQL Table 'bookmarks' initialized.");
      }
    });
  }
  else {
    console.log("SQL Table 'bookmarks' already initialized.");
  }
});

/* GET home page. */
router.get('/:id', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.json(req.body);
});

module.exports = router;
