const express = require('express');
const session = require('express-session');
const app = express();

const path = require("path");
const favicon = require("serve-favicon");

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const port = process.env.PORT || 3000;

const passport = require('passport');
const usersInfo = require('./config/users_info')
const flash = require('connect-flash');

app.use(favicon(path.join(__dirname, "views/img", "favicon.ico")));
app.use(express.static(path.join(__dirname, "views")));

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(session({
    secret: 'key',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport, usersInfo);

app.listen(port);
console.log('Port:  ' + port + '...');