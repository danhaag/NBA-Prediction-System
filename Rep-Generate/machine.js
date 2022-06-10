const nba = require("nba-api-client");
const fs = require("fs");
const nbaData = require("./game-data.json");

const getNbaData = date =>
  new Promise((resolve, reject) => {
    nba
      .playerBoxScores({ PlayerID: player.PERSON_ID, Season: "temp" })
      .then(data => {
        resolve(data);
      });
  });

const getNbaPlayers = () =>
  new Promise((resolve, reject) => {
    nba.allPlayersList({ Season: "2018-19" }).then(data => {
      //console.log(data)
      resolve(data);
    });
  });

// const playerLooper = data =>
//   new Promise((resolve, reject) => {
//     for (player in data.CommonAllPlayers) {
//       seasonLooper(data.CommonAllPlayers[player]).then(() => {
//
//         if ([player] === Object.keys(data.CommonAllPlayers).length) {
//           console.log("Resolving playerlooper");
//           resolve();
//         }
//       });
//     }
//   });

async function delayedLog(item) {
  // notice that we can await a function
  // that returns a promise
  await seasonLooper(item)
  //console.log(item);
}

async function playerLooper(data){
  for (player in data.CommonAllPlayers) {
    await delayedLog(data.CommonAllPlayers[player])
  }
}


function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


const playerBoxScores = (player, season) => new Promise((resolve, reject) => {
    console.log("Player: " + player)
    nba.playerBoxScores({ "PlayerID": player, "Season": season }).then(data => {
      //console.log(data)
      resolve(data);
    })
  });

// This bad boy right here, loops through seasons.
const seasonLooper = player =>
  new Promise((resolve, reject) => {

    console.log(player)

    let seasonStart = "1948";
    let seasonEnd = String(Number(seasonStart.slice(2)) + 1);
    let playerSeasons = [];

    function recurse(){

      console.log(Number(seasonStart))
      //playerBoxScores(player.PERSON_ID, `${seasonStart}-${seasonEnd}`).then(
      nba.playerBoxScores({ "PlayerID": player.PERSON_ID, "Season": `${seasonStart}-${seasonEnd}` }).then(
        playerData => {
          //console.log(playerData)
          //playerSeasons.push(playerData);
          //if (seasonStart === "2018") {
            //console.log(playerSeasons)

            if(isEmpty(playerData)){
              console.log("Rate Limit")
              throw Error ('Rate Limit')
            }

            if(!isEmpty(playerData.PlayerGameLogs)){
            fs.appendFile(
              `./players/${player.PERSON_ID}.json`,
              JSON.stringify(playerData),
              "utf8",
              error => {
                if (error) {
                  throw error;
                }
              },
            )
            }
            if(seasonStart === "2018"){
            //setTimeout(function(){resolve()}, 1000);
            resolve();
            return;
          }
          //}
        })
        if(seasonStart != 2018){
          seasonStart = String(Number(seasonStart) + 1);
          seasonEnd = String(Number(seasonStart.slice(2)) + 1);
          console.log(seasonEnd)
          if (seasonEnd.length > 2) {
            seasonEnd = "00";
          }
          if (seasonEnd.length === 1) {
            seasonEnd = "0" + seasonEnd;
          }
          setTimeout(function(){recurse()}, 100);
          }
        }
        recurse();
      })

const main = async () => {
  const players = await getNbaPlayers();
  //console.log(players)
  //console.log(players)
  //playerLooper(players);
  for (player in players.CommonAllPlayers) {
    //console.log(player)
    //console.log(players.CommonAllPlayers[player])
    await delayedLog(players.CommonAllPlayers[player])
  }
  // const data = await seasonLooper(players);

  // fs.writeFile("game-data.json", JSON.stringify({ data: data }), "utf8", (error) => {
  //   if (error) {
  //     throw error;
  //   }
  // });
};

main();

// nba.allPlayersList({ Season: "2018-19" }).then(data => {
//   const lol = 1
//   data.commonAllPlayers.forEach(player => {
//     nba.playerBoxScores({ PlayerID: player.PERSON_ID }).then(data => {
//       const checkpoint = "Victory";
//       console.log(checkpoint)
//     });
//   });
// });

// const main = async () => {};

// const lol = 1;
