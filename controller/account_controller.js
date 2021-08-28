var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');

var session = require('express-session');

var models = require('../models');
var Sequelize = require('sequelize');
const bcrypt = require('bcrypt');


// const loggedIn = false;
// var accountRoutes = express.Router();

const accountController = {
    getLogin(req, res) {
        if (req.session.loggedIn) {
            res.redirect('/');
        }
        else
            res.render('accounts/login')
    },


    postLogin(req, res) {
        var matched_users_promise = models.User.findAll({
            where: Sequelize.and(
                { username: req.body.username },
                // {email: req.body.email}
            )
        })
        matched_users_promise.then(function (users) {
            if (users.length > 0) {

                let user = users[0];
                let passwordHash = user.password;
                if (bcrypt.compareSync(req.body.password, passwordHash)) {

                    req.session.username = req.body.username;
                    req.session.loggedIn = 'True';
                    res.redirect('/dash');
                }
                else {
                    res.redirect('/register');
                }
            }
            else {
                res.redirect('/login');
            }
        })
    },
    getRegister(req, res) {
        res.render('accounts/register', { errors: '' })
    },
    postRegister(req, res) {
        var matched_users_promise = models.User.findAll({
            where: Sequelize.or(
                { username: req.body.username },
                { email: req.body.email }
            )
        });
        matched_users_promise.then(function (users) {
            if (users.length == 0) {
                const passwordHash = bcrypt.hashSync(req.body.password, 10);
                models.User.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: passwordHash,
                    role : 'user',
                }).then(function () {
                    let newSession = req.session;
                    // newSession.loggedIn = 'True';
                    newSession.email = req.body.email;
                    res.redirect('/');
                });
            }
            else {
                res.render('accounts/register', { errors: "Username or Email already in user" });
            }
        })
    },
    logout(req, res) {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect('/');
            }
        });
    }

};

module.exports = accountController;
