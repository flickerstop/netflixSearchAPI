
let console = require("../jrConsole");

const { MongoClient } = require("mongodb");

// Connection URL
let db = {
    url: null,
    dbName: null,
    client: null,
    manager: null
}


module.exports = class {


    /***********************************************************
    ** Connections
    ************************************************************/

    /**
     * Connects to a MongoDB server but NOT a database
     * @param {String} url URL:port for the mongodb to connect to
     * @returns {Promise} Containing nothing but returned when the server has connected or not
     */
    static connect(url = 'mongodb://localhost:27017'){
        return new Promise(async (resolve, reject)=>{
            // Save the data
            db.url = url;

            // Connect to the host
            db.client = new MongoClient(db.url, {
                useUnifiedTopology: true
            });

            // Try to see if the connection worked
            try {
                await db.client.connect();
                
                console.log(`jrMongo connected to ${db.url}`);
                return resolve();
            }catch(e){
                console.error(`jrMongo failed to connect ${db.url}`);
                return reject();
            }
        });
    }

    /**
     * Connect to a MongoDB server AND database 
     * @param {String} dbName Name of the DB to connect to
     * @param {String} url URL:port of the mongodb server
     * @returns {Promise} Containing nothing but returned when the server has connected or not
     */
    static setup(dbName,url = 'mongodb://localhost:27017'){
        return new Promise(async (resolve, reject)=>{
            // Save the data
            db.dbName = dbName;
            db.url = url;

            // Connect to the host
            db.client = new MongoClient(db.url, {
                useUnifiedTopology: true
            });

            // Try to see if the connection worked
            try {
                await db.client.connect();
                db.manager = db.client.db(db.dbName);
                
                console.log(`jrMongo connected to ${db.dbName}@${db.url}`);
                return resolve();
            }catch(e){
                console.error(`jrMongo failed to connect ${db.dbName}@${db.url}`);
                return reject();
            }
        });
    }

    /***********************************************************
    ** Database Management
    ************************************************************/

    /**
     * 
     * @param {String} dbName Database name to set
     * @returns {Promise} Containing nothing but returned when the db has been set
     */
    static setDB(dbName){
        return new Promise(async (resolve, reject)=>{

            // Set the database
            db.dbName = dbName;

            // Try to see if the db worked
            try {
                db.manager = db.client.db(db.dbName);
                
                console.log(`jrMongo set DB to ${db.dbName}`);
                return resolve();
            }catch(e){
                console.error(`jrMongo failed to set DB to ${db.dbName}`);
                return reject();
            }
        });
    }

    /**
     * Drops a database from the mongodb server
     * @param {String} dbName Name of the DB to drop
     * @returns {Promise} if failed then error data, else dropped db result
     */
    static deleteDB(dbName){
        return new Promise(async (resolve, reject)=>{

            try {
                // Connect to this database
                let database = db.client.db(dbName);

                // Drop this database
                database.dropDatabase((err,res)=>{
                    // Check if worked
                    if(err == null){
                        console.log(`Dropped DB ${dbName}`);
                        return resolve(res);
                    }else{
                        console.error(`jrMongo failed to drop DB ${dbName}`);
                        return reject(err)
                    }
                });
            }catch(e){
                return reject(e);
            }
        });
    }

    /***********************************************************
    ** Tables
    ************************************************************/

    /**
     * Adds a new table to the database
     * @param {String} tableName Name of the new table to add
     * @param {Object} tableOptions Table options to use
     * @returns {Promise} If table was added
     */
    static createTable(tableName,tableOptions = {}){
        return new Promise(async (resolve, reject)=>{
            db.manager.createCollection(tableName,tableOptions,(err, collection)=>{
                if(err == null){
                    return resolve();
                }else{
                    return reject(err);
                }
            });
        });
    }

    /***********************************************************
    ** Indexes
    ************************************************************/

    /**
     * Creates an index for a specific value
     * @param {String} tableName Name of the table to add the index to
     * @param {Object} sortType How to sort this index: {field_name: 1}
     * @returns {Promise} If index was added
     */
    static createIndex(tableName, sortType){
        return new Promise(async (resolve, reject)=>{
            db.manager.collection(tableName).createIndex(sortType);
            return resolve();
        });
    }

    /**
     * Creates an index for a specific value
     * @param {String} tableName Name of the table to add the index to
     * @param {Object} sortType How to sort this index: {field_name: 1}
     * @param {*} value What value(s) to use for this index: {field_name: value}
     * @returns {Promise} If index was added
     */
    static createFilteredIndex(tableName, sortType,value){
        return new Promise(async (resolve, reject)=>{
            db.manager.collection(tableName).createIndex(
                sortType,
                { partialFilterExpression: value }
            );

            return resolve();
        });
    }

    /***********************************************************
    ** Searches
    ************************************************************/

    /**
     * Finds and returns ALL the data from a table
     * @param {String} tableName Name of the table to search
     * @returns {Array} All the data from this table
     */
    static findAll(tableName){
        return new Promise(async (resolve, reject)=>{
            db.manager.collection(tableName).find({}).toArray().then(async (returnedData)=>{
                return resolve(returnedData);
            }).catch((err)=>{
                return reject(err);
            });
        });
    }

    /**
     * Finds the specific data in the table with the given search pattern
     * @param {String} tableName Name of the table to search
     * @param {Object} searchFor Data in the table to search for
     * @returns {Array} All the data from this table matching the search
     */
    static find(tableName,searchFor = {}){
        return new Promise(async (resolve, reject)=>{
            db.manager.collection(tableName).find(searchFor).toArray().then(async (returnedData)=>{
                return resolve(returnedData);
            }).catch((err)=>{
                return reject(err);
            });
        });
    }


    /**
     * Finds the specific data in the table with the given search pattern
     * @param {String} tableName Name of the table to search
     * @param {Object} searchFor Data in the table to search for
     * @param {Number} limit Limit the search to this many results
     * @returns {Array} The first x amount of the data from this table matching the search
     */
    static findLimit(tableName,searchFor,limit){
        return new Promise(async (resolve, reject)=>{

            // Check if the limit is a positive number
            if(limit < 0){
                return reject("Invalid limit set");
            }

            db.manager.collection(tableName).find(searchFor).limit(limit).toArray().then(async (returnedData)=>{
                return resolve(returnedData);
            }).catch((err)=>{
                return reject(err);
            });
        });
    }

    /**
     * Gets only the first element from the searched table
     * @param {String} tableName Name of the table to search
     * @param {Object} searchFor Data in the table to search for
     * @returns Only the first result in this table matching this search
     */
    static findFirst(tableName,searchFor = {}){
        return new Promise(async (resolve, reject)=>{
            db.manager.collection(tableName).find(searchFor).toArray().then(async (returnedData)=>{
                return resolve(returnedData[0]);
            }).catch((err)=>{
                return reject(err);
            });
        });
    }
    
    /**
     * Adds a single element to the table
     * @param {String} tableName Name of the table to add the data to
     * @param {Object} newObject Single object to add to the table
     * @returns {Object} _id of the inserted data
     */
    static add(tableName,newObject){
        return new Promise(async (resolve, reject)=>{
            db.manager.collection(tableName).insertOne(newObject).then(async (returnedData)=>{
                return resolve(returnedData);
            }).catch((err)=>{
                return reject(err);
            });
        });
    }

    /**
     * Adds many elements to the table
     * @param {String} tableName Name of the table to add the data to
     * @param {Array} arrayOfNewObjects Array of objects to add to the new table
     * @returns {Array} [_id] of the inserted data
     */
    static addMany(tableName,arrayOfNewObjects){
        return new Promise(async (resolve, reject)=>{
            // Grab the settings for the DB
            db.manager.collection(tableName).insertMany(arrayOfNewObjects).then(async (returnedData)=>{
                return resolve(returnedData);
            }).catch((err)=>{
                return reject(err);
            });
        });
    }

    /**
     * Updates all entries in the database that match the search with new data
     * @param {String} tableName Name of the table to update data for
     * @param {Object} searchFor Data to search for in the table
     * @param {Object} updateTo Data to update to in the table
     * @returns {Object} matchedCount, modifiedCount, upsertedId 
     */
    static updateMany(tableName,searchFor,updateTo){
        return new Promise(async (resolve, reject)=>{
            db.manager.collection(tableName).updateMany(searchFor, {$set:updateTo}).then((res)=>{
                return resolve(res);
            }).catch((err)=>{
                return reject(err);
            });
        });
    }

    /**
     * Delete all entries that match the 
     * @param {String} tableName Name of the table to update data for
     * @param {Object} searchFor Data to search for in the table
     * @returns deletedCount 
     */
    static deleteMany(tableName,searchFor = {}){
        return new Promise(async (resolve, reject)=>{
            db.manager.collection(tableName).deleteMany(searchFor).then((res)=>{
                return resolve(res);
            }).catch((err)=>{
                return reject(err);
            });
        });
    }

    /**
     * Counts the amount of entries in the database matching this search
     * @param {String} tableName Name of the table to update data for
     * @param {Object} searchFor Data to search for in the table
     * @returns {Promise<Number>} Amount of entries
     */
    static count(tableName,searchFor = {}){
        return new Promise(async (resolve, reject)=>{
            db.manager.collection(tableName).find(searchFor).toArray().then(async (returnedData)=>{
                return resolve(returnedData.length);
            }).catch((err)=>{
                return reject(err);
            });
        });
    }

    /**
     * Gets the names of the tables in this database
     * @returns {Array<String>} Names of the tables
     */
    static getTableNames(){
        return new Promise(async (resolve, reject)=>{
            db.manager.collections().then(async (collections)=>{
                let tableNames = [];
                for(let collection of collections){
                    tableNames.push(collection.collectionName);
                }
                return resolve(tableNames);
            }).catch((err)=>{
                return reject(err);
            });
        });
    }
}