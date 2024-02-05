import axios from "axios";
import express from "express";
import Musician from "../models/musicianMod.js";

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
})

export default router