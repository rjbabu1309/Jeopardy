var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');

var models = require('../models');
var Sequelize = require('sequelize');

const insertDataController = {
    getData(req, res) {
        res.render('game/insertData')
    },
    postData(req, res) {

        const category = req.body.category;
        console.log(category);
        switch (category) {
            case 'Editorial': models.Editorial.create({
                                clue: req.body.clue,
                                ans: req.body.ans,
                                value: req.body.val,
                            }).then(function () {
                                console.log("Success fully inserted")
                                res.render('game/insertData')
                            });
                            break;
            case 'Technology': models.Technology.create({
                                clue: req.body.clue,
                                ans: req.body.ans,
                                value: req.body.val,
                            }).then(function () {
                                console.log("Success fully inserted")
                                res.render('game/insertData')
                            });
                            break;
            case 'Sports': models.Sports.create({
                                clue: req.body.clue,
                                ans: req.body.ans,
                                value: req.body.val,
                            }).then(function () {
                                console.log("Success fully inserted")
                                res.render('game/insertData')
                            });
                            break;
            case 'Trailers': models.Trailers.create({
                                clue: req.body.clue,
                                ans: req.body.ans,
                                value: req.body.val,
                            }).then(function () {
                                console.log("Success fully inserted")
                                res.render('game/insertData')
                            });
                            break;
        }
    }
}

module.exports = insertDataController;