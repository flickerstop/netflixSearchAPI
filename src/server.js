const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const https = require('https');
const http = require('http');
const console = require("./modules/personal/jrConsole");
const fs = require("fs-extra");

const mongo = require("./modules/mongo");



let options = null;
if(true){ // if testing at home
    console.test("Entering test mode");
    isTestMode = true;
}else{
    // Set the options to use SSL keys
    options = {
        cert: fs.readFileSync('fullchain.pem'),
        key: fs.readFileSync('privkey.pem')
    }
}

/**
 * 
 * The user should be able to perform the following actions:
 *      Retrieve show or movie by title.
 *      Retrieve list of actors and directors for a show or movie by title.
 *      Retrieve list of shows and movies by actor name.
 *   Bonus:
 *      Filter results by one or more attributes
 * 
 */



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
mongo.createDB();


/***********************************************************
** Routing
************************************************************/

let contentOptions = {
    
}


// Route the /netflix to this API
app.route(`/NetflixAPI`).post((req, res) => {

    console.object(req.body);
    // FIXME
    res.send("hi");
});


// app.get("/sales/:itemType/:itemName",(url)=>{
//     return new Promise(async function(resolve, reject) {

//         dbManager.getItemData(url.urlParameters.itemType,url.urlParameters.itemName).then((res)=>{
//             let html = htmlBuilder.startBuild()
//                 .replaceTag("PAGE_TITLE","Meteor Scroll")
//                 .replaceTag("JSON_DATA",`<script>let jsonData = ${JSON.stringify(res)};</script>`)
//                 .generate();



//             return resolve(html); 
//         }).catch((err)=>{
//             console.error("Finding url data",err);
//         });
//     });
// });




/***********************************************************
** Run Server
************************************************************/

// Create the Https server
https.createServer(options, app).listen(443);

// Create the http server
if(isTestMode){
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

