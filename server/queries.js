const Pool = require('pg').Pool
const pool = new Pool({
    user: 'jd',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
})

// GET(Read) all users
const getUsers = (request, response) => {
    pool.query('SELECT * FROM EMPLOYEE ORDER BY ID', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

// GET(Read) a specific user by ID
const getUserById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM EMPLOYEE WHERE ID = $1', [id], (error, results) => {
       if (error) {
           throw error
       }
       response.status(200).json(results.rows)
    })
}

//POST(Create) a new employee
const createUser = (request, response) => {
    const { last_name, first_name, is_active, date_of_birth } = request.body

    console.log(request.body)
    pool.query('INSERT INTO EMPLOYEE (last_name, first_name, is_active, date_of_birth) VALUES ($1, $2, $3, $4)', [last_name, first_name, is_active, date_of_birth], (error, results) => {
       if (error) {
           throw error
       } 
       response.status(201).send(`User added with ID: ${results.insertId}`)
    })
}

//PUT(Update) an existing user
const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { last_name, first_name, is_active, date_of_birth } = request.body
   
    pool.query('UPDATE EMPLOYEE SET LAST_NAME = $1, FIRST_NAME = $2, IS_ACTIVE = $3, DATE_OF_BIRTH = $4 WHERE id = $5',
        [ last_name, first_name, is_active, date_of_birth, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User modified with ID: ${id}`)
        }
    )
}

//DELETE a user
const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    console.log(request.body)
    pool.query('DELETE FROM EMPLOYEE WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
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

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    findMax,
}