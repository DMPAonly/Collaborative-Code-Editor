import pool from "../database/db.js"

export async function saveMessage(workspaceId,userId,message){
    const query = `
        INSERT INTO chat_messages(
            workspace_id,
            user_id,
            message
        )
        VALUES($1,$2,$3)
    `;

    await pool.query(query,[
        workspaceId,
        userId,
        message
    ])
}

export async function getMessage(workspaceId){
    const query = `
        SELECT 
            user_id,
            message,
            sent_at
        FROM chat_messages
        WHERE workspace_id = $1
        ORDER BY sent_at ASC;    
    `;

    const result  = await pool.query(query,[workspaceId]);

    return result.rows;
}