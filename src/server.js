const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const https = require('https');
const http = require('http');
const console = require("./modules/personal/jrConsole");
const fs = require("fs-extra");

const databaseManager = require("./modules/databaseManager");
const searchManager = require("./modules/searchManager");



/***********************************************************
** Server Setup
************************************************************/

// setup the express server
const app = express();
app.use(bodyParser.json({limit: '8mb'}));

// Allows access to the public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true , limit: '8mb'}));

// Create the database
databaseManager.createDB();


/***********************************************************
** Routing
************************************************************/


/************************
** POST
*************************/

/**
 * Use POST to request specific data from the API and get an array of titles as a return
 */
app.route(`/NetflixAPI/titles`).post(async (req, res) => {
    res.type(`application/json`);

    // Execute the search for this content
    searchManager.getTitles(req.body).then((searchData)=>{
        res.send(searchData);
    }).catch((err)=>{
        res.send(`Unable to process search: ${err}`);
    });
});

/**
 * Use POST to request specific data from the API and get an array of credits as a return
 */
app.route(`/NetflixAPI/credits`).post(async (req, res) => {
    res.type(`application/json`);

    // Execute the search for this content
    searchManager.getCredits(req.body,false).then((searchData)=>{
        res.send(searchData);
    }).catch((err)=>{
        res.send(`Unable to process search: ${err}`);
    });
});

/************************
** GET
*************************/

// 1. Retrieve show or movie by title.
app.get("/NetflixAPI/titles/byTitle/:titleName",async (req, res)=>{
    res.type(`application/json`);

    // Execute the search for this content
    searchManager.getTitles({title: req.params.titleName, isExactMatch:true}).then((searchData)=>{
        res.send(searchData);
    }).catch((err)=>{
        res.send(`Unable to process search: ${err}`);
    });
});

// 2. Retrieve list of actors and directors for a show or movie by title.
app.get("/NetflixAPI/credits/byTitle/:titleName",async (req, res)=>{
    res.type(`application/json`);

    // Execute the search for this content
    searchManager.getCredits({title: req.params.titleName, isExactMatch:true},false).then((searchData)=>{
        res.send(searchData);
    }).catch((err)=>{
        res.send(`Unable to process search: ${err}`);
    });
});

// 3. Retrieve list of shows and movies by actor name.
app.get("/NetflixAPI/titles/byActor/:actorName",async (req, res)=>{
    res.type(`application/json`);

    // Execute the search for this content
    searchManager.getTitles({actor: req.params.actorName, isExactMatch:true}).then((searchData)=>{
        res.send(searchData);
    }).catch((err)=>{
        res.send(`Unable to process search: ${err}`);
    });
});


/***********************************************************
** Run Server
************************************************************/

// Create the Https server
https.createServer(null, app).listen(443);

// Create the http server
// Used for local hosting so forwarding http to https is not required
if(true){
    console.log("Starting server on port 80");
    http.createServer(app).listen(80);
}else{
    console.log("Forwarding 80 to 443");
    http.createServer(function (req, res) {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        res.end();
    }).listen(80);
}

console.log('Server started!');

