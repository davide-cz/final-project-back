import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import musicianRoute from './routes/musicanRoute.js'
import userRoute from './routes/userRoute.js'
import instrumentRoute from './routes/instrumentRoute.js'
dotenv.config();

const {MONGO_URI}=process.env;

mongoose.connect(MONGO_URI)
.then(console.log('connesso a mongoDB'))

import morgan from 'morgan'
import Musician from './models/musicianMod.js'

const app=express();


app.use(express.json());
app.use(cors({origin:'*'}));
app.use(morgan('dev'));

app.use('/user' , userRoute)
app.use('/musicians' , musicianRoute)
app.use('/instruments' , instrumentRoute)

//gestione logIn / SignUp




app.listen(3000, ()=>{
    console.log('in ascolto su porta 3000')
});

