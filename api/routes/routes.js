'use strict';

module.exports = function (app) {

  var path = require("path");
  var authController = require('../controllers/authController');
  var usersController = require('../controllers/usersController');
  var db = require('../utils/db');

  app.route('/')
    .get(function (req, res) {
      var sess = req.session;
      if (sess.username) {
        res.sendFile(path.join(__dirname, '../../public', 'index.html'));
      } else {
        res.redirect('/login');
      }
    });

  app.route('/index.html')
    .get(function (req, res) {
      res.redirect("/");
    });

  app.route('/login')
    .get(function (req, res) {
      res.sendFile(path.join(__dirname, '../../public/login', 'login.html'));
    })
    .post(function (req, res) {
      authController.login(req, res)
    });

  app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/login');
      }
    });
  });

  app.route('/register')
    .get(function (req, res) {
      res.sendFile(path.join(__dirname, '../../public/register', 'register.html'));
    })
    .post(function (req, res) {
      authController.register(req, res);
    });

  app.route('/getAmount')
    .get(function (req, res) {
      usersController.getAmount(req, res);
    });
  app.route('/transferMoney')
    .get(function (req, res) {
      usersController.transferMoney(req, res);
    });

  app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
  });
};