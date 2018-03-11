var mysql = require('mysql');

var fs = require("fs");
var path = require("path");
var contents = fs.readFileSync(path.join(__dirname, '../../config', 'dbCredentials.json'));
var dbCredentials = JSON.parse(contents);
contents = fs.readFileSync(path.join(__dirname, '../../config', 'names.json'));
var databaseName = (JSON.parse(contents)).databaseName;

con = mysql.createConnection(dbCredentials);

con.query('CREATE DATABASE IF NOT EXISTS ' + databaseName, function (err, result) {
    console.log("Connected!");
    if (err) throw err;
    con.query('USE ' + databaseName, function (err, result) {
        if (err) throw err;
        con.query('CREATE TABLE IF NOT EXISTS users' +
            '(username VARCHAR(255), password VARCHAR(255), email VARCHAR(255), amount INT)', function (err, result) {
                if (err) throw err;
                else {
                    console.log("Database and table are ready to use");
                }
            });
    });
});

exports.getUserByCredentials = function (username, password, callback) {
    var sql = "SELECT * FROM users WHERE username='" + username + "' and password='" + password + "'";
    console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        else callback(null, result);
    });
}

exports.addUser = function (username, password, email, amount, callback) {
    var sql = "INSERT INTO users (username, password, email, amount) VALUES ?"
    var values = [[username, password, email, amount]];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        else {
            console.log("1 record inserted");
            callback(null, result);
        }
    });
}

exports.getAmount = function (username, callback) {
    var sql = "SELECT amount FROM users WHERE username='" + username + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        else callback(null, result);
    });
}

exports.transferMoney = function (src, dest, amountToTransfer, callback) {
    var sql = "UPDATE users SET amount=amount-" + amountToTransfer + " WHERE username='" + src + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        var sql2 = "UPDATE users SET amount=amount+" + amountToTransfer + " WHERE username='" + dest + "'";
        con.query(sql2, function (err, result) {
            if (err) throw err;
            else callback(null, result);
        });
    });
}