// import express from "express";
// import http from "http";
// import { WebSocketServer } from "ws";
// import { handleJoin } from "./websocket/handlers/joinHandler.js";
// import { handleChat } from "./websocket/handlers/chatHandler.js";
// import { handleDisconnect } from "./websocket/handlers/disconnectHandler.js";

// const app = express();

// const server = http.createServer(app);

// const wss = new WebSocketServer({ server });

// app.use(express.static("public"));

// app.get("/", (req, res) => {
//     res.send("Backend Running");
// });

// wss.on("connection", (ws) => {

//     console.log("New Client Connected");

//     ws.on("message", async (data) => {

//         let payload;

//         try {
//             payload = JSON.parse(data.toString());
//         } catch (err) {
//             console.log("Invalid JSON received");
//             return;
//         }

//         switch (payload.type) {

//             case "join": {
//                 const result = await handleJoin(payload, ws);

//                 if (result.success) {
//                     console.log(
//                         `Users in workspace: ${result.totalUsers}`
//                     );
//                 }

//                 break;
//             }

//             case "chat":
//                 await handleChat(payload);
//                 break;

//             default:
//                 console.log("Unknown message type");
//                 break;
//         }

//     });

//     ws.on("close", () => {
//         handleDisconnect(ws);
//     });

// });

// server.listen(9000, () => {
//     console.log("server started");
// });

import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { handleJoin } from "./websocket/handlers/joinHandler.js";
import { handleChat } from "./websocket/handlers/chatHandler.js";
import { handleDisconnect } from "./websocket/handlers/disconnectHandler.js";
import { handleCodeChange,handleOpenFile } from "./websocket/handlers/codeHandler.js";

//create application object
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server});
app.use(express.static("public"));

app.get("/",(req,res) => {
    res.send("Backend Running");
})

//executes everytime a new client connects 
wss.on("connection",(ws) => {
    console.log("New Client Connected");

    //used by server to send msg
    //ws is a server
    // ws.send("Welcome client");

    //whenever client send a data to server
    ws.on("message",async (data) => {
        let payload ;

        try {
            payload = JSON.parse(data.toString());
        } catch (err) {
            console.log("Invalid JSON received");
            return;
        }

        switch (payload.type) {
            case "join":
                const result = await handleJoin(payload, ws);

                if (result.success) {
                    console.log(`Users in workspace: ${result.totalUsers}`);
                }
                break;

            case "chat":
                await handleChat(payload);
                break;

            case "codeChange":
                handleCodeChange(payload);
                break;

            case "openFile":
                await handleOpenFile(payload,ws);
                break;
        
            default:
                console.log("Unknown message type");
                break;
        }

    });

    ws.on("close",()=>{
        handleDisconnect(ws);
    })
})

server.listen(9000,() =>{
    console.log("server started");
    
})

 