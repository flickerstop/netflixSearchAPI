
const axios = require("axios");
const console = require("./modules/personal/jrConsole");





axios.post('http://localhost/NetflixAPI/titles', {
    actor: "Robert De Niro"
}).then((res) => {
    console.object(res.data);
}).catch((err)=>{
    console.object(err);
});