
import mongoose from 'mongoose';
const { Schema , SchemaTypes , model } = mongoose;
import validator from "validator";
const { isStrongPassword, isEmail } = validator;


const strongPasswordOptions = {
    minLength: 8,
    minLowerCase: 1,
    minUpperCase: 1,
    minNumbers: 1,
    minSymbols: 1,
}

const MusicianSchema=new Schema ({
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
    instrument:{
        type:SchemaTypes.ObjectId
    },
    genre:{
        type:String,
        required:true
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

MusicianSchema.methods.slugThis=async function(){
    const Musician=this.constructor;
    const {userName}=Musician;
    let slug=userName;
    this.slug=slug;
};

MusicianSchema.statics.signUp = async function (email,password){
    if(!isEmail(email)){
        throw StatusError(400, 'Must use a real email.')
    }
    if(!isStrongPassword(password, strongPasswordOptions)){
        throw StatusError(400, 'Password not strong enough.')
    }
    const emailExists = await this.exists({email});
    if(emailExists){
        throw StatusError(400, 'Email already in use.')
    }
    //creare modo per Hashare password 
   /*  const hashedPassword = await hashPassword(password);

    const user = await this.create({email, password: hashedPassword}); */
    
    return user;
}

const Musician = model('Musician', MusicianSchema );

export default Musician