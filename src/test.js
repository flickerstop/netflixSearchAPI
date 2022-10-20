const axios = require("axios");
const console = require("./modules/personal/jrConsole");


createPOSTTest('NetflixAPI/credits',{},50);
createPOSTTest('NetflixAPI/titles',{},50);

// 1. Retrieve show or movie by title.
createGETTest(`NetflixAPI/titles/byTitle/Zoey 101`,1);
createPOSTTest('NetflixAPI/titles',{title: "Zoey"},1);

// 2. Retrieve list of actors and directors for a show or movie by title.
createGETTest(`NetflixAPI/credits/byTitle/Breaking Bad`,8);
createPOSTTest('NetflixAPI/credits',{title: "Breaking Bad"},65);
createPOSTTest('NetflixAPI/credits',{title: "Breaking Bad",isExactMatch:true},8);

// 3. Retrieve list of shows and movies by actor name.
createGETTest(`NetflixAPI/titles/byActor/Bryan Cranston`,7);
createPOSTTest('NetflixAPI/titles',{actor: "Bryan Cranston"},7);
createPOSTTest('NetflixAPI/titles',{actor: "Bryan Cranston",isExactMatch:true},7);
createPOSTTest('NetflixAPI/titles',{director: "Bryan Cranston"},0);

createGETTest(`NetflixAPI/titles/byActor/Spike Lee`,2);
createPOSTTest('NetflixAPI/titles',{director: "Spike Lee"},5);
createPOSTTest('NetflixAPI/titles',{actor: "Spike Lee"},2);
createPOSTTest('NetflixAPI/titles',{credits: "Spike Lee"},6);

// Bonus: Filter results by one or more attributes
createPOSTTest('NetflixAPI/credits',{title: "Zoey"},7);
createPOSTTest('NetflixAPI/titles',{actor: "Robert",release_year: "2010"},4);
createPOSTTest('NetflixAPI/titles',{actor: "Robert",release_year: 2010},4);
createPOSTTest('NetflixAPI/titles',{release_year: 2010,type: "SHOW"},19);
createPOSTTest('NetflixAPI/titles',{age_certification:"R"},556);
createPOSTTest('NetflixAPI/titles',{genres:"crime"},936);
createPOSTTest('NetflixAPI/titles',{genres:["drama","crime"]},651);
createPOSTTest('NetflixAPI/titles',{director: "Spike Lee",age_certification:"R"},3);
createGETTest(`NetflixAPI/titles/byActor/232`,0);

/**
 * Created an automated POST test and validates the response
 * @param {String} url URL of the API to ping
 * @param {Object} content Object containing filtering properties
 * @param {Number} expectedResultLength Expected number of results
 */
function createPOSTTest(url,content,expectedResultLength){
    axios.post(`http://localhost/${url}`, content).then((res) => {
        let response = res.data;

        // If we expect no results
        if(expectedResultLength == null){
            console.log(`${url} ${JSON.stringify(content)} Test Provided ${response.length} responses`);
            return
        }
        
        // Check our responses are of the correct length
        if(response.length != expectedResultLength){
            console.error(`Failed on ${url} ${JSON.stringify(content)}`,`response.length == ${response.length} != ${expectedResultLength}`);
            return;
        }

        console.log(`Passed ${url} ${JSON.stringify(content)}`);
    }).catch((err)=>{
        console.log(err);
    });
}


/**
 * Created an automated GET test and validates the response
 * @param {String} url URL of the API to ping
 * @param {Number} expectedResultLength Expected number of results
 */
 function createGETTest(url,expectedResultLength){
    axios.get(`http://localhost/${url}`).then((res) => {
        let response = res.data;

        // If we expect no results
        if(expectedResultLength == null){
            console.log(`GET:${url} Test Provided ${response.length} responses`);
            return
        }
        
        // Check our responses are of the correct length
        if(response.length != expectedResultLength){
            console.error(`Failed on GET:${url}`,`response.length == ${response.length} != ${expectedResultLength}`);
            return;
        }

        console.log(`Passed GET:${url}`);
    }).catch((err)=>{
        console.log(err);
    });
}