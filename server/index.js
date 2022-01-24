const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3001
const db = require ('./queries') //pull the queries from different script

app.use(cors())
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)

app.use(express.json());
app.use(bodyParser());

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API. Here lies our server'})
})

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)
app.get('/findMax', db.findMax)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

