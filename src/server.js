import http from "http";
import Websocket from "ws";
import express from "express";
import { type } from "os";
import { parse } from "path";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public")); // share user what url
app.get("/", (req, res) => res.render("home")); // home.pug rendering
app.get("/*", (req, res) => res.redirect("/")); // catchall url (only use home url)

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app); // access to http server
const wss = new Websocket.Server({server}); // ws on http server (2 protocol)

const backSockets = []; // send from other sockets

wss.on("connection", (backSocket) => {
    backSockets.push(backSocket); // 한 브라우저에 연결 될 때 sockets에 넣어주기
    backSocket["nickname"] = "Anon" // give a nick, working on every browser
    console.log("connected browser 🍕");
    backSocket.on("close", () => console.log("disconnected! 🍳"));
    
    backSocket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch(message.type) {
            case "new_msg":
            backSockets.forEach(otherSocket => otherSocket.send(`${backSocket.nickname}: ${message.payload}`));

            case "nickname":
                backSocket["nickname"] = message.payload; // set already nickname
        }        
    });
});

server.listen(3000, handleListen); 


