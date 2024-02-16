import axios from "axios";
import express from "express";
import User from "../models/userMod.js";
import { generateToken, reqAdmin, requireOwner } from "../Autenticazione/fileForAuthentication.js";

const router=express.Router();

//Chiamata post per TEST 
router.post('/', async (req,res)=>{
    try{
        const user=await User.create(req.body);
        res.send(user)
    }catch(error){
        res.status(400).send( console.error(error))
    }
});

//gestione LOGIN / SIGNUP
router.post('/signup', async (req, res) => {

    const {user_name,email, password  } = req.body;
    if( !user_name || !email || !password){
        return res.status(400).send('All fields must be filled.')
    }

    try{
        const user = await User.signUp(user_name, email, password );
        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, //3d
            sameSite: 'none',
            secure: true,
        });
        return res.status(201).send({user:user,token});
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
        const user = await User.logIn(email, password);
        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, //3d
            sameSite: 'none',
            secure: true,
        });
        return res.status(202).send({user:user,token});
    }catch(error){
        console.error(error);
    }

});

//chiamata get per singolo DOCUMENT

router.get('/:user_name' , async (req,res)=>{
    try{
        const {user_name}=req.params;
        const user = await User.findByUserName(user_name);
        res.send(user);
    }catch(error){
        res.status(404).send('user not found');
    }
});

//user loggato
//Patch partendo da ID
router.patch('/:user_name', async (req,res)=>{
    try{
        const {user_name}=req.params
        const newUser=Object.entries(req.body)
        const userToUpdate=await User.findByUserName(user_name);
        newUser.forEach(([key,value])=>{
            userToUpdate[key]=value;
        })
        console.log(userToUpdate)
        await userToUpdate.save();
        res.send(userToUpdate);
    }catch(error){
        res.status(400).send(console.error(error))
    }
})

router.use(reqAdmin())
//chiamate che richiedono ADMIN 
//COLLECTION USER
router.get('/', async (req,res)=>{
    try{
        const users = await User.find();
        res.send(users)
    }catch(error){
        res.status(404).send(console.error(error))
    }
});

router.delete('/:user_name' , async (req,res)=>{
    try{
        const {user_name}=req.params;
        await User.deleteOne({user_name});
        res.send('user deleted');
    }catch(error){
        res.status(404).send('user not found');
    }
});



export default router