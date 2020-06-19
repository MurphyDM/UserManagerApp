var LocalStrategy = require('passport-local').Strategy;
var CustomStrategy = require('passport-custom').Strategy;
var mysql = require('mysql2');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

const date = require('./date');
connection.query('USE ' + dbconfig.database);

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ", [id], function(err, rows) {
            done(err, rows[0]);
        });
    });

    passport.use('custom-signup', new CustomStrategy(
        function(req, done) {
            const username = req.body.username,
                email = req.body.email,
                password = req.body.password;

            let status = connection.query("SELECT * FROM users WHERE name = ?", [username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    let newUserMysql = {
                        username: username,
                        password: password,
                        email: email
                    };

                    let insertQuery = "INSERT INTO users ( name, email, password, sign_up_date, last_sign_in_date, status ) values (?,?,?,?,?,?)";
                    connection.query(insertQuery, [newUserMysql.username, newUserMysql.email, newUserMysql.password, date.getDateString(), '', 'active'], function(err, rows) {
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                    });
                }
            });
        }
    ));

    passport.use(
        'local-signin',
        new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true
            },
            function(req, username, password, done) {
                connection.query("SELECT * FROM users WHERE name = ?", [username], function(err, rows) {
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        return done(null, false, req.flash('loginMessage', 'User not found.'));
                    }
                    if (!(password == rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'Wrong login or password.'));


                    return done(null, rows[0]);
                });
            })
    );
};