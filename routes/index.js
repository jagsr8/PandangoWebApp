var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require("mysql");
var passport = require('passport');
var flash = require('connect-flash');

router.use(session({
    secret            : 'pandangogo',
    resave            : false,
    saveUninitialized : false
})); // session secret
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions
router.use(flash()); // use connect-flash for flash messages stored in session

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


require('../config/passport')(passport, con);


/**
 *Code to Ping the database and keep connection awake
 *
 **/
setInterval(function () {
    con.query('SELECT 1');
}, 5000);


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
      	if (rows[0].password === password && rows[0].userStatus !== 'ban') {
      		var major = rows[0].major;
      		con.query('UPDATE users SET loginStatus = ? Where username = ?', [1, username], function(err, result) {
      			if (err) {
      				console.print(err);
      			} else {

      				res.send(rows);
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
          var newUser = {name: req.body.name, username: req.body.username, password: req.body.password, loginStatus: 0, major: '', bio: '', userType: 'user', userStatus: 'active', email: req.body.email};
          con.query('INSERT INTO users SET ?', newUser, function(err, res){
            if (err) {
              console.log(err);
            } else {

              response.send('user added sucessfully!');
            }

          });
        } else {
          response.send(rows);
        }
      }
  });
});

router.get('/getUserIds', function(req, response){
	con.query('SELECT * FROM users', function(err, rows){
		if (err) {
			console.log(err);
		} else {
			response.send(rows);
		}
	});
});

router.post('/addRating', function(req, response) {
    var newRating = {username: req.body.username, movie_name: req.body.moviename, rating: req.body.rating, major: req.body.major};
   
    var sql = "SELECT * FROM personmovierate WHERE username = '" + newRating.username + "' AND movie_name = '" + newRating.movie_name + "'";
    
    con.query(sql, function(err, rows){
    	if (err) {
    		
    		console.log(err);
    	} else {
    		
    		if (rows.length === 0) {
    			con.query('INSERT INTO personmovierate SET ?', newRating, function(err, res){
			        if (err) {
			          console.log(err);
			        } else {
			     	  response.send('Movie rating added!');
			        }
			    });
    		} else {
    			var sql2 = "UPDATE personmovierate SET rating = '" + newRating.rating + "' WHERE username = '" + newRating.username + "' AND movie_name = '" + newRating.movie_name + "'";
    			con.query(sql2, function(err, res){
    				if (err) {
			          console.log(err);
			        } else {
			          response.send('Movie rating updated!');
			        }
    			});
    		}
    	}
    });
});

router.post('/getCurrRating', function(req, res){
	var movieName = req.body.moviename;
	
	var sql = "SELECT * FROM movieaveragerating WHERE movie_name = '" + movieName + "'";
	console.log(sql);
	con.query(sql, function(err, rows){
    	if (err) {
    		console.log(err);
    	} else {
    		console.log('Inside');
    		if (rows.length === 0) {
    			res.send('No data');
    		} else {
    			console.log(rows);
    			res.send(rows);
    		}
    	}
    });
});

router.post('/updateAverage', function(req, response) {
	var movieName = req.body.moviename;
	var rat = req.body.rating;
	var currNumOfRates = req.body.numOfRates;
    var sql = "SELECT * FROM movieaveragerating WHERE movie_name = '" + movieName + "'";
    console.log(sql);
    con.query(sql, function(err, rows){
    	if (err) {
    		console.log(err);
    	} else {
    		if (rows.length === 0) {
    			var newMovieAverage = {movie_name: movieName, rating: rat, num_of_ratings: 1};
    			con.query('INSERT INTO movieaveragerating SET ?', newMovieAverage, function(err, res){
			        if (err) {
			          console.log(err);
			        } else {
			     	  response.send('Movie rating added!');
			        }
			    });
    		} else {
    			var sql2 = "UPDATE movieaveragerating SET rating = '" 
    						+ rat 
    						+ "', num_of_ratings = '" 
    						+ currNumOfRates 
    						+ "' WHERE movie_name = '" 
    						+ movieName 
    						+ "'";
    			con.query(sql2, function(err, res){
    				if (err) {
			          console.log(err);
			        } else {
			          response.send('Movie rating updated!');
			        }
    			});
    		}
    	}
    });
});

router.get('/returnEmail/:username', function(req, res){
  var un = req.params.username;
  con.query('SELECT * FROM users WHERE username = ?', un, function(err, rows){
    if (err) {
      console.log(err);
    } else {
      if (rows.length === 0) {
        res.send('no current user');
      } else {
        res.send(rows);
      }
    }
  });
});

router.get('/getMovieByMajor/:major', function(req, res){
	var major = req.params.major;
	con.query('SELECT * FROM personmovierate WHERE major = ? ORDER BY rating DESC ', major, function(err, rows){
		if (err) {
			console.log(err);
		} else {
			if (rows.length === 0) {
				res.send('No current data related to your major');
			} else {
				res.send(rows);
			}
		}
	});
});

router.post('/changeUserStatusBan/:username', function(req, res){
	var username = req.params.username;
	var ban = 'ban';
	con.query('UPDATE users SET userStatus = ? WHERE username = ?', [ban, username], function(err, result){
		if (err) {
			console.log(err);
		} else {
			res.send('ban successful');
		}
	});
});

router.post('/changeUserStatusUnlock/:username', function(req, res){
	var username = req.params.username;
	var ban = 'active';
	con.query('UPDATE users SET userStatus = ? WHERE username = ?', [ban, username], function(err, result){
		if (err) {
			console.log(err);
		} else {
			res.send('unlock successful');
		}
	});
});

/**
 * A route to change the profile that is password, Major and Bio
 *
 **/
router.post('/editProfile/:username/', function(req, res){
  var username = req.params.username;
  //var password = req.params.password;
  con.query('UPDATE users SET Major = ? Where username = ?', [req.body.major, username], function (err, result) {
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


//////////////////////////
///  WEB API REQUESTS  ///
////////////////////////// 

router.post('/register', passport.authenticate('local-register', {
    successRedirect : '/home',
    failureRedirect : '/#login',
    failureFlash    : true
}));

router.post('/login', passport.authenticate('local-signin', {
    successRedirect : '/home',
    failureRedirect : '/#login',
    failureFlash    : true
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/', isLoggedOut, function(req, res) {
    res.render('splash', {
        signinError   : req.flash('signinError'),
        registerError : req.flash('registerError')
    });
});

router.get('/home', isLoggedIn, function(req, res) {
    res.render('home', {
        user : req.user
    });
});

router.get('/movie/:id', isLoggedIn, function(req, res) {
    res.render('movie_detail', {
        user     : req.user,
        movie_id : req.params.id
    });
});

router.get('/get_rating', function(req, res){
    var movieName = req.query.moviename;
    
    var sql = "SELECT * FROM movieaveragerating WHERE movie_name = '" + movieName + "'";
    console.log(sql);
    con.query(sql, function(err, rows){
        if (err) {
            console.log(err);
        } else {
            console.log('Inside');
            if (rows.length === 0) {
                res.end();
            } else {
                console.log(rows);
                res.send(rows[0]);
            }
        }
    });
});

router.get('/get_all_ratings', function(req, res){
    var movieName = req.query.moviename;
    
    var sql = "SELECT * FROM movieaveragerating";
    console.log(sql);
    con.query(sql, function(err, rows){
        if (err) {
            console.log(err);
        } else {
            console.log('Inside');
            if (rows.length === 0) {
                res.end();
            } else {
                console.log(rows);
                res.send(rows);
            }
        }
    });
});

router.post('/submit_rating', function(req, res) {
    var newRating = {username: req.user.username, movie_name: req.body.moviename, rating: req.query.rating, major: req.user.major};
    console.log("Submit: " + newRating.rating);
    var sql = "SELECT * FROM personmovierate WHERE username = '" + newRating.username + "' AND movie_name = '" + newRating.movie_name + "'";
    
    con.query(sql, function(err, rows){
        if (err) {
            
            console.log(err);
        } else {
            
            if (rows.length === 0) {
                con.query('INSERT INTO personmovierate SET ?', newRating, function(err, result){
                    if (err) {
                      console.log(err);
                    } else {
                      res.end();
                    }
                });
            } else {
                var sql2 = "UPDATE personmovierate SET rating = '" + newRating.rating + "' WHERE username = '" + newRating.username + "' AND movie_name = '" + newRating.movie_name + "'";
                con.query(sql2, function(err, response){
                    if (err) {
                      console.log(err);
                    } else {
                      res.end();
                    }
                });
            }
        }
    });
});

router.post('/update_average', function(req, res) {
    var movieName = req.body.moviename;
    var rat = req.body.rating;
    var currNumOfRates = req.body.numOfRates;
    console.log("Update: " + rat);
    var sql = "SELECT * FROM movieaveragerating WHERE movie_name = '" + movieName + "'";
    console.log(sql);
    con.query(sql, function(err, rows){
        if (err) {
            console.log(err);
        } else {
            if (rows.length === 0) {
                var newMovieAverage = {movie_name: movieName, rating: rat, num_of_ratings: 1};
                con.query('INSERT INTO movieaveragerating SET ?', newMovieAverage, function(err, response){
                    if (err) {
                      console.log(err);
                    } else {
                      res.send('Movie rating added!');
                    }
                });
            } else {
                var sql2 = "UPDATE movieaveragerating SET rating = '" 
                            + rat 
                            + "', num_of_ratings = '" 
                            + currNumOfRates 
                            + "' WHERE movie_name = '" 
                            + movieName 
                            + "'";
                con.query(sql2, function(err, response){
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

router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
        user : req.user
    });
});

router.post('/edit_profile', function(req, res) {
    con.query('UPDATE users SET name = ?, username = ?, major = ?, bio = ? WHERE username = ?', [req.body.name, req.body.username, req.body.major, req.body.bio, req.body.username], function (err, result) {
        if (err){
            res.send(err);
        } else {
            res.end();
        }
    });
});

router.get('/settings', isLoggedIn, function(req, res) {
    res.render('settings', {
        user : req.user
    });
});

router.post('/change_password', function(req, res) {
    con.query('SELECT password FROM users WHERE username = ? LIMIT 1', req.user.username, function (err, result) {
        if (err){
            res.send(err);
        } else if (result == req.body.old_password && req.body.new_password == req.body.confirm_password) {
            con.query('UPDATE users SET password = ? WHERE username = ?', [req.body.new_password, req.user.username], function (err, result) {
                if (err){
                    res.send(err);
                } else {
                    res.end();
                }
            });
        }
    });
});

router.get('/users', isAdmin, function(req, res) {
    con.query('SELECT id, name, userStatus FROM users', function (err, result) {
        if (err){
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

router.post('/ban_user', isAdmin, function(req, res) {
    con.query('UPDATE users SET userStatus = "ban" WHERE id = ?', [req.body.id], function (err, result) {
        if (err){
            res.send(err);
        } else {
            res.end();
        }
    });
});

router.post('/unlock_user', isAdmin, function(req, res) {
    con.query('UPDATE users SET userStatus = "active" WHERE id = ?', [req.body.id], function (err, result) {
        if (err){
            res.send(err);
        } else {
            res.end();
        }
    });
});

router.get('/random', isLoggedIn, function(req, res) {
    res.redirect('/home');
    // res.render('movie_detail', {
    //     user  : req.user
    //     movie : 
    // });
});

router.get('/:string', isLoggedIn, function(req, res) {
    res.redirect('/home');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the splash page
    res.redirect('/');
}

// route middleware to make sure a user is logged out
function isLoggedOut(req, res, next) {

    // if user is authenticated in the session, redirect to home page 
    if (req.isAuthenticated())
        res.redirect('/home');

    // if they aren't, carry on
    return next();
}

// route middleware to make sure a user is an admin
function isAdmin(req, res, next) {

    // if user is an admin, carry on 
    if (req.user.userType == 'admin')
        return next();

    // if they aren't, return error
    res.send("Not Admin.");
}


/*con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});*/
module.exports = router;
