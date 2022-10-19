
const path = require("path");
let jrMongo = require("./personal/jrMongo");
let jrCSV = require("./personal/jrCSV");
let console = require("./personal/jrConsole");

module.exports = class{


    /**
     * Creates the database for saving the tv/show data
     * @param {STRING} titlesPath Path to the titles.csv
     * @param {STRING} creditsPath Path to the credits.csv
     * @returns {Promise}
     */
    static createDB(titlesPath = "/data/titles.csv",creditsPath = "/data/credits.csv"){
        return new Promise(async (resolve,reject)=>{

            let startTime = Date.now();

            console.log("Connect to server");
            // Connect to the mongo server
            await jrMongo.connect().catch((err)=>{
                // Unable to connect to the server
                // TODO
                console.log(err);
            });


            console.log("Delete DB");
            // Check if there's a DB with this name
            // If there is, delete it
            await jrMongo.deleteDB("NetflixAPI").catch((err)=>{
                // Unable to delete DB
                // TODO
                console.log(err);
            });


            console.log("Create the DB");
            // Create the DB
            await jrMongo.setDB("NetflixAPI").catch((err)=>{
                // Unable to set db
                // TODO
                console.log(err);
            });

            
            console.log("Add Tables");
            // Add tables
            await jrMongo.createTable("Credits").catch((err)=>{
                console.log(err);
            });

            await jrMongo.createTable("Titles").catch((err)=>{
                console.log(err);
            });


            // Read the files
            let titles = await jrCSV.convertToObj(path.join(__dirname,"..",titlesPath)).catch((err)=>{console.log(err)});
            let credits = await jrCSV.convertToObj(path.join(__dirname,"..",creditsPath)).catch((err)=>{console.log(err)});


            // Indexes to create
            let indexes = {
                titles:["type","release_year","age_certification","runtime","genres","production_countries","seasons","imdb_score","imdb_votes","tmdb_popularity","tmdb_score"],
                credits:["person_id","id","name","role"]
            }


            // Fix genres and production_countries in titles to arrays
            for(let title of titles){
                // Convert the genres from string to array
                title.genres = arrayFromString(title.genres);

                // Convert the production countries from string to array
                title.production_countries = arrayFromString(title.production_countries);
            }


            // Create the indexes for titles.csv
            for(let index of indexes.titles){
                await jrMongo.createIndex("Titles",{[index]:1});
            }

            // Create the indexes for credits.csv
            for(let index of indexes.credits){
                await jrMongo.createIndex("Credits",{[index]:1});
            }

            // Add to the databases
            await jrMongo.addMany("Titles",titles);
            await jrMongo.addMany("Credits",credits);


            console.log(`Time to setup Database: ${Date.now() - startTime}ms`);
        });
    }

}

/**
 * Nicely converts a string array to an array
 * @param {String} string ['aaa','bbb']
 * @returns {Array<String>} Array with all the values
 */
function arrayFromString(string){
    return JSON.parse(string.replace(/'/gm,"\""));
}

/**
 * Adds the value to the passed array only if it's not in there already
 * @param {*} value Value to check for in the array
 * @param {Array} array Array to add the value to
 */
function addIfNew(value,array){
    if(!array.includes(value)){
        array.push(value);
    }
}