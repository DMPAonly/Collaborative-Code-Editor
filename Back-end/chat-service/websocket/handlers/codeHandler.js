import rooms from "../roomManager.js";
import { saveDocument, getDocument } from "../services/codeService.js";
import { WebSocket } from "ws";

const saveTimers = new Map();

export async function handleCodeChange(message) {

    const room = rooms.get(message.workspaceId);

    if (!room) {
        return;
    }

    
    room.forEach((user) => {

        if (user.ws.readyState === WebSocket.OPEN) {

            user.ws.send(JSON.stringify({
                type: "codeChange",
                filename: message.filename,
                content: message.content
            }));

        }

    });

    
    const key = `${message.workspaceId}:${message.filename}`;

    
    if (saveTimers.has(key)) {
        clearTimeout(saveTimers.get(key));
    }

    
    const timer = setTimeout(async () => {

        try {

            await saveDocument(
                message.workspaceId,
                message.filename,
                message.content
            );

            console.log(
                `Document saved: ${message.filename}`
            );

        } catch (error) {

            console.error(
                "Error saving document:",
                error
            );

        }

        saveTimers.delete(key);

    }, 500);

    saveTimers.set(key, timer);
}


export async function handleOpenFile(message, ws) {

    try {

        const document = await getDocument(
            message.workspaceId,
            message.filename
        );

        ws.send(JSON.stringify({
            type: "document",
            filename: message.filename,
            content: document ? document.content : ""
        }));

    } catch (error) {

        console.error("Error loading document:", error);

        ws.send(JSON.stringify({
            type: "error",
            message: "Unable to load document."
        }));

    }

}