import axios from "axios";
import express from "express";
import Musician from "../models/musicianMod.js";
import { generateToken, reqAMusician,  } from "../Autenticazione/fileForAuthentication.js";
import Instrument from "../models/instrumentMod.js";

const router=express.Router();



//chiamata get dell'intera collection
router.get('/', async (req,res)=>{
    try{
        const musicians = await Musician.find().populate([{
            path:'instrument',
            select: 'principal_instrument'
        },{
            path:'user',
            select: 'user_name id'
        }]);
        res.send(musicians)
    }catch(error){
        res.status(404).send(console.error(error))
    }
});

//chiamata GET che ritorna tutti gli annunci di un unico user
//in sospeso

//chiamata get per singolo DOCUMENT


router.use(reqAMusician());
router.get('/:id' , async (req,res)=>{
    try{
        const {id}=req.params;
        const musician = await Musician.findById(id).populate([{
            path:'instrument',
            select: 'principal_instrument'
        },{
            path:'user',
            select: 'user_name id'
        }]);
        res.send(musician);
    }catch(error){
        res.status(404).send('musician not found');
    }
});
//Chiamata post 
router.post('/', async (req,res)=>{
    try{

        const musician=await Musician.create(req.body);
        res.send(musician)
    }catch(error){
        res.status(400).send(console.error(error))
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
// elimina musicista da id
router.delete('/:id' , async (req,res)=>{
    try{
        const {id}=req.params;
        await Musician.deleteOne(id);
        res.send(`musician with id: ${id} deleted`);
    }catch(error){
        res.status(404).send('musician not found');
    }
});

//----------------------------DA CANCELLARE?
/* //gestione LOGIN / SIGNUP
router.post('/signup', async (req, res) => {

    const {name,email, password  } = req.body;
    if( !name || !email || !password){
        return res.status(400).send('All fields must be filled.')
    }

    try{
        const musician = await Musician.signUp(name, email, password );
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
 */
export default router