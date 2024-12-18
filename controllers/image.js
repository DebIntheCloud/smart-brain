import knex from "knex";
import Clarifai from 'clarifai';

// Clarifai API setup remains the same...
  // const returnClarifaiRequestOptions = (imageUrl) => {
const PAT = 'dcb52ced76444b13be68163102a8b7fc'; // Correctly declare the PAT
const USER_ID = 'cu9ym2eezj7bb'; // Your Clarifai User ID
const APP_ID = 'Face-Recognition-Brain'; // Your Clarifai App ID
const MODEL_ID = 'face-detection'; // The model you're using

const clarifaiApp = new Clarifai.App ({ apiKey: PAT });

const handleApiCall = (req, res) => {
    const { imageUrl } = req.body;

    clarifaiApp.models.predict(MODEL_ID, imageUrl)
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        console.error('Clarifai API error:', err);
        res.status(400).json('Unable to fetch data from Clarifai');
    });
};

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            const updatedEntries = entries[0].entries;
            res.json(updatedEntries);
        })
        .catch(err => res.status(400).json('unable to get entries'));
}

export { handleApiCall, handleImage };