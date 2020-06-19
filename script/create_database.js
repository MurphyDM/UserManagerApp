var mysql = require('mysql2');
var db = require('../config/database');

var connection = mysql.createConnection(db.connection);

connection.query('CREATE DATABASE ' + db.database);

connection.query('\
CREATE TABLE `' + db.database + '`.`' + db.users_table + '` ( \
    `id` INT AUTO_INCREMENT, \
    `name` VARCHAR(255), \
    `email` VARCHAR(255), \
    `password` VARCHAR(255), \
    `sign_up_date` VARCHAR(255), \
    `last_sign_in_date` VARCHAR(255), \
    `status` VARCHAR(255), \
    PRIMARY KEY (`id`) \
)');
connection.end();