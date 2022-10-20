
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
            await jrMongo.connect("mongodb://localhost:27017").catch((err)=>{
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




    /**
     * Searches for titles that match all the search criteria
     * @param {Object} titlesSearchOption Search options for titles
     * @param {Object} creditsSearchOptions Search options for credits
     * @returns {Array} Array of title objects
     */
    static searchTitles(titlesSearchOption, creditsSearchOptions = null){
        return new Promise(async (resolve,reject)=>{

            // Find all the titles with this search criteria
            findTitlesFromSearch(titlesSearchOption,creditsSearchOptions).then((titles)=>{
                return resolve(titles);
            }).catch((err)=>{
                return reject(err);
            });
        });
    }


    /**
     * Searches for credits that match all the search criteria
     * @param {Object} titlesSearchOption Search options for titles
     * @param {Object} creditsSearchOptions Search options for credits
     * @returns {Array} Array of credit objects
     */
    static searchCredits(titlesSearchOption, creditsSearchOptions = null){
        return new Promise(async (resolve,reject)=>{

            // Find all the titles with this search criteria
            findTitlesFromSearch(titlesSearchOption,creditsSearchOptions).then(async (titles)=>{

                // Find all the actors/directors for these movies
                let credits = await jrMongo.find("Credits",{id:{$in:[...titles.map(x=>x.id)]}});

                return resolve(credits);
            }).catch((err)=>{
                return reject(err);
            });
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
 * Searches the database for all matches to the passed search criteria
 * @param {Object} titlesSearchOption Search options for the Titles table
 * @param {Object} creditsSearchOptions Search options for the Credits table
 * @returns {Promise<Array<titles>>} Array containing all the tiles that match these searches
 */
function findTitlesFromSearch(titlesSearchOption, creditsSearchOptions){
    return new Promise(async (resolve,reject)=>{

        // Check if we at least have something to search
        if(titlesSearchOption === null && creditsSearchOptions === null){
            return reject("No valid search criteria");
        }

        // Titles to return
        let titles = null;

        // If we're searching by actor/director
        if(creditsSearchOptions != null){
            let credits = null;

            let refinedCreditsSearch = {};

            // If we're searching for anyone
            if(creditsSearchOptions.credit){
                refinedCreditsSearch.name = creditsSearchOptions.credit;
            }

            // If we're searching for specifically an actor
            if(creditsSearchOptions.actor){
                refinedCreditsSearch.name = creditsSearchOptions.actor;
                refinedCreditsSearch.role = "ACTOR";
            }

            // If we're searching specifically for a director
            if(creditsSearchOptions.director){
                refinedCreditsSearch.name = creditsSearchOptions.director;
                refinedCreditsSearch.role = "DIRECTOR";
            }

            // Get the credits
            credits = await jrMongo.find("Credits",refinedCreditsSearch);

            // Build the search ids
            titlesSearchOption.id = {$in:[...credits.map(x=>x.id)]};

        }

        // Search for the titles
        titles = await jrMongo.find("Titles",titlesSearchOption);

        
        return resolve(titles.map(({ _id, ...item }) => item));
    });
}