
import mongoose from 'mongoose';
import Instrument from './instrumentMod.js';
const { Schema , SchemaTypes , model } = mongoose;
import validator from "validator";



const musicianSchema=new Schema ({

    user:{
        type:SchemaTypes.ObjectId,
        ref:'User',
        required:true,
    },
    instrument:{
        type:SchemaTypes.ObjectId,
        ref:'Instrument',
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }

});



const Musician = model('Musician', musicianSchema );

export default Musician