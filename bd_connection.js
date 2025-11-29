require('dotenv').config();

const {Pool} = require('pg')

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
    password: process.env.PASSWORD,
});

pool.on('connect', ()=>{
    return pool;
})

module.exports={
    Query: (text, args)=> pool.query(text, args),
    
};