
import mongoose from 'mongoose';
const { Schema , SchemaTypes , model } = mongoose;
import validator from "validator";
const { isStrongPassword, isEmail } = validator;
import { hashPassword,comparePassword, } from '../Autenticazione/fileForAuthentication.js';
import Musician from './musicianMod.js';


const strongPasswordOptions = {
    minLength: 8,
    minLowerCase: 1,
    minUpperCase: 1,
    minNumbers: 1,
    minSymbols: 1,
}

const userSchema=new Schema ({
    // props autenticazione USER

    user_name:{
        type:String,
        unique:true,
        required:true,
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


userSchema.statics.signUp = async function (user_name,email,password,role){
 
    const emailExists = await this.exists({email});
    if(emailExists){
        throw new Error( 'Email already in use.')
    }
    const userNameExists = await this.exists({user_name});
    if(userNameExists){
        throw new Error( 'user_name already in use.')
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

userSchema.statics.logIn=async function (email,password){
    const user = await this.findByEmail(email);
    const fail = () => {
        throw new Error('Incorrect Email or Password.');
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

const User = model('User', userSchema );

export default User