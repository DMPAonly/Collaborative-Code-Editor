import rooms from "../roomManager.js";
import { getMessage } from "../services/chatService.js";

export async function handleJoin(message,ws){
    const { workspaceId, userId } = message;

    // Validate payload
    if (!workspaceId || !userId) {
        ws.send(JSON.stringify({
            type: "error",
            message: "workspaceId and userId are required"
        }));

        return { success: false };
    }

    if(!rooms.has(workspaceId)){
        rooms.set(workspaceId,[]);
    }

    const room = rooms.get(workspaceId);

    const alreadyExists = room.some(user => user.ws === ws);

    if (!alreadyExists) {
        room.push({
            userId,
            ws
        });
    }

    ws.userId = userId;
    ws.workspaceId = workspaceId;

    const messages = await getMessage(message.workspaceId);

    ws.send(JSON.stringify({
        type: "history",
        messages
    }))

    return {
        success: true,
        totalUsers: room.length
    };
}