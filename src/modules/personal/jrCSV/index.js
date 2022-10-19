
const fs = require("fs-extra");
const csv = require('csv-parser');

module.exports = class {
    

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
