import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";
import { handleRegister } from './controllers/register.js'; 
import { handleSignin } from './controllers/signin.js';
import { handleProfileGet } from './controllers/profile.js';
import { handleApiCall, handleImage } from './controllers/image.js';

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'test',
        database: 'smart-brain',
    },
});

const app = express();
app.use(cors());
app.use(express.json());
// Clarifai API proxy
app.post('/clarifai-proxy', handleApiCall);

app.get("/", (req, res) => {
    res.send('success');
});

app.post("/signin", (req, res) => { handleSignin(req, res, db, bcrypt)})

app.post("/register", (req, res) => { handleRegister(req, res, db, bcrypt)})

app.get("/profile/:id", (req, res) => { handleProfileGet(req, res, db)})

app.put("/image", (req, res) => { handleImage(req, res, db)})

app.post("/imageUrl", (req, res) => { handleApiCall(req, res)})

import fetch from 'node-fetch';

app.post("/clarifai-proxy", async (req, res) => {
    const { imageUrl } = req.body;

    const clarifaiRequestOptions = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Authorization": "Key dcb52ced76444b13be68163102a8b7fc", // Your PAT
        },
        body: JSON.stringify({
            "user_app_id": {
                "user_id": "cu9ym2eezj7bb",
                "app_id": "Face-Recognition-Brain",
            },
            "inputs": [
                {
                    "data": {
                        "image": {
                            "url": imageUrl,
                        },
                    },
                },
            ],
        }),
    };

    try {
        const response = await fetch(
            "https://api.clarifai.com/v2/models/face-detection/outputs",
            clarifaiRequestOptions
        );
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to fetch Clarifai API" });
    }
});

app.listen(3000, () => {
    console.log("app is running on port 3000");
});

