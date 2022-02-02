const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
})

// GET(Read) all users
export const getUsers = async () => {
    const response = await pool.query('SELECT * FROM EMPLOYEE ORDER BY ID')

    return(response.rows)
}

//POST(Create) a new employee
export const createUser = async (last_name, first_name, is_active, date_of_birth) => {  
    const response = await pool.query('INSERT INTO EMPLOYEE (last_name, first_name, is_active, date_of_birth) VALUES ($1, $2, $3, $4)', [last_name, first_name, is_active, date_of_birth])
    
    return(response.rows)
}

//PUT(Update) an existing user
export const updateUser = async (last_name, first_name, is_active, date_of_birth, id) => {
    const response = await pool.query('UPDATE EMPLOYEE SET LAST_NAME = $1, FIRST_NAME = $2, IS_ACTIVE = $3, DATE_OF_BIRTH = $4 WHERE id = $5',
    [ last_name, first_name, is_active, date_of_birth, id])

    return(response.rows)
}

//DELETE a user
export const deleteUser = async (id) => {
    const response = pool.query('DELETE FROM EMPLOYEE WHERE id = $1', [id])

    return (response)
}

//Find MaxId
const findMax = (request, response) => {
    pool.query('SELECT MAX(ID) FROM EMPLOYEE', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(results.rows)
    })
}

//Find if user can log in
export const successLogin = async (username, password) => {
    const response = await pool.query('SELECT * FROM USERS WHERE lower(username) = lower($1) and lower(password) = lower($2)', [username, password])
    
    return(response.rows)
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    findMax,
    successLogin
}