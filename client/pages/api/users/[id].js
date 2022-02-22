import { getCookies } from 'cookies-next';
import  jwt  from 'jsonwebtoken';

const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
});

const KEY = process.env.DB_TOKEN_KEY;

export default async function handler(req, res) {
    const cook = getCookies({ req, res });

    if (!cook.token || !jwt.verify(cook.token, KEY)){
        res.status(401).json({status:'No Authentication'});
    }else{ 
        if (req.method === 'GET'){
        const id = req.query.id;
        const response = await pool.query('SELECT * FROM EMPLOYEE WHERE ID = $1', [id]);
        res.send(response.rows);
        }
    }
}
