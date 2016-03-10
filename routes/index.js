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


/**
 *Code to make the connection to the database
 *
 **/
con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});


/**
 *Code to Ping the database and keep connection awake
 *
 **/
setInterval(function () {
    con.query('SELECT 1');
}, 5000);


router.get('/', function(req, res) {
  res.render('splash')
});


/**
 * A route to check and log a user in and change login status
 *
 **/
router.get('/getLoginStatus/:username/:password', function(req, res){
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

/**
 * A route to Register a user if the username does not exist already
 *
 **/
router.post('/userRegistration', function(req, response){
  console.log(req.body.username);
  con.query('SELECT * FROM users WHERE username = ?', req.body.username, function(err, rows){
      if (err) {
           console.log(err); 
      } else {
        if (rows.length === 0) {
          var newUser = {name: req.body.name, username: req.body.username, password: req.body.password, loginStatus: 0, major: '', bio: ''};
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

router.post('/addRating', function(req, response) {
    var newRating = {username: req.body.username, movie_name: req.body.moviename, rating: req.body.rating};
    console.log('DEBUG!');
    con.query('SELECT * FROM personmovierate WHERE (username = ?) AND (movie_name = ?)', newRating.username, newRating.movie_name, function(err, rows){
    	if (err) {
    		
    		console.log(err);
    	} else {
    		console.log('ERRR');
    		if (rows.length === 0) {
    			con.query('INSERT INTO personmovierate SET ?', newRating, function(err, res){
			        if (err) {
			          console.log(err);
			        } else {
			     	  res.send('Movie rating added!');
			        }
			    });
    		} else {
    			con.query('UPDATE personmovierate SET rating = ? Where username = ? AND movie_name = ?', newRating.rating, newRating.username, newRating.movie_name, function(err, res){
    				if (err) {
			          console.log(err);
			        } else {
			          res.send('Movie rating updated!');
			        }
    			});
    		}
    	}
    });
});


/**
 * A route to change the profile that is password, Major and Bio
 *
 **/
router.post('/editProfile/:username/:password', function(req, res){
  var username = req.params.username;
  var password = req.params.password;
  con.query('UPDATE users SET password = ?, Major = ?, Bio = ? Where username = ?', [password, req.body.major, req.body.bio, username], function (err, result) {
        if (err){
          console.log(err); 
          throw err;
        } else {
          console.log(req.body.bio + req.body.major);
          res.send('Changed Password Sucessfully!');
        }
    }
  );
});

router.get('/showProfile/:un', function(req, res) {
  console.log('Hey!');
  var username = req.params.un;
  con.query('SELECT * FROM users WHERE username = ?', username, function(err, rows){
    if (err) {
      res.send('HELLO I AM ERRORING');
    } else {
      console.log("IN HERE");
      res.send(rows);
    }
  });

});


/**
 * A route to change the login status back after user logs out
 *
 **/
router.post('/changeLoginStatus/:username', function(req, res){
  var username = req.params.username;
  con.query('UPDATE users SET loginStatus = ? Where username = ?', [0, username], function(err, result){
    if (err) {
      console.log(err);
    } else {
      res.send('User successfully Logged out!');
    }
  });
});

router.get('/dispRecentRated/:username', function(req, response){
      var username = req.params.username;
      console.log(username);
      con.query('SELECT * FROM personmovierate WHERE username = ?', username, function(err, rows){
          if (err) {
            console.log(err);
          } else {
            console.log(rows);
            response.send(rows);
          }
      });
});

/*con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});*/
module.exports = router;
