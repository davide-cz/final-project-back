
import mongoose from 'mongoose';
const { Schema , SchemaTypes , model } = mongoose;
import validator from "validator";
const { isStrongPassword, isEmail } = validator;
import { hashPassword,comparePassword, } from '../Autenticazione/fileForAuthentication.js';


const strongPasswordOptions = {
    minLength: 8,
    minLowerCase: 1,
    minUpperCase: 1,
    minNumbers: 1,
    minSymbols: 1,
}

const usserSchema=new Schema ({
    first_name: {
        type:String,
        required:true,
        minLength:1,
        maxLength:30,
        trim:true
    },
    last_name: {
        type:String,
        required:true,
        minLength:1,
        maxLength:30,
        trim:true
    } ,
    userName:{
        type:String,
        required:true,
        minLength:1,
        maxLength:30,
        trim:true,
        unique:true
    },
    // props autenticazione USER

    email:{
        type:String,
        required:true,
        trim:true,
        index:true,
        unique:true
    },
    password:{
        required:true,
        type:String
    },

    birthdate: {
        type:Date,      
    },

    slug:{
        type:String,
        validate:{
            validator:async function(slug){
                const User=this.constructor;
                const isValid=this.slug===slug ||  
                    !(await User.exists({ slug }));
                    return isValid
            }
        }
    }

});

userSchema.methods.slugThis=async function(){
    const User=this.constructor;
    const {userName}=User;
    let slug=userName;
    this.slug=slug;
};

userSchema.statics.signUp = async function (email,password){
    if(!isEmail(email)){
        throw new Error( 'Must use a real email.')
    }
    if(!isStrongPassword(password, strongPasswordOptions)){
        throw new Error( 'Password not strong enough.')
    }
    const emailExists = await this.exists({email});
    if(emailExists){
        throw new Error( 'Email already in use.')
    }
    //creare modo per Hashare password 
    const hashedPassword = await hashPassword(password);

    const user = await this.create({email, password: hashedPassword}); 
    
    return user;
}

userSchema.statics.findByEmail = function(email){
    return this.findOne({email});
}

userSchema.statics.logIn=async function (email,password){
    const user = await this.findByEmail(email);
    const fail = () => {
        throw StatusError(401, 'Incorrect Email or Password.');
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