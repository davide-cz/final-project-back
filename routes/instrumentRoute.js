import axios from "axios";
import express from "express";
import Instrument from "../models/instrumentMod.js";

const router=express.Router();

//Chiamata post 
router.post('/', async (req,res)=>{
    try{
        const instrument=await Instrument.create(req.body);
        res.send(instrument)
    }catch(error){
        res.status(400).send( console.error(error))
    }
});

//chiamata get dell'intera collection
router.get('/', async (req,res)=>{
    try{
        const instruments = await Instrument.find();
        res.send(intruments)
    }catch(error){
        res.status(404).send(console.error(error))
    }
});

export default router