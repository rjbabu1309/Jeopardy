// const { disabled } = require("../../app");

document.addEventListener('DOMContentLoaded', (event) => {
    //the event occurred

    let clientId = null;
    
    let gameId = null;
    let gameCreated = false;
    let ws = new WebSocket("ws://localhost:9001/")


    categories = [];
    clues = {};

    //State
    currentClue = null;
    score = 0;
    

    const btnCreate = document.getElementById("btnCreate");
    const btnJoin = document.getElementById("btnJoin");
    const textGameId = document.getElementById("txtGameId");
    const divPlayers = document.getElementById("divPlayers");
    const timeElement = document.getElementById("time");
    const startElement = document.getElementById("start");
    
    startElement.addEventListener("click", e => {

        const payLoad = {
            "method": "start",
            "clientId": clientId,
        }
        ws.send(JSON.stringify(payLoad))
    })
    btnJoin.addEventListener("click", e => {
        if (gameId === null)
            gameId = textGameId.value;
        const payLoad = {
            "method": "join",
            "clientId": clientId,
            "gameId": gameId,
        }
        console.log(clientId);
        ws.send(JSON.stringify(payLoad))
    })

    btnCreate.addEventListener("click", e => {
        gameCreated = true;
        const payLoad = {
            "method": "create",
            "clientId": clientId
        }
        ws.send(JSON.stringify(payLoad))
    })
    ws.onopen = function (e) {
        console.log('WS connection open');
    }
    ws.onerror = function (e) {
        console.log('onerror', e);
        // webSocket.close();
    }
    ws.onclose = function (e) {
        console.error('WS closed unexpectedly', e);
        // setTimeout(function() {
        //   // connectWS();
        // }, 5000);
    };
    ws.onmessage = message => {
        //message.data
        console.log('*********', message.data);
        const response = JSON.parse(message.data);
        //connect
        if (response.method === "connect") {
            clientId = response.clientId;
            console.log("Client id Set successfully" + clientId);
        }
        else if (response.method === "create") {
            gameId = response.game.id;
            console.log("game successfully created with id" + response.game.id + " with " + response.game.balls + " balls");
            
        }
        else if (response.method === "join") {
            gameId = response.game.id;
            score = response.game.score;
            time = response.game.time;
            const game = response.game;

            while (divPlayers.firstChild) {
                divPlayers.removeChild(divPlayers.firstChild)
            }

            game.clients.forEach(c => {
                const d = document.createElement("div");
                d.style.width = "300px";
                d.style.margin = "20px";
                d.style.backgroundColor = c.color;
                d.style.float = "left";

                d.textContent = c.clientId + "has been joined \n Score : " + c.score;

                divPlayers.appendChild(d);
            });
        }
        else if (response.method === "start") {

            // currClient = response.currClient;
            const timeobj = response.time;
            console.log(timeobj);
            const keys = Object.keys(timeobj);
            // let activeUser = {};
            let activeClientId = "";

            for (let i = 0; i < keys.length; i++) {
                // console.log(timeobj[keys[i]].time)
                // console.log(currClientId)
                if (timeobj[keys[i]].active) { // timeobj[keys[i]] && 
                    // activeUser = timeobj[keys[i]];
                    activeClientId = keys[i];
                    time = timeobj[keys[i]].time;
                }
            }
            eventEmitter.emit('GAME_START', {
                active: activeClientId === clientId ? true: false,
            });
            if (activeClientId === clientId) {
                timeElement.textContent = `My Time: ${time}`;
            }
            else {
                timeElement.textContent = `Opponent Time: ${time}`;
            }
        }
    }
})

