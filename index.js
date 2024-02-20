import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import musicianRoute from './routes/musicanRoute.js'
import userRoute from './routes/userRoute.js'
import instrumentRoute from './routes/instrumentRoute.js'
const PORT = process.env.PORT || 3000;
dotenv.config();

const {MONGO_URI}=process.env;

mongoose.connect(MONGO_URI)
.then(console.log('connesso a mongoDB'))
.catch(error=>console.error(error))

import morgan from 'morgan'
import Musician from './models/musicianMod.js'

const app=express();


app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'final-project-front-ten.vercel.app'
    ],
    credentials: true
}));
app.use(morgan('dev'));

app.use('/instruments' , instrumentRoute)
app.use('/user' , userRoute)
app.use('/musicians' , musicianRoute)





app.listen(PORT, ()=>{
    console.log('in ascolto su porta 3000')
});

