import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();
const {PEPPER_KEY, SECRET_KEY}=process.env;
import Musician from '../models/musicianMod.js';
import User from '../models/userMod.js';

export const hashPassword = async (password)=>{
    //creo una funzione che utilizza libreria bcrypt per criptare la password (hashing)
    const salt = await bcrypt.genSalt(10);
    const combined = password + PEPPER_KEY;
    const hashedPassword=bcrypt.hash(combined,salt);
    return hashedPassword;
}

export const comparePassword = async (password, hashedPassword) => {
    //creo funzione che permette di confrontare la password utente con la versione hashed
    const combined = password + PEPPER_KEY;
    const match = await bcrypt.compare(combined, hashedPassword);
    return match;
}

export const generateToken = (_id) => {
    //funk che, partendo da ID assegna un token utilizzando libreria JWT
    const token = jwt.sign(
        { _id },
        SECRET_KEY,
        { expiresIn: '3d' }
    );
    return token;
}

export const verifyToken = (token) => {
    //funk che valida il token confrontandolo con il token assegnato all'id corrispondente
    const { _id } = jwt.verify(token, SECRET_KEY);
    return _id;
}

export const reqAuthorization = ()=>{
    //funk che controlla se lo user ha un token valido
    return async (req,res,next)=>{
        try{
            const token = req.cookies?.token;

            if(!token){
                throw new Error ('token required');
            }
            const _id = verifyToken(token);
            //controllo il token e ritorno l'id corrispondente
            const user=await User.findById(_id);
            
            if(!user){
                throw new Error ('user not found');
            }

            req.user=user;

        }catch(error){
            console.error(error);
            return res.status(401).send('requst is not authorized');
        }
        next()
    } 
}

export const reqAdmin = () => {
    return async (req, res, next) => {

        try{

            const {user} = req;
            
    
            if(!user.role==='admin'){
                throw new Error('role unauthorized');
            }
    
        }catch(error){
            console.error(error.message);
            return res.status(401).send(`Request is not authorized: ${error.message}`);
        }
    
        next();
    }
}
export const reqMusician = () => {
    return async (req, res, next) => {

        try{
            const {user} = req
            if(user.role !=='musician'){
                throw new Error('role unauthorized');
            }
    
        }catch(error){
            console.error(error.message);
            return res.status(401).send(`Request is not authorized: ${error.message}`);
        }
    
        next();
    }
};
export const requireOwner = () => {
    return async (req, res, next) => {
        req.dbQuery = req.user.role==='musician' ? {} : {
            user: req.user.id
        }
        next();
    }
}