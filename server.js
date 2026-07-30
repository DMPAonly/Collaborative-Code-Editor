import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { handleJoin } from "./websocket/handlers/joinHandler.js";
import { handleChat } from "./websocket/handlers/chatHandler.js";
import { handleDisconnect } from "./websocket/handlers/disconnectHandler.js";

const app = express();

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Backend Running");
});

wss.on("connection", (ws) => {

    console.log("New Client Connected");

    ws.on("message", async (data) => {

        let payload;

        try {
            payload = JSON.parse(data.toString());
        } catch (err) {
            console.log("Invalid JSON received");
            return;
        }

        switch (payload.type) {

            case "join": {
                const result = await handleJoin(payload, ws);

                if (result.success) {
                    console.log(
                        `Users in workspace: ${result.totalUsers}`
                    );
                }

                break;
            }

            case "chat":
                await handleChat(payload);
                break;

            default:
                console.log("Unknown message type");
                break;
        }

    });

    ws.on("close", () => {
        handleDisconnect(ws);
    });

});

server.listen(9000, () => {
    console.log("server started");
});