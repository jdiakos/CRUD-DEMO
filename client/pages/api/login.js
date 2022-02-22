import jwt from 'jsonwebtoken';
import { successLogin } from '../../lib/queries';
import { errorHandler } from './errorHandler';

const KEY = process.env.DB_TOKEN_KEY;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { username, password } = req.body;
            console.log(username + ' ' + password);

            const findUser = await successLogin(username, password);
            if (findUser.length > 0) {
                res.statusCode = 200;
                let token = jwt.sign({
                                username,
                                admin: findUser.username === 'admin' && findUser.password === 'admin'
                            },
                            KEY
                            );
                res.json({
                    success: true,
                    token:  token
                });
            } else { 
                const token = 'No auth';
                console.log('No authentication');
                res.status(401).json ({token});
            }
        } catch (err) {
            errorHandler(err, res);
        }
        //res.send(token)
    }
}