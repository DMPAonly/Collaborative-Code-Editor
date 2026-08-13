import rooms from "../roomManager.js";

export function handleDisconnect(ws){
    console.log(`${ws.userId} disconnected`);

        const room = rooms.get(ws.workspaceId);

        if(!room){
            return;
        }

        const updatedRoom = room.filter((user) => {
            return user.ws !== ws;
        })

        if(updatedRoom.length === 0){
            rooms.delete(ws.workspaceId);
        }else{
            rooms.set(ws.workspaceId,updatedRoom);
        }
        console.log(rooms);
}