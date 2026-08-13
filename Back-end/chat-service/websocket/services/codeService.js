import pool from "../database/db.js";

export async function getDocument(workspaceId, filename) {

    const query = `
        SELECT content
        FROM documents
        WHERE workspace_id = $1
        AND filename = $2
    `;

    const result = await pool.query(query, [
        workspaceId,
        filename
    ]);

    return result.rows[0];
}

export async function saveDocument(workspaceId, filename, content) {

    const query = `
        UPDATE documents
        SET
            content = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE workspace_id = $2
        AND filename = $3
    `;

    await pool.query(query, [
        content,
        workspaceId,
        filename
    ]);
}

