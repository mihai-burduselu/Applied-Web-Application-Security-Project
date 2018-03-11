'use strict';

var database = require('../utils/db');

exports.login = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    database.getUserByCredentials(username, password, function (err, result) {
        if (err) res.send(err);

        if (result.length != 0) {
            var session = req.session;
            session.username = username;
        }
        res.send(result);
    });
}

exports.register = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var amount = req.body.amount;

    database.addUser(username, password, email, amount, function (err, result) {
        if (err) res.send(err);
        else res.redirect('/login');
    });
}
