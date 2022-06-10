const nba = require("nba-api-client");


// nba.playerBoxScores({ "PlayerID": "600012", "Season": "1948-49" }).then(data => {
//   console.log(data)
// })

nba.playerBoxScores({ "PlayerID": "600012", "LastNGames": "1000" }).then(data => {
  console.log(data)
})
