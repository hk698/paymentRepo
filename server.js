const express = require("express");
const path = require("path");
const MongoClient = require('mongodb').MongoClient; 
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const fs = require('fs');


const app = express();
app.use(express.json());

app.use(cors()); //it wouldnt make request from other servers to my api if not written
app.use((request, respond, next) =>{
    console.log(request.url);
    next();
})

let db; // db variable for storing my future connection to dbase
MongoClient.connect('mongodb+srv://hk698:hk3270343900@cluster0.1jaim.mongodb.net/', (error, client) => {
    if (error) console.log(error)
    db = client.db('Payments') // storing my conn to database in db variab
});

app.post('/order', (request, respond, next) => {
    db.collection('orders').insert(request.body, (error, results) => {
        if (error) return next();
        respond.send(results.ops);
    });
});

app.use(function(req, res, next) {
    var filePath = path.join(__dirname, "static", req.url);
    fs.stat(filePath, function(err, fileInfo) {
        if (err) {
            next();
return; }
        if (fileInfo.isFile()) res.sendFile(filePath);
        else next();
    });
});

app.use((request, respond) => {
    respond.status(404).json({
        'error': true,
        'message': 'An error has occured'});
});

const port = process.env.PORT || 3000;
app.listen(port);
