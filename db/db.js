const mysql = require('mysql');

const connection = mysql.createConnection({
    port: 3306,
    host: '127.0.0.1',
    user: "your_username",
    password: "your_password",
    database: 'employee_management',
});

module.exports = connection;