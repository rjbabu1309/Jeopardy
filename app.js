const path = require('path');
const http = require('http');
const express = require('express');
// const socketio = require('socket.io');
var bodyParser = require('body-parser');

const models = require('./models')
const session = require('express-session')
const routes = require('./routes/routes')

// const formatMessage = require('./utils/messages');
// const {
//   userJoin,
// //   getCurrentUser,
// //   userLeave,
// //   getRoomUsers
// } = require('./public/js/script');

const app = express();
const server = http.createServer(app);
// const io = socketio(server);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// app.get('/', function(req, res) {
//     res.render('home');
// })

app.use(session({

    // It holds the secret key for session
    secret: 'TheSecret',

    // Forces the session to be saved
    // back to the session store
    resave: true,

    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true
}))



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


const websocketServer = require("websocket").server;
const { response } = require('express');
const httpServer = http.createServer();
httpServer.listen(9001, () => console.log("Listening.. on 9001"))

//Hashmap
const clients = {};
const games = {};
var currClient;

const wsServer = new websocketServer({
    "httpServer": httpServer
})

wsServer.on("request", request => {
    //connect
    var time = 60;
    var timmer = {};
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("opened!"))
    connection.on("close", () => console.log("closed!"))
    connection.on("message", message => {

        //I have received a message from the client

        const result = JSON.parse(message.utf8Data)


        //a user want to create a new game
        if (result.method === "create") {
            const clientId = result.clientId;

            //   const gameId = guid();
            // turn = clientId;
            const gameId = "12345";
            games[gameId] = {
                "id": gameId,
                "clients": []
            }

            const payLoad = {
                "method": "create",
                "game": games[gameId]
            }

            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }

        //a client want to join

        else if (result.method === "join") {
            const clientId = result.clientId;
            const gameId = result.gameId;
            let game = games[gameId];
            // timmer[clientId] = { time: 60, active: false };
            console.log(game);
            if (game.clients.length >= 3) {
                //Sorry max players reach
                console.log("max user reached");
                return;
            }
            const color = { "0": "Red", "1": "Blue", "2": "Green" }[game.clients.length]
            game.clients.push({
                "clientId": clientId,
                "color": color,
                "score": 0,
            })
            const payLoad = {
                "method": "join",
                "game": game
            }
            // console.log(game);

            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            });
        }

        //a user plays
        else if (result.method === "start") {
            // const clientId = result.clientId;
            const currClient = result.clientId;
            const game = games["12345"];
            // const currClient = games['12345'].clients[0];
            game.clients.forEach(c => {
                timmer[c.clientId] = { time: 60, active: false };
            });
            timmer[currClient].active = true;

            console.log(clientId, games);
            const interval = setInterval(() => {
                const payLoad = {
                    "method": "start",
                    "time": timmer,
                    // "currClient":currClient,
                }

                // timmer[currClient].active = true;
                // const game = games['12345'];
                game.clients.forEach(c => {
                    clients[c.clientId].connection.send(JSON.stringify(payLoad))
                });
                timmer[currClient].time--;
                if (timmer[currClient].time < 0) {
                    clearInterval(interval);
                }
            }, 1000);
        }
    })



    //generate a new clientId
    const clientId = guid();
    clients[clientId] = {
        "connection": connection
    }

    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }
    //send back the client connect
    connection.send(JSON.stringify(payLoad))

})



function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();



// Routes
app.use(routes);


const PORT = process.env.PORT || 9000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


module.exports = app;
