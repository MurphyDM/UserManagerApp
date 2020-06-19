const userInfo = require("../config/users_info");

const MAX_NUMBER_USERS_ON_PAGE = 10;
let CURRENT_PAGE = 0;

module.exports = function(app, passport, usersInfo) {

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }

    function setLastSigninDate(req, res, next) {
        usersInfo.setLastSigninDate(req);
        return next();
    }

    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/signin', function(req, res) {
        res.render('signin.ejs', {
            message: req.flash('loginMessage')
        });
    });

    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.get('/profile', isLoggedIn, setLastSigninDate, function(req, res) {
        let start = CURRENT_PAGE * MAX_NUMBER_USERS_ON_PAGE;
        let end = start + MAX_NUMBER_USERS_ON_PAGE;
        usersInfo.getUsersInfo(res, start, end);
    });

    app.get('/profile/next', function(req, res) {
        CURRENT_PAGE++;
        res.redirect('/profile');
    });

    app.get('/profile/prev', function(req, res) {
        if (CURRENT_PAGE > 0) {
            CURRENT_PAGE--;
            res.redirect('/profile');
        }
    });

    app.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/status', function(req, res) {
        usersInfo.getStatus(req, res);
    });

    app.post('/signin', passport.authenticate('local-signin', {
            successRedirect: '/profile',
            failureRedirect: '/signin',
            failureFlash: true
        }),
        function(req, res) {
            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        });

    app.post('/signup', passport.authenticate('custom-signup', {
            successRedirect: '/signin',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        function(req, res) {
            res.redirect('/');
        }
    );

    app.post('/client/delete', function(req, res) {
        usersInfo.deleteUser(req.body, req);

    });

    app.post('/client/lock', function(req, res) {
        usersInfo.changeUserStatus(req.body, "blocked", req);
        res.redirect('/profile');
    });

    app.post('/client/unlock', function(req, res) {
        usersInfo.changeUserStatus(req.body, "active", req);
        res.redirect('/profile');
    });

};