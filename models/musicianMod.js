
import mongoose from 'mongoose';
const { Schema , SchemaTypes , model } = mongoose;

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
    user_name:{
        type:String,
        required:true,
        minLength:1,
        maxLength:30,
        trim:true
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
    }

});

const Musician = model('Musician', MusicianSchema );

export default Musician