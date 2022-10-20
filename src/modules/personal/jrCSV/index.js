
const fs = require("fs-extra");
const csv = require('csv-parser');

module.exports = class {
    

    /**
     * Converts a CSV to array of JSON objects
     * @param {String} path Path to the .csv file to convert
     * @returns {Array<Object>} CSV converted using the first line as headers
     */
    static convertToObj(path){
        return new Promise(async function(resolve, reject) {
            
            const results = [];

            fs.createReadStream(path)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    return resolve(results);
                });
        });
    }

}
