const fs = require("fs");
//const gamesJSON = require("./games.json");

const PLAYERS_DIR = "./players/";
const ROLLING_AVERAGES_DIR = "./rolling-averages/";

const gargantuanObject = {};
const mogulObject = {};

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

class StatsObj {
  constructor() {
    this.AST = 0;
    this.BLK = 0;
    this.DREB = 0;
    this.FG3A = 0;
    this.FG3M = 0;
    this.FGA = 0;
    this.FGM = 0;
    this.FTA = 0;
    this.FTM = 0;
    this.MIN_AVG = 0;
    this.GAME_DATE = "";
    this.OREB = 0;
    this.PF = 0;
    this.GAME_ID = "";
    this.PTS_AVG = 0;
    this.REB = 0;
    this.STL = 0;
    this.TOV = 0;
    this.TEAM_ID = 0;
    this.PLAYER_ID = 0;
    this.MATCHUP = "";
    this.MIN_TG = 0;
    this.PTS_TG = 0;
  }
}

const writeAllPlayerStats = () =>
  new Promise((resolve, reject) => {
    fs.readdir(PLAYERS_DIR, (err, files) => {
      if (err) throw err;

      for (let i = 0; i < files.length; i++) {
        const rollingAverages = [];
        let games = [];
        const fileName = files[i];
        const jsonPath = PLAYERS_DIR + fileName;
        const playerSeasons = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

        for (let season in playerSeasons) {
          let seasonGames = playerSeasons[season].PlayerGameLogs;
          if (!seasonGames.hasOwnProperty("0")) {
            seasonGames = { "0": seasonGames };
          }
          for (let game in seasonGames) {
            const gameObj = seasonGames[game];
            if (Date.parse(gameObj.GAME_DATE) > Date.parse("1996-01-01")) {
              games.push(gameObj);
            }
          }
        }
        games = games.sort(
          (a, b) => Date.parse(a.GAME_DATE) - Date.parse(b.GAME_DATE)
        );
        if (games.length !== 0 && !isEmpty(games[0]) && games[0].PLAYER_ID === 2768) {
          const x = 1;
        }
        for (let r = 0; r < games.length; r++) {
          let statsObj = new StatsObj();
          statsObj.GAME_ID = games[r].GAME_ID;
          statsObj.TEAM_ID = games[r].TEAM_ID;
          statsObj.PLAYER_ID = games[r].PLAYER_ID;
          statsObj.GAME_DATE = games[r].GAME_DATE;
          statsObj.MATCHUP = games[r].MATCHUP;
          statsObj.MIN_TG = games[r].MIN;
          statsObj.PTS_TG = games[r].PTS;
          for (let j = r - 1; j >= checkMax(r); j--) {
            statsObj.AST += games[j].AST;
            statsObj.BLK += games[j].BLK;
            statsObj.DREB += games[j].DREB;
            statsObj.FG3A += games[j].FG3A;
            statsObj.FG3M += games[j].FG3M;
            statsObj.FGA += games[j].FGA;
            statsObj.FGM += games[j].FGM;
            statsObj.FTA += games[j].FTA;
            statsObj.MIN_AVG += games[j].MIN;
            statsObj.OREB += games[j].OREB;
            statsObj.PF += games[j].PF;
            statsObj.PTS_AVG += games[j].PTS;
            statsObj.REB += games[j].REB;
            statsObj.STL += games[j].STL;
            statsObj.TOV += games[j].TOV;
          }
          let divider = 200;
          if (r <= 200) {
            divider = r;
          }
          if (r !== 0) {
            statsObj.AST /= divider;
            statsObj.BLK /= divider;
            statsObj.DREB /= divider;
            statsObj.FG3A /= divider;
            statsObj.FG3M /= divider;
            statsObj.FGA /= divider;
            statsObj.FGM /= divider;
            statsObj.FTA /= divider;
            statsObj.MIN_AVG /= divider;
            statsObj.OREB /= divider;
            statsObj.PF /= divider;
            statsObj.PTS_AVG /= divider;
            statsObj.REB /= divider;
            statsObj.STL /= divider;
            statsObj.TOV /= divider;
            rollingAverages.push(statsObj);
          }
        }
        gargantuanObject[fileName.split(".")[0]] = rollingAverages;
        if (i === files.length - 1) {
          resolve();
        }
        // fs.writeFile(
        //     ROLLING_AVERAGES_DIR + fileName,
        //   JSON.stringify({ rollingAverages: rollingAverages }),
        //   "utf8",
        //   error => {
        //     if (error) {
        //       throw error;
        //     }
        //   }
        // );
      }
    });
  });

const checkMax = i => {
  if (i > 200) {
    return i - 200;
  } else {
    return 0;
  }
};

const mogulMoves = () => {
  for (let key in gargantuanObject) {
    const gamesArray = gargantuanObject[key];
    gamesArray.forEach(game => {
      if (!mogulObject[game.GAME_ID]) {
        mogulObject[game.GAME_ID] = {};
      }
      if (!mogulObject[game.GAME_ID][game.TEAM_ID]) {
        mogulObject[game.GAME_ID][game.TEAM_ID] = [];
      }
      mogulObject[game.GAME_ID][game.TEAM_ID].push(game);
    });
  }
  const fuck = 1;
};

const writeFiles = () => {
  fs.writeFile(
    "gargantuan.json",
    JSON.stringify(gargantuanObject),
    "utf8",
    error => {
      if (error) {
        throw error;
      }
    }
  );
  fs.writeFile(
    "mogul.json",
    JSON.stringify(mogulObject),
    "utf8",
    error => {
      if (error) {
        throw error;
      }
    }
  );
}

const main = async () => {
  await writeAllPlayerStats();
  mogulMoves();
  console.log(mogulObject["0020400025"])
  const fuck = 1;
};

main();
