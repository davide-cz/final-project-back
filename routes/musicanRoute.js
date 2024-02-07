import axios from "axios";
import express from "express";
import Musician from "../models/musicianMod.js";
import { generateToken } from "../Autenticazione/fileForAuthentication.js";

const router=express.Router();

//Chiamata post 
router.post('/', async (req,res)=>{
    try{
        const musician=await Musician.create(req.body);
        res.send(musician)
    }catch(error){
        res.status(400).send( console.error(error))
    }
});

//chiamata get dell'intera collection
router.get('/', async (req,res)=>{
    try{
        const musicians = await Musician.find();
        res.send(musicians)
    }catch(error){
        res.status(404).send(console.error(error))
    }
});

//chiamata get per singolo DOCUMENT

router.get('/:id' , (req,res)=>{
    try{
        const {id}=req.params;
        const musician = Musician.findById(id);
        res.send(musician);
    }catch(error){
        res.status(404).send('musician not found');
    }
});

//Patch partendo da ID
router.patch('/:id', async (req,res)=>{
    try{
        const {id}=req.params
        const newMusician=Object.entries(req.body)
        const musicianToUpdate=await Musician.findById(id);
        newMusician.forEach(([key,value])=>{
            musicianToUpdate[key]=value;
        })
        console.log(musicianToUpdate)
        await musicianToUpdate.save();
        res.send(musicianToUpdate);
    }catch(error){
        res.status(400).send(console.error(error))
    }
})


//gestione LOGIN / SIGNUP
router.post('/signup', async (req, res) => {

    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).send('All fields must be filled.')
    }

    try{
        const musician = await Musician.signUp(email, password);
        const token = generateToken(musician._id);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, //3d
            sameSite: 'none',
            secure: true,
        });
        return res.status(201).send(musician);
    }catch(error){
        console.error(error);
    }

});


router.post('/login', async (req, res) => {

    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).send('All fields must be filled.')
    }

    try{
        const musician = await Musician.logIn(email, password);
        const token = generateToken(musician._id);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, //3d
            sameSite: 'none',
            secure: true,
        });
        return res.status(202).send(musician);
    }catch(error){
        console.error(error);
    }

});

export default router