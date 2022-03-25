require("dotenv").config()
const express = require('express');
require('./db/conn');
const Register = require('./models/registers');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


const app = express();
const port = process.env.PORT || 8000; 




app.use(express.json());
app.use(express.urlencoded({extended:false}));


// app.get('/', (req,res) =>{
//     res.send('Hello from express side..');
// });

app.get("/", (req,res) => {
    res.render('index')
});

app.get('/register', (req,res) => {
    res.render('regiser');
})

//Create new user in database

app.post('/register', async (req,res) => {
    try {
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if(password === confirmpassword){

            const  registerEmployee= new Register(req.body)
           
            const token = await registerEmployee.generateAuthToken(); // function call for token
           
            const registered = await registerEmployee.save();
            console.log(registered);

            res.status(201).send("Your registaion success...")

        }else{
            res.send("Passoword are not matching....")
        }
        
    } catch (error) {
        res.status(400).send(error);
    }
});



//Get data using login
app.post("/login", async(req ,res) =>{
    try {
        const email = req.body.email;
        const password = req.body.password

        const userEmail = await Register.findOne({email : email})
        
         const isMatch = await bcrypt.compare(password, userEmail.password) // Hasing password compare

         const token = await userEmail.generateAuthToken();
         console.log(`Tokens is : ${token}`);
        
        
        if(isMatch){
            res.status(200).send(userEmail)
            console.log(userEmail);
        }else{
            
            res.status(201).send("Oops Password is Wrong....");
        }
    } catch (error) {
        res.status(500).send("Invalid login details...");
    }
})




app.listen(port, () => {
    console.log(`Server running on port number ${port}`);
})