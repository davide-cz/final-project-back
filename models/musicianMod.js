
import mongoose from 'mongoose';
const { Schema , SchemaTypes , model } = mongoose;
import validator from "validator";
const { isStrongPassword, isEmail } = validator;
import { hashPassword } from '../Autenticazione/fileForAuthentication.js';


const strongPasswordOptions = {
    minLength: 8,
    minLowerCase: 1,
    minUpperCase: 1,
    minNumbers: 1,
    minSymbols: 1,
}

const musicianSchema=new Schema ({
    first_name: {
        type:String,
        required:false,
        minLength:1,
        maxLength:30,
        trim:true
    },
    last_name: {
        type:String,
        required:false,
        minLength:1,
        maxLength:30,
        trim:true
    } ,
    userName:{
        type:String,
        required:false,
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
    instrument:{
        type:SchemaTypes.ObjectId
    },
    genre:{
        type:String,
        required:false
    },
    slug:{
        type:String,
        validate:{
            validator:async function(slug){
                const Musician=this.constructor;
                const isValid=this.slug===slug ||  
                    !(await Musician.exists({ slug }));
                    return isValid
            }
        }
    }

});

musicianSchema.methods.slugThis=async function(){
    const Musician=this.constructor;
    const {userName}=Musician;
    let slug=userName;
    this.slug=slug;
};

musicianSchema.statics.signUp = async function (email,password){
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

    const musician = await this.create({email, password: hashedPassword}); 
    
    return musician;
}

musicianSchema.statics.findByEmail = function(email){
    return this.findOne({email});
}

musicianSchema.statics.login=async function (email,password){
    const musician = await this.findByEmail(email);
    const fail = () => {
        throw StatusError(401, 'Incorrect Email or Password.');
    }

    if(!musician){
        fail();
    }

    const passwordMatch = await comparePassword(password, user.password);
    if(!passwordMatch){
        fail();
    }
    return musician

}

const Musician = model('Musician', musicianSchema );

export default Musician