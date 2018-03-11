'use strict';

var database = require('../utils/db');

function isAuthenticated(req) {
    return (req.session.username != null);
}

exports.getAmount = function (req, res) {
    if (!isAuthenticated(req)) {
        res.redirect('/login');
        return;
    }

    database.getAmount(req.session.username, function (err, result) {
        if (err) throw err;
        else res.send(result);
    });
}

exports.transferMoney = function (req, res) {
    if (!isAuthenticated(req)) {
        res.redirect('/login');
        return;
    }

    var destination = req.query.dest;
    var session = req.session;
    var amount = req.query.amount;

    database.transferMoney(session.username, destination, amount, function (err, result) {
        if (err) throw err;
        else res.send(result);
    });
}
