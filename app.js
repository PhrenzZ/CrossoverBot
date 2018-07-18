// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const tableSource = new EnmapLevel({name: "userData"});
const userData = new Enmap({provider: tableSource});
// config.token contains the bot's token
// config.prefix contains the message prefix.

//All the variables and shit go up here.
var threestar = [["Blitz Duster", "\\*\\*\\*"], ["Stana", "\\*\\*\\*"], ["Klaus", "\\*\\*\\*"], ["Asgard", "\\*\\*\\*"]];
var fourstar = [["Fluri", "\\*\\*\\*\\*"], ["Lil' Eddy", "\\*\\*\\*\\*"], ["Spinning Niki", "\\*\\*\\*\\*"], ["Tenbra", "\\*\\*\\*\\*"], ["The Mask", "\\*\\*\\*\\*"]];
var fivestar = [["Trav", "\\*\\*\\*\\*\\*"], ["Rudy", "\\*\\*\\*\\*\\*"], ["Cecilia", "\\*\\*\\*\\*\\*"]];
var oldLevelData = require("./leveldata.json");
var oldCharacterData = require("./characterdata.json");
var userdata = new Object();
userdata.collection = [];
userdata.party = [];
userdata.stages = [];
userdata.levels = [];
userdata.powercells = 0;

var characterData = {
	"Stana" : {"Stars" : "\\*\\*\\*", "Combat": "6", "Negotiation": "6", "Acrobatics": "4", "Bio": "A young warlock whose talents were squandered by her incompetant party."},
	"Asgard" : {"Stars" : "\\*\\*\\*", "Combat": "5", "Negotiation": "5", "Acrobatics": "6", "Bio": "Asgard aspires to be a mighty viking, but he’s also a pacifist and a huge coward. He hid in a crate for several hours once."},
	"Klaus" : {"Stars" : "\\*\\*\\*", "Combat": "8", "Negotiation": "0", "Acrobatics": "6", "Bio": "He loves breaking games and finding out exploits. He thinks he's above everyone else, and maybe he is."},
	"Maela" : {"Stars" : "\\*\\*\\*", "Combat": 3, "Negotiation": 7, "Acrobatics": 4, "Bio": "The avatar of the chaotic evil goddess Beshaba, here to cause havoc and love paladins.", "Traits": ["Seduction", "FillerA", "FillerB"],
    "Method": function(id, selectedStage, combatArray) {
      console.log("Maela's 3 star doesn't do anything!");
      return combatArray;
    }},
	"Valtyra" : {"Stars" : "\\*\\*\\*", "Combat": 5, "Negotiation": 8, "Acrobatics": 3, "Bio": "The avatar of the lawful good god Xymor, here to strike down darkness and love succubi.", "Traits": ["Head Over Heels", "FillerA", "FillerB"],
    "Method": function(id, selectedStage, combatArray) {
      var party = userData.get(id);
      party = party.party;
      for (var i = 0; i<party.length; i++) {
        if (party[i][0] == "Maela") {
          combatArray[0] += 1;
          combatArray[1] += 1;
          combatArray[2] += 1;
          console.log("kisses!");
        }
      }
      return combatArray;
    }},
	"Hex" : {"Stars" : "\\*\\*\\*", "Combat": 4, "Negotiation": 1, "Acrobatics": 7, "Bio": "Adrenaline junkie vigilante with no regard for his own safety or that of his allies. He's got two revolvers to double his chances of hitting anything.", "Traits": ["Vendetta", "FillerA", "FillerB"],
    "Method": function(id, selectedStage, combatArray) {
      var stageStatus = levelData[selectedStage]["Statuses"];
      for (var i = 0; i<stageStatus.length; i++) {
        if (stageStatus[i] == "Demons") {
          combatArray[0] += 4;
          console.log("hex beat a demon");
        }
      }
      return combatArray;
    }},
	"Blitz Duster" : {"Stars" : "\\*\\*\\*", "Combat": 7, "Negotiation": 3, "Acrobatics": 4, "Bio": "A rough-and-tumble machineling always ready to throw down or throw a bear.", "Traits": ["Submersible", "FillerA", "FillerB"],
    "Method": function(id, selectedStage, combatArray) {
      var stageStatus = levelData[selectedStage]["Statuses"];
      for (var i = 0; i<stageStatus.length; i++) {
        if (stageStatus[i] == "Water") {
          combatArray[2] += 4;
          console.log("Blitz can swim!");
        }
      }
      return combatArray;
    }},
	"Shock Trooper" : {"Stars" : "\\*", "Combat": -2, "Negotiation": -2, "Acrobatics": -2, "Bio": "This guy is here for testing purposes, he's so god damn BAD."}
};


var levelData = {
"An Encounter with Delphabel" : {"ComDif": 10, "ComBonus": 20, "NegDif": 8, "NegBonus": 30, "AcrDif": 8, "AcrBonus": 10, "Desc": "Fight your way past a horde of demons!", "Base Success": 60, "Next Stage" : "Into the Nightmare", "Statuses" : ["Demons"],
  "Method": function(id, selectedStage, combatArray, totalArray){
    return combatArray;//This does nothing.
  }},
"Into the Nightmare" : {"ComDif": 12, "ComBonus": 30, "NegDif": 10, "NegBonus": 10, "AcrDif": 15, "AcrBonus": 40, "Desc": "All sorts of horrible things lurk down here! Run from them as fast as you can!", "Base Success": 40, "Next Stage" : "Glutrollny", "Statuses" : ["Terrorize the Weak"],
  "Method": function(id, selectedStage, combatArray, totalArray){
    var party = userData.get(id);
    party = party.party;
    for (var i = 0; i<party.length; i++) {
      if (characterData[party[i][0]]["Combat"] <= 4) {
        combatArray[2] -= 2;
        console.log(party[i][0] + "is scared!");
      }
    }
    return combatArray;
  }},
"Glutrollny" : {"ComDif": 15, "ComBonus": 40, "NegDif": 15, "NegBonus": 50, "AcrDif": 0, "AcrBonus": 0, "Desc": "Enormous Glutrollny is here! Whether you fight or talk, there’s no running past him!", "Base Success": 50, "Next Stage" : "I’ll Face Myself", "Statuses" : ["You're Scaring Me", "Not-so-bright"],
  "Method": function(id, selectedStage, combatArray, totalArray){
    var party = userData.get(id);
    party = party.party;
    for (var i = 0; i<party.length; i++) {
      if (party[i][0] == "Maela") {
        combatArray[1] += 3;
        console.log("Maela seduces him!");
      }
    }
    if (totalArray[0] >= 15) {
      combatArray[1] -= 5;
      console.log("the party scares him")
    }
    return combatArray;
  }},
"I’ll Face Myself" : {"ComDif": 13, "ComBonus": -30, "NegDif": 18, "NegBonus": 60, "AcrDif": 10, "AcrBonus": 10, "Desc": "Deep in the nightmare, the heroes find… themselves?", "Base Success": 40, "Next Stage" : "BOSS: Delphabel", "Statuses" : ["None"],
  "Method": function(id, selectedStage, combatArray, totalArray){
    return combatArray;//this does nothing
  }},
"BOSS: Delphabel" : {"ComDif": 15, "ComBonus": 30, "NegDif": 15, "NegBonus": 30, "AcrDif": 15, "AcrBonus": 30, "Desc": "Time to pull out all the stops! Stop Delphabel here and now!", "Base Success": 10, "Next Stage" : ["Space Explorers Act One", "Crash Landing"], "Statuses" : ["Demons"],
  "Method": function(id, selectedStage, combatArray, totalArray){
    return combatArray;//this does nothing
  }}
}


var statusTraitDesc = {
  "Submersible" : "+3 Acrobatics on stages with water",
  "Vendetta" : "+4 Combat on stages with demons",
  "Demons" : "This stage involves demons.",
  "Aquatic" : "This stage involves water.",
  "Head Over Heels" : "+1 to all stats when in the same party as Maela",
  "You're Scaring Me" : "If the party's Combat is 15 or higher, the party loses 5 Negotiation",
  "Terrorize the Weak" : "Characters with 4 or less Combat lose 2 Acrobatics",
  "Seduction" : "Counteracts the Stubborn Enemy status and provides +3 Negotiation against simpletons",
  "Not-so-bright" : "This stage involves a simpleton.",
  "None" : "This stage has no special statuses."
 }


client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

/*Test commands
if (command == "gacha") {
  //Pulls one time on the initialgacha
  var temp = Math.floor(Math.random()*5);
  var pull = initialgacha[temp];
  console.log(temp);
  message.reply('You pulled a ' + pull + '! Congratulations!');
}*/

if (command == "start") {
  //set all the userdata to initial values
  userData.set(message.author.id, userdata);
  var init = userData.get(message.author.id);
  init.collection.push(["Hex", "\\*\\*\\*"]);
  init.collection.push(["Maela", "\\*\\*\\*"]);
  init.collection.push(["Valtyra", "\\*\\*\\*"]);
  init.collection.push(["Blitz Duster", "\\*\\*\\*"]);
  init.collection.push(["Shock Trooper", "\\*"]);
  init.powercells = 1;
  init.stages = [];
  init.party = [];
  init.stages.push(["Demonclutched Act One", "An Encounter with Delphabel"]);
  userData.set(message.author.id, init);
  message.channel.send("Your account has been created! You've been gifted the following characters: Hex \\*\\*\\*, Maela \\*\\*\\*, Valtyra \\*\\*\\*, and Blitz Duster \\*\\*\\*.");
}

if (command == "test") {
  var data = userData.get(message.author.id);
  console.log(characterData["Hex"]["Stars"]);
}

if (command == "clear") {
  userData.set(message.author.id, userdata);
  message.channel.send("I reset your account!");
}

if (command == "main") {
  var data = userData.get(message.author.id);
  var party = data.party;
  var levels = data.stages;
  var cells = data.powercells;
  var name = message.author.username;
  message.channel.send(name + "'s Data: \nPowercells: " + cells + "\nCurrent Party: " + party[0] + ", " + party[1] + ", " + party[2] + "\nUse +stages to see your available stages and +collection to see your collection.")
}

if (command == "fivepull") {
  var threelength = threestar.length;
  var fourlength = fourstar.length;
  var fivelength = fivestar.length;
  var gachaarray = [];
  //pulls five times with the rates 70/20/10
  for (var i=0; i<5; i++) {
    //generate random number 1-10
    var rarity = Math.floor(Math.random()*10);
    //if it's a 3* pull
    if (rarity <= 6) {
      //roll on the 3* table
      var roll = Math.floor(Math.random()*threelength);
      //put the result into the gacha array
      gachaarray.push(threestar[roll]);
    }
    //if it's a 4* pull
    if (rarity == 7 || rarity == 8) {
      //pull on the 4* table
      var roll = Math.floor(Math.random()*fourlength);
      //put into the array
      gachaarray.push(fourstar[roll]);
    }
    //if it's a 5* pull
    if (rarity == 9) {
      var roll = Math.floor(Math.random()*fivelength);
      gachaarray.push(fivestar[roll]);
    }
  }
  //send the roll results
  message.channel.send(gachaarray);
  //get user data
  var temp = userData.get(message.author.id);
//iterate through the user's collection, adding the gacha results to it
for (var i = 0; i < gachaarray.length; i++) {
  var tempTwo = temp.collection;
  tempTwo.push(gachaarray[i]);
  temp.collection = tempTwo;
}
//set the user's data to the updated version
userData.set(message.author.id, temp);
}


if (command == "collection") {
  //grab the user's collection data
  var col = userData.get(message.author.id);
  col = col.collection;
  // if the collection is empty, toss back the error message
  if (col == []) {
    message.channel.send("Your collection is empty!");
  }
  //otherwise, iterate through their collection, putting it all into a nice string
  else {
  var string = "";
  for (var i = 0; i < col.length; i++) {
    string += "" + (i+1) + ". " + col[i][0] + ": " + col[i][1] + "\n";
  }
  //backup error message just in case.
  message.channel.send(string)
    .catch (error => message.reply("you have no collection! Try +start!"));
}
}


if (command == "info") {
  var string = "";
  //figure out what slot the user wants info for
  var desiredSlot = args[0];
  desiredSlot = Math.floor(desiredSlot);
  // adjust desired slot to match the array
  desiredSlot -= 1;
  //get user's collection data
  var temparray = userData.get(message.author.id);
  var temparray = temparray.collection;
  if (desiredSlot >= temparray.length || desiredSlot < 0) {
    message.channel.send("No such slot exists.");
    console.log("I'm here for some reason!");
  }
  if (args[0] == "null") {
    message.channel.send("Please enter a number.");
    console.log("It says null!");
  }
if (desiredSlot < temparray.length && desiredSlot >= 0) {
  //figure out what character corresponds to the desired slot in their collection
  var dataArray = temparray[desiredSlot][0];
  //Send out the info after grabbing it from characterData.json
  string += "Name: " + temparray[desiredSlot][0] + "\nStars: " + temparray[desiredSlot][1] + "\nCombat: " + characterData[dataArray]["Combat"] + "\nNegotiation: " + characterData[dataArray]["Negotiation"] + "\nAcrobatics: " + characterData[dataArray]["Acrobatics"] + "\nShort Bio: " + characterData[dataArray]["Bio"] + "\n**Traits:**\n";
  if (temparray[desiredSlot][1] == "\\*\\*\\*"){
    string += characterData[temparray[desiredSlot][0]]["Traits"][0] + ": " + statusTraitDesc[characterData[temparray[desiredSlot][0]]["Traits"][0]] + "\n";
  }
  message.channel.send(string);
}}

// for setting your party
if (command == "partyset") {
  //initiatlize some variables
  var party = [];
  var string = "";
  //get userdata
  var temparray = userData.get(message.author.id);
  //get user collection
  var col = temparray.collection;
  //figure out what slots the user is asking about
  var args0 = args[0]-1;
  var args1 = args[1]-1;
  var args2 = args[2]-1;
  //make sure they aren't asking for the same slot twice
if (args0 == args1 || args0 == args2 || args1 == args2) {
  message.channel.send("You can't select the same party member twice!");
}
else if (args0 != args1 && args0 != args2 && args1 != args2){
  //shove the characters they're asking about into an array
  party.push(col[args0]);
  party.push(col[args1]);
  party.push(col[args2]);
  //set the array into their userdata.party
  temparray.party = party;
  userData.set(message.author.id, temparray);
  //tell them what their party and its stats are
  string += "Your party was set to " + party[0][0] + ", " + party[1][0] + ", and " + party[2][0] + "!";
  var combat = combatAdd(message.author.id);
  var negotiation = negotiationAdd(message.author.id);
  var acrobatics = acrobaticsAdd(message.author.id);
  string += "\nParty combat strength: " + combat + "\nParty negotiation influence: " + negotiation + "\nParty acrobatics speed: " + acrobatics;
  message.channel.send(string);
}}

//check out your party
if (command == "party") {
  //init variables
  var string = "";
  //get the user's party data
  var party = userData.get(message.author.id);
  var party = party.party;
  //stat it out
  var combat = combatAdd(message.author.id);
  var negotiation = negotiationAdd(message.author.id);
  var acrobatics = acrobaticsAdd(message.author.id);
  console.log(characterData[party[0][0]]["Traits"][0]);
  //tell them their info
  string += "Your party is " + party[0][0] + ", " + party[1][0] + ", and " + party[2][0] + "!\nParty combat strength: " + combat + "\nParty negotiation influence: " + negotiation + "\nParty acrobatics speed: " + acrobatics + "\n**Party Traits:**\n";
  for (var i = 0; i<party.length; i++){
    if (party[i][1] == "\\*\\*\\*") {
      string += characterData[party[i][0]]["Traits"][0] + ": " + statusTraitDesc[characterData[party[i][0]]["Traits"][0]] + "\n";
    }
    if (party[i][1] == "\\*\\*\\*\\*") {
      string += characterData[party[i][0]]["Traits"][1] + ": " + statusTraitDesc[characterData[party[i][0]]["Traits"][1]] + "\n";
    }
    if (party[i][1] == "\\*\\*\\*\\*\\*") {
      string += characterData[party[i][0]]["Traits"][2] + ": " + statusTraitDesc[characterData[party[i][0]]["Traits"][2]] + "\n";
    }
  }
  message.channel.send(string);
}

//Check what stages are available to you
if (command == "stages") {
  //initialize some variables
  var string = "";
  var stageNum = 1;
  //get user party data
  var party = userData.get(message.author.id);
  party = party.party;
    //get the user's unlocked stages
    var stage = userData.get(message.author.id);
    stage = stage.stages;
    //iterate through stages, taking the 0th element as a title and the rest of the elements as the levels
    for (var i=0; i<stage.length; i++){
      string += "**" + stage[i][0]+"**\n";
      for (var x = 1; x<stage[i].length; x++) {
        string += stageNum + ". " + stage[i][x]+"\n";
        stageNum += 1;
      }
    }
    message.channel.send(string);
}

//attempting stages
if (command == "engage") {
  //init variables
  var string = "";
  var nextstage = "";
  var results = [];
  //grab the desired stage and run the proper math on it
  var desiredSlot = args[0]-1;
  var numOne = Math.floor(desiredSlot/5);
  var numTwo = Math.floor(desiredSlot%5)+1;
  //get userdata
  var data = userData.get(message.author.id);
  stages = data.stages;
  party = data.party;
  //find the right stage
  var selectedStage = stages[numOne][numTwo];
  //error messageif no party exists
  if (party.length == 0) {
    message.channel.send("You need to create a party with +partyset before you can attempt a stage!");
  }
  else {
  //give info only if it was asked for
  if (args[1] == "info") {
    string += "Name: " + selectedStage + "\nDescription: " + levelData[selectedStage]["Desc"] + "\nCombat Difficulty: " + levelData[selectedStage]["ComDif"] + " (+" + levelData[selectedStage]["ComBonus"] + "%)\nNegotiation Difficulty: " + levelData[selectedStage]["NegDif"] + " (+" + levelData[selectedStage]["NegBonus"] + "%)\nAcrobatics Difficulty: " + levelData[selectedStage]["AcrDif"] + " (+" + levelData[selectedStage]["AcrBonus"] + "%)\nBase Success: " + levelData[selectedStage]["Base Success"] + "%\n**Stage Statuses:**\n";
    for (var i = 0; i<levelData[selectedStage]["Statuses"].length; i++){
      string += levelData[selectedStage]["Statuses"][i] + ": " + statusTraitDesc[levelData[selectedStage]["Statuses"][i]] + "\n";
    }
    message.channel.send(string);
  }
  //otherwise, run the stage success function
  else if (args[1] != "info") {
    results = stageSuccess(message.author.id, selectedStage);
    console.log(results);
    if (results[1] == 1) {
    //find the next stage and add it to user stages
      nextstage = levelData[selectedStage]["Next Stage"];
      stages[numOne].push(nextstage);
      data.stages = stages;
      userData.set(message.author.id, data);
    }
    //send results
    message.channel.send(results[0]);
  }
}
}




function combatAdd(id) {
  var party = userData.get(id);
  var party = party.party;
  var combat = characterData[party[0][0]]["Combat"] + characterData[party[1][0]]["Combat"] + characterData[party[2][0]]["Combat"];
  return combat;
}

function negotiationAdd(id) {
  var party = userData.get(id);
  var party = party.party;
  var negotiation = characterData[party[0][0]]["Negotiation"] + characterData[party[1][0]]["Negotiation"] + characterData[party[2][0]]["Negotiation"];
  return negotiation;
}

function acrobaticsAdd(id) {
  var party = userData.get(id);
  var party = party.party;
  var acrobatics = characterData[party[0][0]]["Acrobatics"] + characterData[party[1][0]]["Acrobatics"] + characterData[party[2][0]]["Acrobatics"];
  return acrobatics;
}

function stageSuccess(id, selectedStage) {
  var party = userData.get(id);
  var party = party.party;
  var combatArray = [0, 0, 0, 0];
  var string = "";
  var partyCom = combatAdd(id);
  var partyNeg = negotiationAdd(id);
  var partyAcr = acrobaticsAdd(id);
  var stageCom = levelData[selectedStage]["ComDif"];
  var stageNeg = levelData[selectedStage]["NegDif"];
  var stageAcr = levelData[selectedStage]["AcrDif"];
  var baseSuccess = levelData[selectedStage]["Base Success"];
  var bonusCom = levelData[selectedStage]["ComBonus"];
  var bonusNeg = levelData[selectedStage]["NegBonus"];
  var bonusAcr = levelData[selectedStage]["AcrBonus"];
  var randomNumber = Math.floor(Math.random()*100);
  var success = 0;
  var results = [];
  var totalArray = [partyCom, partyNeg, partyAcr, baseSuccess];

  for (var i = 0; i<party.length; i++) {
    combatArray = characterData[party[i][0]].Method(id, selectedStage, combatArray);
    console.log(combatArray);
  }

  combatArray = levelData[selectedStage].Method(id, selectedStage, combatArray, totalArray);
  console.log(combatArray);

  partyCom += combatArray[0];
  partyNeg += combatArray[1];
  partyAcr += combatArray[2];
  baseSuccess += combatArray[3];
  console.log(baseSuccess);

//compare combat scores
  if (partyCom >= stageCom) {
    baseSuccess += bonusCom;
    string += "Combat: Success! (+" +bonusCom + "%)\n";
    console.log(baseSuccess + " comsuccess");
  }
  if (partyCom < stageCom) {
    string += "Combat: Failure. (+0%)\n";
    console.log(baseSuccess);
  }
//compare negotiation scores
  if (partyNeg >= stageNeg) {
    baseSuccess += bonusNeg;
    string += "Negotiation: Success! (+" +bonusNeg + "%)\n";
    console.log(baseSuccess + " negsuccess");
  }
  if (partyNeg < stageNeg) {
    string += "Negotiation: Failure. (+0%)\n";
    console.log(baseSuccess);
  }
//compare acrobatics scores
  if (partyAcr >= stageAcr) {
    baseSuccess += bonusAcr;
    string += "Acrobatics: Success! (+" +bonusAcr + "%)\n";
    console.log(baseSuccess + " acrsuccess");
  }
  if (partyAcr < stageAcr) {
    string += "Acrobatics: Failure. (+0%)\n";
    console.log(baseSuccess);
  }
//check if you won
  if (baseSuccess >= randomNumber) {
    string += "The party had a " + baseSuccess + "% chance of success... and succeeded! For debug purposes, the rolled number was " + randomNumber;
    success = 1;
  }
  if (baseSuccess < randomNumber) {
    string += "The party had a " + baseSuccess + "% chance of success... but failed! For debug purposes, the rolled number was " + randomNumber;
    success = 0;
  }

results = [string, success];
console.log(results);
  return results;
}

function getTraits(id) {
  var party = userData.get(id);
  var party = party.party;
  var traitsOne = party[0]["Traits"][0];
  var traitsTwo = [];
  var traitsTwo = [];

}

function traitSolver(id, stage) {
  var party = userData.get(id);
  var party = party.party;
}

function demonFilled(id, stage) {
  var party = userData.get(id);
  var party = party.party;
  console.log("Hi there!");
  var string = "It worked!";
  return string;
}

/*if (command === 'poll') {
      message.channel.send(`please say yes or no`).then(() => {
              message.channel.awaitMessages(response => response.content === `yes` || response.content === 'no',  {
                  max: 1, // number of responses to collect
                  time: 10000, //time that bot waits for answer in ms
                  errors: ['time'],
              })
                  .then((collected) => {
                      var pollRes = collected.first().content; //this is the first response collected
                      message.channel.send('You said ' + pollRes);
                      // Do something else here (save response in database)
                  })
                  .catch(() => { // if no message is collected
                      message.channel.send('I didnt catch that, Try again.');
                  });
          });
  };*/








  // Let's go with a few common example commands! Feel free to delete or change those.
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{});
    // And we get the bot to say the thing:
    message.channel.send(sayMessage);
  }

  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable)
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }

  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable)
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }

  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.

    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);

    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});

client.login(config.token);
