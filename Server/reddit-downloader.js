const snoowrap = require('snoowrap'); 
const http = require('http'); 
const fs = require('fs'); 
const request = require('postman-request');
const path = require('path');
const chalk = require('chalk'); 
const r = require('./secrets')

const cheerio = require('cheerio')

const express = require('express')
const cors = require ('cors')

let user = r.r; 


// const subreddit = process.argv[2]; 
// const filter = process.argv[3]
// const imageLimit = process.argv[4]; 
// const time = process.argv[5].toLowerCase(); 

const validTime = ['today', 'week', 'month', 'year', 'all']

const imageDirPath = path.join(__dirname, "../server/images/"); 

var subredditFolder = ''

const PrintStatus = (url, title) => {
    console.log(chalk.inverse.yellow.bold("Currently downloading: " + title + " from: " + url)); 
}

const CreateFile = (url, title, subredditFolder, fileType) => {

    let imagePath = subredditFolder + ParseTitle(title) + fileType;  

    console.log("IMage path is: ", imagePath + '.mp4')

    if(url === undefined)
        console.log("Null url")
    else if(!fs.existsSync(imagePath))
        request(url).pipe(fs.createWriteStream(imagePath))
    else
        console.log(chalk.inverse.redBright.bold("File already exists!"))
}

const ParseRedGifs = (res) => {
    const $ = cheerio.load(res.body);

    let url = $('meta[property="og:video"]').attr('content')

    console.log(url)

    return url

    //console.log(res.body);

    //console.log($.html());
}

const DownloadFile = (url, title, callback) => {

    if(url === undefined)
        return console.log(chalk.inverse.bold.red("File is undefined, Aborting download"))

    if(!fs.existsSync(subredditFolder))
        fs.mkdir(subredditFolder, () => {console.log(chalk.inverse.bold.greenBright("Created path: " + subredditFolder))});

    PrintStatus(url, title);

    request({url: url}, (error, res) => {

        // console.log('content-type:', res.headers['content-type']);

        // The response from from certain image hosting sites on Reddit will send back an HTML file instead of the image. 
        // It's necessary to 
        if(res.headers['content-type'] === "text/html; charset=utf-8" || res.headers['content-type'] === "text/html;charset=utf-8"
        || res.headers['content-type'] === "text/html; charset=UTF-8"  || res.headers['content-type'] === "text/html;charset=UTF-8")
        {
           console.log(chalk.inverse.red.bold("Detected a video / gif")); 
         
            if(url.includes('i.redd.it'))
            { 
                CreateFile(url, title, subredditFolder, ".gif")
            }
            else if(url.includes('.gifv') && url.includes('imgur'))
            {
                var splitLink = url.split('.'); 
                
                splitLink[splitLink.length-1] = "mp4"

                var newLink = splitLink.join('.')

                CreateFile(newLink, title, subredditFolder, ".mp4")
            }
            else if(url.includes('redgifs'))
            {
                var newLink = ParseRedGifs(res)
                CreateFile(newLink, title, subredditFolder, ".mp4")
            }
        }
        else{
            CreateFile(url, title, subredditFolder, ".jpg")
        }
    })  
}

const ParseTitle = (title) => {
    var newTitle = title.replace(/[^A-Z0-9]/ig, "_"); 

    return newTitle; 
}

const GetSavedConent = (imageLimit) => {
    user.getMe().getSavedContent({amount: imageLimit}).then((saved) => {

        saved.forEach(save => {
            DownloadFile(save.url, save.title, () => {console.log("Downloading...")})
        });
    }); 
}

const startDownload = (subreddit, imageLimit, filter, time) => {
    console.log("Beggining download")
    
    subredditFolder = imageDirPath + subreddit + "/"; 

    if(subreddit.toLowerCase() === 'me')
        GetSavedConent(imageLimit)
    else if(filter.toLowerCase() === 'hot'){
        user.getSubreddit(subreddit)
            .getHot({limit: parseInt(imageLimit)})
            .map(post => DownloadFile(post.url, post.title, () => {
                console.log(chalk.inverse.bold.blue('Finished...'))
            })); 
    }
    else if(filter.toLowerCase() === 'top')
    {
        if(!validTime.includes(time))
            return console.log(chalk.inverse.bold.red("Please enter a valid time. 'today', 'week', 'month', 'year', 'all'"))

        user.getSubreddit(subreddit)
            .getTop({time: time, limit: parseInt(imageLimit)})
            .map(post => DownloadFile(post.url, post.title, () => {
                console.log(chalk.inverse.bold.blue('Finished...'))
            })); 
    } 
}
    
module.exports = {startDownload}