const request = require('postman-request');
const rDownloader = require('./reddit-downloader')

const chalk = require('chalk'); 

const express = require('express')
const cors = require ('cors')
const app = express(); 

const port = process.env.PORT || 3001


app.use(express.json()) 

app.use(
    cors({
        origin: 'http://localhost:3000', 
        credentials: true,
    })
); 

app.post('/subreddit', (req, res) => {
    console.log(req.body); 

    const query = {
        subreddit: req.body.subreddit, 
        limit: req.body.limit, 
        filter: req.body.filter, 
        time: req.body.time
    }

    rDownloader.startDownload(query.subreddit, query.limit, query.filter, query.time)
})

app.listen(port, () => {
    console.log("Listening on port 3001")
})