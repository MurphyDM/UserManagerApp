var mysql = require('mysql2');
var dbconfig = require('./database');
const date = require('./date');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

function getUsersInfo(res, start, end) {
    connection.query("SELECT * FROM users", function(err, users) {
        if (err) return err;
        if (!(Object.keys(users).length < start))
            res.render("profile.ejs", {
                users: users,
                start: start,
                end: end
            });
    })
}

function getStatus(req, res) {
    connection.query("SELECT status FROM users WHERE id = ?", [req.user.id], function(err, status) {
        if (err) return err;
        res.json(status[0]["status"]);
    });
}

function changeUserStatus(users, status, req) {
    users.forEach(id => {
        connection.query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
    });
}

function setLastSigninDate(req) {
    connection.query("UPDATE users SET last_sign_in_date = ? WHERE id = ?", [date.getDateString(), req.user.id]);
}

function logoutUser(req) {
    req.logout();
    res.redirect('/');
}

function checkUserActivity(id, req) {
    if (id == req.user.id)
        logoutUser(req);
}

function deleteUser(users, req) {
    users.forEach(id => {
        connection.query("DELETE FROM users WHERE id = ?", [id]);
        checkUserActivity(id, req);
    });

}

module.exports = {
    getUsersInfo,
    changeUserStatus,
    deleteUser,
    setLastSigninDate,
    getStatus
}