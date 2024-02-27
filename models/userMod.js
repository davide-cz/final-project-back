
import mongoose from 'mongoose';
const { Schema , SchemaTypes , model } = mongoose;
import validator from "validator";
const { isStrongPassword, isEmail } = validator;
import { hashPassword,comparePassword, } from '../Autenticazione/fileForAuthentication.js';
import Musician from './musicianMod.js';
import { StatusError } from "../Autenticazione/errorHelper.js";

const strongPasswordOptions = {
    minLength: 8,
    minLowerCase: 1,
    minUpperCase: 1,
    minNumbers: 1, 
    minSymbols: 0, 
    returnScore: false, 

}

const userSchema=new Schema ({
    // props autenticazione USER

    user_name:{
        type:String,
        unique:true,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        required:true,
        type:String
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'musician'],
        default: 'user'
      },
});


userSchema.statics.logIn= async function (email,password){
    const user = await this.findByEmail(email);
    const fail = () => {
        throw StatusError(401 , 'Incorrect Email or Password.');
    }

    if(!user){
        fail();
    }

    const passwordMatch = await comparePassword(password, user.password);
    if(!passwordMatch){
        fail();
    }
    return user

}

userSchema.statics.signUp = async function (user_name,email,password,role){

    if(!isEmail(email)){
        throw StatusError(400 ,`that's not a valid email`)
    }
 
    const emailExists = await this.exists({email});
    if(emailExists){
        throw StatusError(400 , 'Email already in use.')
    }
    const userNameExists = await this.exists({user_name});
    if(userNameExists){
        throw StatusError(400,'user_name already in use.')
    }
    if(!isStrongPassword(password, strongPasswordOptions)){
        throw StatusError(400, 'Password must contain almost 8 chars and charact:1 uppercase,1 lowercase 1number')
    }
    //creare modo per Hashare password 
    const hashedPassword = await hashPassword(password);

    const user = await this.create({user_name,email, password: hashedPassword,role}); 
    
    return user;
}

userSchema.statics.findByEmail = function(email){
    return this.findOne({email});
}

userSchema.statics.findByUserName = function(user_name){
    return this.findOne({user_name});
}

const User = model('User', userSchema );

export default User