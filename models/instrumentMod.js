
import mongoose from 'mongoose';
const { Schema , SchemaTypes , model } = mongoose;

const InstrumentSchema=new Schema ({
    principal_instrument:{
        type:String,
        required:true
    },
    role:{
        type:String
    }
});

const Instrument = model('Instrument', InstrumentSchema );

export default Instrument