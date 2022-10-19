/////////////////////////////////////////////

const fs = require("fs-extra");

//          COLOURS
const reset = "\x1b[0m";
const bright = "\x1b[1m";

// const black = bright + "\x1b[30m";
// const red = bright + "\x1b[31m";
// const green = bright + "\x1b[32m";
// const yellow = bright + "\x1b[33m";
// const blue = bright + "\x1b[34m";
// const megenta = bright + "\x1b[35m";
// const cyan = bright + "\x1b[36m";
// const white = bright + "\x1b[37m";

const bgBlack = "\x1b[40m";
const bgRed = "\x1b[41m";
const bgGreen = "\x1b[42m";
const bgYellow = "\x1b[43m";
const bgBlue = "\x1b[44m";
const bgMagenta = "\x1b[45m";
const bgCyan = "\x1b[46m";
const bgWhite = "\x1b[47m";



/////////////////////////////////////////////
//const logs = require("./files/logs");

let startTime = null;
let isTest = true;

module.exports = class {
    /**
     * @description Function that saves the start time
     */
    static start(){
        startTime = Date.now();
    }

    /**
     * @description Outputs to the console and saves to log
     * @param {string} string String to output
     */
    static log(string){
        console.log(timestamp() + string + reset);

        saveLogToTranscript(timestamp() + string + reset);
    }

    /**
     * @description outputs a parse error to the console
     * @param {string} string String to output
     */
    static error_parse(string){
        console.log(bgRed + timestamp() + green("PARSE ERROR: ") + string + reset);

        saveLogToTranscript(bgRed + timestamp() + green("PARSE ERROR: ") + string + reset);
    }

    /**
     * @description Outputs the given error to console
     * @param {string} reason Reason for error
     * @param {string} string String to output
     */
    static error(reason,string){
        console.log(bgRed + timestamp() + green(reason.toUpperCase()) + ": " + string + reset);

        saveLogToTranscript(bgRed + timestamp() + green(reason.toUpperCase()) + ": " + string + reset);
    }

    /**
     * @description Used for testing output
     * @param {string} string String to output
     */
    static test(string){
        if(isTest){
            console.log(green(string) + reset);
        }
    }

    /**
     * @description Used for testing output
     * @param {string} string String to output
     * @param {bool} bool output to show
     */
    static testEqual(case1, case2){
        if(isTest){
            if(case1 == case2){
                console.log(bgGreen + white(case1 + " ==" + case2) + reset);
            }else{
                console.log(bgRed + white(case1 + " ==" + case2) + reset);
            }
        }
    }

    /**
     * @description Used for testing output
     * @param {string} string Object to output
     */
    static object(object){
        let string = JSON.stringify(object, null, 2);

        string = string.replace(/\[/gm,cyan("["));
        string = string.replace(/\]/gm,cyan("]"));
        string = string.replace(/\"/gm,megenta("\""));
        string = string.replace(/,/gm,red(","));

        string += reset;

        if(isTest){
            console.log(string);
        }

        return string;


        // Not used, removes circular structure
        function censor(censor) {
            var i = 0;
            
            return function(key, value) {
              if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
                return '[Circular]'; 
              
              if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
                return '[Unknown]';
              
              ++i; // so we know we aren't using the original object anymore
              
              return value;  
            }
        }
    }

    /**
     * @description Outputs loading information to console
     * @param {string} string String to output
     */
    static load(string){
        console.log(timestamp() + megenta(string) + " loaded." + reset);

        saveLogToTranscript(timestamp() + megenta(string) + " loaded." + reset);
    }

    /**
     * @description Outputs the version number nicely to code
     * @param {object} versionNum Object that holds version number info
     */
    static versionNum(versionNum){
        console.log(`${timestamp()}v${red(versionNum.release)}.${cyan(versionNum.major)}.${yellow(versionNum.minor)}.${green(versionNum.patch)} Build ${megenta(versionNum.build)}`+reset);
    }

    /**
     * @description Outputs saving information to console
     * @param {string} string String to output
     */
    static save(string){
        console.log(timestamp() + cyan(string) + reset);

        saveLogToTranscript(timestamp() + cyan(string) + reset);
    }

    /**
     * @description Command information to the console
     * @param {string} name Name of the person using the command
     * @param {string} command Command used
     * @param {string} args All the arguments used
     */
    static command(name, command, args){
        console.log(timestamp() + green(name) + " used the command !" + green(command) + " with arguments "+ green(args) + reset);

        saveLogToTranscript(timestamp() + green(name) + " used the command !" + green(command) + " with arguments "+ green(args) + reset);
    }

    /**
     * 
     * @param {string} player Name of the player
     * @param {Number} levels Amount of levels gained
     * @param {string} skill Skill the levels were gained in
     */
    static levelUp(player, levels, skill){
        console.log(timestamp() + green(player) + " gained " + green(levels) + " levels in " + green(skill));

        saveLogToTranscript(timestamp() + green(player) + " gained " + green(levels) + " levels in " + green(skill));
    }

    /**
     * 
     * @param {string} player Name of the player
     * @param {number} milestone Milestone reached
     */
    static milestone(player, milestone){
        console.log(timestamp() + green(player) + " reached a milestone of " + green(milestone) + " total levels." + reset);

        saveLogToTranscript(timestamp() + green(player) + " reached a milestone of " + green(milestone) + " total levels." + reset);
    }

    /**
     * @description Clears the console
     */
    static clear(){
        console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
    }

    /**
     * @description Adds a blank line to the console
     */
    static blank(){
        console.log("\n");
    }

    /**
     * @description Adds a line to the console
     */
    static separator(){
        console.log(blue("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~") + reset);
    }

    /**
     * @description Gets a string of the current time. Ex: 12:45:58
     */
    static getTime(){
        let time = new Date();
        return time.toLocaleTimeString();
    }

    /**
     * @description Gets a string of the current date
     */
    static getDate(){
        let time = new Date();
        return time.toDateString();
    }


    static testMode(isTest){
        if(isTest){
            console.log(timestamp() + green("Bot is ") + "in Testing Mode." + reset);
        }else{
            console.log(timestamp() + red("Bot IS NOT ") + "in Testing Mode." + reset);
        }
    }

    /**
     * @description Tells the console module that this run is a test
     */
    static startTesting(){
        isTest = true;
    }

    /**
     * @description log used when a pet is added
     * @param {string} name Name of the member who added the picture
     * @param {URL} path Path to the image upladed
     */
    static addPet(name, path){
        console.log(timestamp() + green(name) + " Added a picture to " + green(path) + reset);

        saveLogToTranscript(timestamp() + green(name) + " Added a picture to " + green(path) + reset);
    }

    /**
     * @description Grabs a random image of a pet from the files
     * @param {string} player Name of the player who asked for a random pet
     * @param {string} owner Name of the player who owns the pet pic
     * @param {URL} path Path of the image
     */
    static randomPet(player, owner, path){
        console.log(timestamp() + green(player) + " got a random pet from " + green(owner) + " with path " + green(path) + reset);

        saveLogToTranscript(timestamp() + green(player) + " got a random pet from " + green(owner) + " with path " + green(path) + reset);
    }

    /**
     * @description Get the time that the bot started
     * @returns {string} Time the bot started in ms
     */
    static getLogTime(){
        return startTime;
    }

    static newCommand(commandName,calls){
        console.log(`${timestamp()}Created new command called: ${green(commandName)} With call: ${cyan(calls.join(", "))} ${reset}`);

        saveLogToTranscript(`${timestamp()}Created new command called: ${green(commandName)} With call: ${cyan(calls.join(", "))} ${reset}`);
    }

    static newContextMenu(commandName,calls){
        console.log(`${timestamp()}Created new context menu called: ${green(commandName)} With call: ${cyan(calls.join(", "))} ${reset}`);

        saveLogToTranscript(`${timestamp()}Created new context menu called: ${green(commandName)} With call: ${cyan(calls.join(", "))} ${reset}`);
    }

    static changedName(pastName,newName){
        console.log(`${timestamp()}Changed name from ${red(pastName)} to: ${green(newName)} ${reset}`);
    }

}


/**
 * @description turns all the given text into red
 * @param {string} string Text to turn red
 * @returns {string} With colour codes
 */
function red(string){
    return "\x1b[1m" + "\x1b[31m" + string + "\x1b[37m";
}

/**
 * @description turns all the given text into green
 * @param {string} string Text to turn green
 * @returns {string} With colour codes
 */
function green(string){
    return "\x1b[1m" + "\x1b[32m" + string + "\x1b[37m";
}

/**
 * @description turns all the given text into yellow
 * @param {string} string Text to turn yellow
 * @returns {string} With colour codes
 */
function yellow(string){
    return "\x1b[1m" + "\x1b[33m" + string + "\x1b[37m";
}

/**
 * @description turns all the given text into blue
 * @param {string} string Text to turn blue
 * @returns {string} With colour codes
 */
function blue(string){
    return "\x1b[1m" + "\x1b[34m" + string + "\x1b[37m";
}

/**
 * @description turns all the given text into megenta
 * @param {string} string Text to turn megenta
 * @returns {string} With colour codes
 */
function megenta(string){
    return "\x1b[1m" + "\x1b[35m" + string + "\x1b[37m";
}

/**
 * @description turns all the given text into cyan
 * @param {string} string Text to turn cyan
 * @returns {string} With colour codes
 */
function cyan(string){
    return "\x1b[1m" + "\x1b[36m" + string + "\x1b[37m";
}

/**
 * @description turns all the given text into white
 * @param {string} string Text to turn white
 * @returns {string} With colour codes
 */
function white(string){
    return "\x1b[1m" + "\x1b[37m" + string;
}

/**
 * @description Returns the default starting to a console line
 * @returns "TIME -> "
 */
function timestamp(){
    let time = new Date().toLocaleTimeString();
    return yellow(time) + blue(" -> ");
}


async function saveLogToTranscript(line){

    let output = line.replace(/\x1b.{2,3}m/gm,"") + "\n";

    // ensure the file exists
    fs.ensureDir("./logs/").then((res)=>{
        fs.ensureFile(`./logs/${startTime}.txt`).then((res)=>{
            fs.appendFile(`./logs/${startTime}.txt`,output);
        }).catch((err)=>{
            console.log("Unable to create log file");
        })
    }).catch((err)=>{
        console.log("Unable to create log folder");
    })
}