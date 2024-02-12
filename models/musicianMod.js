
import mongoose from 'mongoose';
const { Schema , SchemaTypes , model } = mongoose;
import validator from "validator";



const musicianSchema=new Schema ({
    // props autenticazione USER

    user_name:{
        type:SchemaTypes.ObjectId,
        path:'User',
        required:true,
    },
    instrument:{
        type:SchemaTypes.ObjectId,
        path:'Instruments',
        required:true
    },
    genre:{
        type:String,
        required:true
    }

});



const Musician = model('Musician', musicianSchema );

export default Musician