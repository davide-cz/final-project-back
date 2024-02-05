
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
    userName:{
        type:String,
        required:true,
        minLength:1,
        maxLength:30,
        trim:true,
        unique:true
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
                    !(await Author.exists({ slug }));
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
}

const Musician = model('Musician', MusicianSchema );

export default Musician