const nba = require('nba-api-client');

// nba.boxScoreAdvanced({GameID: '0021100981'}).then(function(data){
//   console.log(data)
// });

// nba.playerCareerStats({"Permode":"PerGame", "PlayerID":201935}).then(function(data){
//   console.log(data)
// })


nba.playerBoxScores({"PlayerID":201935 ,"Season":"2018-19"}).then(function(data){
  console.log(data)
})
