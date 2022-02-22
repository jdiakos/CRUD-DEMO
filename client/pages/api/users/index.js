import { getUsers, createUser, deleteUser, updateUser } from "../../../lib/queries";
import { setCookies, getCookies } from 'cookies-next';
import jwt from "jsonwebtoken";
import { errorHandler } from "../errorHandler";

const KEY = process.env.DB_TOKEN_KEY;

export default async function handler(req, res) {
     console.log(getCookies({ req, res }));

     const cook = getCookies({ req, res });
     console.log(cook);
     if (!cook.token || !jwt.verify(cook.token, KEY)){
          res.status(401).json({status:'No Authentication'});
     }
     else{     
          if (req.method === 'GET'){
               const allUsers = await getUsers();
               res.json(allUsers);
          
          } else if (req.method === 'POST') {
               const { last_name, first_name, is_active, date_of_birth } = req.body;
               try {
                    const newUser = await createUser(last_name, first_name, is_active, date_of_birth);
                    res.send(newUser);
               } catch (err){
                    errorHandler(err, res);
               }               

          } else if (req.method === 'PUT') {
               const { last_name, first_name, is_active, date_of_birth, id } = req.body;
               try {
                    const edtUser = await updateUser(last_name, first_name, is_active, date_of_birth, id);
                    res.send(edtUser);
               } catch (err) {
                    errorHandler(err, res);
               }

          } else if (req.method === 'DELETE') {
               const id = req.body;
               try {
                    const dltUser = await deleteUser(id.id);
                    res.send(dltUser);
               } catch (err) {
                    errorHandler(err, res);
               }
          }
     }
}
