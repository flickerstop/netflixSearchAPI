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

// let movieContentOptions = {
//     title,
//     type,
//     release_year,
//     age_certification,
//     genres,
//     credit,
//     actor,
//     director
// }


/************************
** POST
*************************/

/**
 * Use POST to request specific data from the API and get an array of titles as a return
 */
app.route(`/NetflixAPI/titles`).post(async (req, res) => {
    res.type(`application/json`);

    // Execute the search for this content
    searchManager.executeTitles(req.body).then((searchData)=>{
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
    searchManager.executeCredits(req.body,false).then((searchData)=>{
        res.send(searchData);
    }).catch((err)=>{
        res.send(`Unable to process search: ${err}`);
    });
});

/************************
** GET
*************************/

// Retrieve show or movie by title.
app.get("/NetflixAPI/titles/byTitle/:titleName",async (req, res)=>{
    res.type(`application/json`);

    // Execute the search for this content
    searchManager.executeTitles({title: req.params.titleName}).then((searchData)=>{
        res.send(searchData);
    }).catch((err)=>{
        res.send(`Unable to process search: ${err}`);
    });
});


// Retrieve list of shows and movies by actor name.
app.get("/NetflixAPI/titles/byCredit/:creditName",async (req, res)=>{
    res.type(`application/json`);

    // Execute the search for this content
    searchManager.executeTitles({credit: req.params.creditName}).then((searchData)=>{
        res.send(searchData);
    }).catch((err)=>{
        res.send(`Unable to process search: ${err}`);
    });
});


// Retrieve list of actors and directors for a show or movie by title.
app.get("/NetflixAPI/credits/byTitle/:titleName",async (req, res)=>{
    res.type(`application/json`);

    // Execute the search for this content
    searchManager.executeCredits({title: req.params.titleName},false).then((searchData)=>{
        res.send(searchData);
    }).catch((err)=>{
        res.send(`Unable to process search: ${err}`);
    });
});


// Retrieve list of actors and directors for a show or movie by actor or director.
app.get("/NetflixAPI/credits/byCredit/:creditName",async (req, res)=>{
    res.type(`application/json`);

    // Execute the search for this content
    searchManager.executeCredits({credit: req.params.creditName},false).then((searchData)=>{
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

