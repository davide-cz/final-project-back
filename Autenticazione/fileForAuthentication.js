import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();
const {PEPPER_KEY, SECRET_KEY}=process.env;
import Musician from '../models/musicianMod.js';

export const hashPassword= async (password) =>{
    const salt = await bcrypt.genSalt(10);
    const comb= password + PEPPER_KEY;
    const hashedPassword = bcrypt.hash(comb,salt);
    return hashedPassword;
};

export const comparePassword = async (password,hashedPassword)=>{
    const matchPassword= await bcrypt.compare(password, hashedPassword);
    return matchPassword;
}