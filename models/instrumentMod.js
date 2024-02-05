
import mongoose from 'mongoose';
const { Schema , SchemaTypes , model } = mongoose;

const InstrumentSchema=new Schema ({
    instrument:{
        type:String,
        required:true
    },
    role:String,
    genre:String
});

const Instrument = model('Instrument', InstrumentSchema );

export default Instrument