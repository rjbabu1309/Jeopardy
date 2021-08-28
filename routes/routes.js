const express = require('express');
const router = express.Router();

const accountController = require('../controller/account_controller');
// var AccountRoutes = require('./controllers/account_controller');
const insertDataController = require('../controller/inserData_controller');

router.get('/', (req, res)=>{
    res.render('home',{ title: 'Express', username:  req.session.username, loggedIn:req.session.loggedIn});
})

//Login
router.get('/login', accountController.getLogin)
router.post('/login', accountController.postLogin)

// Register
router.get('/register', accountController.getRegister)
router.post('/register', accountController.postRegister)

//Logout
router.get('/logout', accountController.logout)

router.get('/dash', (req, res)=>{
    res.render('dash',{username: req.session.username});
})

// Game Home Page
router.get('/play', (req, res) => {
    res.render('game/game');
})

// Data Insert to the respective tables
router.get('/insert', insertDataController.getData)
router.post('/insert', insertDataController.postData)


module.exports = router;