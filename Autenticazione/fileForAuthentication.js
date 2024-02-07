import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();
const {PEPPER_KEY, SECRET_KEY}=process.env;
import Musician from '../models/musicianMod.js';

export const hashPassword = async (password)=>{

    const salt = await bcrypt.genSalt(10);
    const combined = password + PEPPER_KEY;
    const hashedPassword=bcrypt.hash(combined,salt);
    return hashedPassword;
}

export const comparePassword = async (password, hashedPassword) => {

    const combined = password + PEPPER_KEY;
    const match = await bcrypt.compare(combined, hashedPassword);
    return match;
}

export const generateToken = (_id) => {
    const token = jwt.sign(
        { _id },
        SECRET_KEY,
        { expiresIn: '3d' }
    );
    return token;
}

export const verifyToken = (token) => {
    const { _id } = jwt.verify(token, SECRET_KEY);
    return _id;
}

/* 
export const isAuthenticated= async (req,res,next)=>{
    try{
        const {token} = req.cookies ;
        if(!token){
            res.send('must login to access the site')
        }
        const verify=await jwt.verify(token,SECRET_KEY);
        req.user = await Musician.findById(verify.id);
     }catch(error){
        console.error(error);
     }next()
} */

