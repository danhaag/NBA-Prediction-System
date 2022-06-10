const nba = require('nba-api-client');
const fs = require ('fs');
const allPlayersList = require("./all-nba-players.json")
const allNBATeamIDs = require("./all-nba-teamIDs.json")

let nbaTeamIDs = allNBATeamIDs.teams; //This is an array

let finalObj = {};


let SeasonsArray = ["1996-97", "1997-98", "1998-99", "1999-20", "2000-01", "2001-02", "2002-03", "2003-04", "2004-05", "2005-06", "2006-07", "2007-08", "2008-09", "2009-10", "2010-11","2011-12","2012-13","2013-14","2014-15","2015-16","2016-17","2017-18","2018-19","2019-20"]

//Scrapes all of the players in the nba
function generateAllPlayers(){
nba.allPlayersList().then(function(data){
  data = JSON.stringify(data);
  fs.writeFileSync('all-nba-players.json', data);
})
}

function getAllTeamIDs(){

let keys = Object.keys(allPlayersList.CommonAllPlayers);
let teams = [];

for(let i = 0; i < keys.length; i++){

  let teamID = allPlayersList['CommonAllPlayers'][keys[i]].TEAM_ID

  if(!teams.includes(teamID) && teamID != 0){
    teams.push(teamID)
  }

}

fs.writeFileSync('all-nba-teamIDs.json', JSON.stringify({teams:teams}));

}

function scrapeTeamData(teamID, season, seasonType){

  return new Promise(function(resolve, reject){

    console.log(teamID + " " + season + " " + seasonType)

  let dir1 = season;
  let dir2 = season + "/" + seasonType
  let prevDir = season + "/" + seasonType + "/" + teamID + ".json"

    if (fs.existsSync(prevDir)){
      console.log("We already did this scrape!")
      resolve("Already Done")
    }
    else{
    nba.teamPlayerStats({TeamID: teamID, MeasureType: 'Advanced', Season: season, SeasonType: seasonType}).then(function(data){

      if (!fs.existsSync(dir1)){
        fs.mkdirSync(dir1);
      }

      if (!fs.existsSync(dir2)){
        fs.mkdirSync(dir2);
      }

      if(!finalObj.hasOwnProperty(teamID)){
        finalObj[teamID] = {};
      }
      if(!finalObj[teamID].hasOwnProperty(season)){
        finalObj[teamID][season] = {}
      }

      finalObj[teamID][season][seasonType] = data;

      fs.appendFile("./" + season + "/" + seasonType + "/" + teamID + ".json", JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('Saved; teamId: ' + teamID + " Season: " + season + " seasonType: " + seasonType);
      });

      resolve(data)
    })
  }
  })
}

let teamIterator = 0;
let seasonIterator = 0;


  async function seasonLooper(){

    if(seasonIterator == SeasonsArray.length){

      seasonIterator = 0;
      teamIterator++;

    }
    if(teamIterator == nbaTeamIDs.length){

      fs.appendFile("AllDataObject.json", JSON.stringify(finalObj), function (err) {
        if (err) throw err;
        console.log('Saved final object!');
      });

      return;
    }


    let currentTeam = nbaTeamIDs[teamIterator];

    let currentSeason = SeasonsArray[seasonIterator];

    await scrapeTeamData(currentTeam, currentSeason, "Regular+Season")
    await scrapeTeamData(currentTeam, currentSeason, "Playoffs")

    seasonIterator++;

    setTimeout(function(){seasonLooper()},1)

  }

  seasonLooper();

// nba.teamBoxScoresAdvanced({"DateFrom":"1-16-2020", "DateTo":"1-17-2020"}).then(function(data){
//   console.log(data);
// })

// nba.teamPlayerStats({TeamID: 1610612745, MeasureType: 'Advanced', Season: '2017-18', SeasonType: 'Regular+Season'}).then(function(data){
// 	console.log(data)
// })
