
let console = require("./personal/jrConsole");
const sanitize = require('mongo-sanitize');
const databaseManager = require("./databaseManager");

module.exports = class{

    /**
     * Pareses a request body and return search objects for mongodb
     * @param {Object} content Request body to parse for search options
     * @returns {Promise<{titles:Object,credits:Object}>} Search options to pass to mongo
     */
    static build(content){
        // options to search titles
        let titleSearchOptions = {};

        // options to search credits
        let creditSearchOptions = null;


        // Check if we're searching by title
        if(isValidString(content.title)){
            titleSearchOptions.title = sanitize(content.title);
        }

        // Check if we're searching by type of title type
        if(isValidString(content.type)){
            titleSearchOptions.type = sanitize(content.type);
        }

        // Check if we're searching by release year
        if(isValidString(content.release_year)){
            titleSearchOptions.release_year = sanitize(content.release_year);
        }

        // Check if we're searching by age certification
        if(isValidString(content.age_certification)){
            titleSearchOptions.release_year = sanitize(content.release_year);
        }

        // Check if we're searching by genres
        if(content.genres){
            // Check if this is an array
            if(Array.isArray(content.genres)){
                titleSearchOptions.genres = {$all:sanitize(content.genres)}
            }else{
                titleSearchOptions.genres = sanitize(content.genres);
            }
        }

        // If we need to search the credits table
        if(content.actor || content.director || content.credit){
            creditSearchOptions = {};

            // if we're searching by any credit
            if(isValidString(content.credit)){
                creditSearchOptions.credit = sanitize(content.credit);
            }

            // If we're searching by actor
            if(isValidString(content.actor)){
                creditSearchOptions.actor = sanitize(content.actor);
            }

            // If we're searching by director
            if(isValidString(content.director)){
                creditSearchOptions.director = sanitize(content.director);
            }
        }

        // Check to make sure something was added as a search
        if(Object.keys(titleSearchOptions).length === 0 && Object.keys(creditSearchOptions).length === 0){
            titleSearchOptions = null;
        }

        return {
            titles: titleSearchOptions,
            credits: creditSearchOptions
        };
    
    }


    /**
     * Builds and executes a search on the database
     * @param {Object} content Object containing properties following the API rules
     * @returns {Promise<Array>} Array of titles or credits that match the search
     */
    static executeTitles(content){
        return new Promise(async (resolve,reject)=>{
            // Build the search options
            let searchOptions = this.build(content);


            // Search the database for all the tiles that match the search criteria
            databaseManager.searchTitles(searchOptions.titles,searchOptions.credits).then((searchData)=>{
                return resolve(searchData);
            }).catch((err)=>{
                return reject(err);
            });

        });
    }

    /**
     * Builds and executes a search on the database
     * @param {Object} content Object containing properties following the API rules
     * @returns {Promise<Array>} Array of titles or credits that match the search
     */
     static executeCredits(content){
        return new Promise(async (resolve,reject)=>{
            // Build the search options
            let searchOptions = this.build(content);

            // Search the database for all the credits that match the search criteria
            databaseManager.searchCredits(searchOptions.titles,searchOptions.credits).then((searchData)=>{
                return resolve(searchData);
            }).catch((err)=>{
                return reject(err);
            });

        });
    }

}


/**
 * Checks if the string is valid
 * @param {String} string String to check
 * @returns {Boolean}
 */
function isValidString(string){
    // Check if undefined || null
    if(string === undefined || string === null){
        return false;
    }

    // Check the type is a string
    if (typeof string === 'string' || string instanceof String){
        return true;
    }

    return false;
}