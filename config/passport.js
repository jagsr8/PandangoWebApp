// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// expose this function to our app using module.exports
module.exports = function(passport, con) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user[0].username);
    });

    // used to deserialize the user
    passport.deserializeUser(function(username, done) {
        con.query('SELECT * FROM users WHERE username = ? LIMIT 1', username, function(err, user){
            done(err, user[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    passport.use('local-register', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        // asynchronous
        process.nextTick(function() {

            var usernamePatt = /^[a-zA-Z0-9_-]{4,10}$/;
            var passwordPatt = /^[a-zA-Z0-9]{6,16}$/;

            // Begin validation
            if (req.body.first_name == "") {
                return done(null, false, req.flash('registerError','Please enter a valid first name.'));
            } else {
                if (req.body.last_name == "") {
                    return done(null, false, req.flash('registerError','Please enter a valid last name.'));
                } else {
                    if (!usernamePatt.test(req.body.username)) {
                        return done(null, false, req.flash('registerError','Please enter a valid username.'));
                    } else {
                        if (!passwordPatt.test(req.body.password)) {
                            return done(null, false, req.flash('registerError','Please enter a valid password.'));
                        } else {
                            if (req.body.password !== req.body.password_confirm) {
                                return done(null, false, req.flash('registerError','Password does not match.'));
                            } else {

                                con.query('SELECT * FROM users WHERE username = ?', req.body.username, function(err, rows){
                                    if (err) {
                                        return done(err); 
                                    } else if (rows.length === 0) {
                                        var newUser = {
                                            name        : req.body.first_name + " " + req.body.last_name,
                                            username    : req.body.username,
                                            password    : req.body.password,
                                            loginStatus : 0,
                                            major       : '',
                                            bio         : '',
                                            userType    : 'user',
                                            userStatus  : 'active'
                                        };
                                        con.query('INSERT INTO users SET ?', newUser, function(err, res){
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                return done(null, [newUser]);
                                            }
                                        });
                                    } else {
                                        return done(null, false, req.flash('registerError','Username has already been taken.'));
                                    }
                                });

                            }
                        }
                    }
                }
            }
            

        });

    }));

    passport.use('local-signin', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        if (req.body.username == "") {
            return done(null, false, req.flash('signinError','Please enter a valid username.'));
        } else {
            if (req.body.password == "") {
                return done(null, false, req.flash('signinError','Please enter a valid password.'));
            } else {
                con.query('SELECT * FROM users WHERE username = ? LIMIT 1', username, function(err, user){
                    if (err) {
                        return done(err);
                    } else if (!user[0]) {
                        return done(null, false, req.flash('signinError','Incorrect username.'));
                    } else if (user[0].password !== password) {
                        console.log(user.password);
                        console.log(password);
                        return done(null, false, req.flash('signinError','Incorrect password.'));
                    }
                    return done(null, user);
                });
            }
        }
    }));

};