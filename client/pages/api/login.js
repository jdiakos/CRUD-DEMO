import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { successLogin } from '../../lib/queries'

const KEY = process.env.DB_TOKEN_KEY

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body
        console.log(username + ' ' + password)
        const findUser = await successLogin(username, password)
        console.log(findUser)
        if (findUser.length > 0) {
            res.statusCode = 200
            let token = jwt.sign({
                            username,
                            admin: findUser.username === 'admin' && findUser.password === 'admin'
                        },
                        KEY
                        )
            res.json({
                success: true,
                token:  token
            })   
        } else { 
            //res.statusCode = 404
            const token = 'No auth'
            console.log('No authentication')
            res.status(401).json ({token})
        }
        //res.send(token)
    }
}