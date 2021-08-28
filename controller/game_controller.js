

// var express = require('express');
// var bodyParser = require('body-parser');
// var ejs = require('ejs');
// var path = require('path');

// var session = require('express-session');

// var models = require('../models');
// var Sequelize = require('sequelize');


// const gameController = {
//     models.Editorials.create({
//         username: req.body.username,
//         email: req.body.email,
//         password: passwordHash
//     }).then(function(){
//         let newSession = req.session;
//         // newSession.loggedIn = 'True';
//         newSession.email = req.body.email;
//         res.redirect('/');
//     })
// }

// module.exports = gameController;







// io.on('connection', socket => {
//     socket.on('joinRoom', ({ username, room }) => {
//       const user = userJoin(socket.id, username, room);
  
//       socket.join(user.room);
  
//       // Welcome current user
//       socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));
  
//       // Broadcast when a user connects
//       socket.broadcast
//         .to(user.room)
//         .emit(
//           'message',
//           formatMessage(botName, `${user.username} has joined the chat`)
//         );
  
//       // Send users and room info
//       io.to(user.room).emit('roomUsers', {
//         room: user.room,
//         users: getRoomUsers(user.room)
//       });
//     });
  
//     // Listen for chatMessage
//     socket.on('chatMessage', msg => {
//       const user = getCurrentUser(socket.id);
  
//       io.to(user.room).emit('message', formatMessage(user.username, msg));
//     });
  
//     // Runs when client disconnects
//     socket.on('disconnect', () => {
//       const user = userLeave(socket.id);
  
//       if (user) {
//         io.to(user.room).emit(
//           'message',
//           formatMessage(botName, `${user.username} has left the chat`)
//         );
  
//         // Send users and room info
//         io.to(user.room).emit('roomUsers', {
//           room: user.room,
//           users: getRoomUsers(user.room)
//         });
//       }
//     });
//   });