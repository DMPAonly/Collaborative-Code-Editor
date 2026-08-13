import pg from "pg";

const {Pool} = pg;

const pool = new Pool({
    host:"localhost",
    port:5432,
    user:"postgres",
    password:"1407",
    database:"code_editor"
});

pool.query("SELECT NOW()")
.then(result=>{
    console.log(result.rows);
})
.catch(error=>{
    console.log(error);
});

export default pool;