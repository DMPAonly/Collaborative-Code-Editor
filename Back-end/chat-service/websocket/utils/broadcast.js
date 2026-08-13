export function broadCast(room,data){
    room.forEach((user) => {
        //only active gets the message
        if(user.ws.readyState === user.ws.OPEN){
            user.ws.send(JSON.stringify(data));
        }
    });
}