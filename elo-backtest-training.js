var csv = require("fast-csv");

let nbaList = [];

let bigObj = {};

let tempObj = {};

var promise1 = new Promise(function (resolve, reject){

  csv
  .parseFile('nba_elo.csv')
  .on('data', function(data) {

    var temp = data[0]

    temp = temp.replace(/-/g, "")

    var key = {ya:temp.replace(/-/g, "")}

    var team01 = data[4]
    var team02 = data[5]


    if(bigObj[temp] == null){
      bigObj[temp] = []
    }

    var obj = {

      'date': data[0],
      'season': data[1],
      'team1': data[4],
      'team2': data[5],
      'rapEloPre1': data[18],
      'rapEloPre2': data[19],
      'rapProb1': data[20],
      'rapProb2': data[21],
      //'rapProb1': data[8],
      //'rapProb2': data[9],
      'score1': data[22],
      'score2': data[23]

    }

    obj[team01] = data[4];
    obj[team02] = data[5];

    bigObj[temp].push(obj);
  })
  .on('end', function() {

    // CSV extraction completed?
    //console.log(nbaList[1].team1 + " " + nbaList[1].team2 + " " + nbaList[1].score1 + " " + nbaList[1].score2);
    //console.log(bigObj[19461102])
    resolve();

  });

});

promise1.then(function() {

  csv
  .parseFile("nba-sportsbook-odds-2018-2019.csv")
  .on("data",function(data){

    //date over 1000 == 2018 otherwise 2019

      var date = data[1].toString();

     if(date.length < 4){
       date = date.split("")
       date.unshift("0")
       date.join("")
     }

      let convertedDate = convertDate[date];
     //
     // let convertedTeam = nameParser[data[4]];
     //
     let editable = data[0]

     let obj = {}


     if(editable%2 == 0){

       if(data[11]*1 < 30){
         obj.spread = data[11]
       }

       // tempObj[editable]["team1"] = {
       //   team: data[4],
       //   odds: data[12]
       // }
       obj.team1Odds = data[12];
       obj.team1 = data[4];
       obj.date = date;
       tempObj[editable] = obj;

     }
     else if(editable%2 == 1){


       var temp = editable-1

       if(data[11] < 30){
         tempObj[temp].spread = data[11]
       }

      tempObj[temp].team2Odds = data[12];
      tempObj[temp].team2 = data[4];


     }



  })
  .on('end', function() {

    convertDate();
    //console.log(tempObj[20])
    combineObjects();

    //console.log(bigObj[20190520])

    //console.log(bigObj[20190613])


    runSimulation();

  });

});

var trainingData = [];

var usedDates = [];

function runSimulation(){

  var colors = require('colors');


  var bankroll = 1000;
  var lowest = bankroll;
  var initialbankroll = bankroll;
  var betsize = 50;

  var wins = 0;
  var losses = 0;
  var passes = 0;

  var biggestWin = 0;

  var scoreCounter = 0;
  var overdogScoreCounter = 0;
  var coinflipScoreCounter = 0;

  var overdogs = 0;
  var underdogs = 0;

  var biggestWinTeam = {winner:0, loser:0}

  var scoreDifference = 0;
  var scoreDifferenceArray = [];

  var overdogScoreDifference = 0;
  var overdogDifferenceArray = [];

  var coinflipScoreDifference = 0;
  var coinflipScoreDifferenceArray = [];

  var favoriteScoreDifference = 0;
  var favoriteScoreCounter = 0;
  var favoriteScoreDifferenceArray = [];

  //var length = 2623;

  var length1 = 5000;


  for(var i = 0; i < length1 + 2; i++){

    if(i == 5001){

      const brain = require("brain.js")
      //provide optional config object (or undefined). Defaults shown.
      const config = {
        hiddenLayers: [3] // array of ints for the sizes of the hidden layers in the network
      }

      // create a simple feed forward neural network with backpropagation
      const net = new brain.recurrent.LSTM(config);

      net.train(trainingData);
      //.847982 .777376
      //71 83 87 GSW
      //68 65 76 DAL
      //80 72 79 PHO
      const output = net.run({team1:718387, team2: 807279}) // [0.987]
      //output.team1*1000000
      console.log(output)


    }

    if(tempObj[i] == undefined){

    }
    else{

      var date1 = tempObj[i]["date"]

      if(usedDates.includes(date1)){
          //uhmmsdijghisug
      }
      else{



      usedDates.push(date1)

      //console.log(date1)

      var array = bigObj[date1];

      for(var j = 0; j < array.length; j++){

        var obj = array[j];

        //console.log(obj)

        var prob1 = obj["rapProb1"] *1;
        var prob2 = obj["rapProb2"] *1;

        // if(prob1 > .2 && prob1 < .7){
        //   passes++
        //   continue;
        // }

        var team1 = obj["team1"];
        var team2 = obj["team2"];
        var spread = obj["spread"]*1



        var odds1 = obj[team1];
        var odds2 = obj[team2];

        if(isNaN(odds1) || isNaN(odds2)){
          console.log(obj)
          continue;
        }

        if(isNaN(spread)){
          continue;
        }


        var score1 = obj["score1"] *1;
        var score2 = obj["score2"] *1;

        function ascii (a) { return a.charCodeAt(0); }

        team1 = team1.split("")
        for(var i=0; i < team1.length; i++){
          team1[i] = ascii(team1[i]);
        }
        team2 = team2.split("")
        for(var i=0; i < team2.length; i++){
          team2[i] = ascii(team2[i]);
        }

        //var input = [team1, team2]
        //console.log(input)
        var output = {}
        if(score1 > score2){
          output.team1 = 1
          output.team2 = 0;
        }
        else{
          output.team1 = 0,
          output.team2 = 1;
        }


        var tempTraining = {input:{team1:team1.join("")*1, team2:team2.join("")*1}, output:output}
        console.log(tempTraining)
        trainingData.push(tempTraining)

        var scoreDifferenceTemp = Math.abs(score1 - score2);

        if((odds1 >= .50 && odds1 < .60) || (odds2 >= .50 && odds2 < .60)){

          coinflipScoreDifference+= Math.abs(score1 - score2);
          coinflipScoreDifferenceArray.push(scoreDifferenceTemp*1)
          coinflipScoreCounter++;
          //obj.isCoinflip = true;

          // if(spread > 3){
          //   console.log(obj)
          // }

        }
        else if((odds1 > .7 && odds1 <= .8) || (odds2 > .7 && odds2 <= .8)){
          favoriteScoreDifference += Math.abs(score1 - score2);
          favoriteScoreDifferenceArray.push(scoreDifferenceTemp * 1);
          favoriteScoreCounter++;

          //obj.isCoinflip = true;

        }
        else if(odds1 > .8 || odds2 > .8){
          //Overdog difference calculation
          overdogScoreDifference += Math.abs(score1 - score2);
          overdogDifferenceArray.push(scoreDifferenceTemp * 1);
          overdogScoreCounter++;

          obj.isHeavy = true;

        }
        else if((odds1 >= .6 && odds1 <= .7) || (odds2 >= .6 && odds2 <= .7)){
          //underdog difference calculation
        scoreDifference += Math.abs(score1 - score2);
        scoreDifferenceArray.push(scoreDifferenceTemp * 1);
        scoreCounter++;

        obj.isCoinflip = true;

          }
        else{
          console.log(colors.red(odds1));
          return;
        }

        var desiredPayout = 15

        var dynamicBet1 = desiredPayout/( (1/odds1)-1)
        var dynamicBet2 = desiredPayout/( (1/odds2)-1)

        var payout1 = (((100 / (odds1 * 100))) * betsize) - betsize;
        var payout2 = (((100 / (odds2 * 100))) * betsize) - betsize;

        var debug = {
          teams:team1 + " " + team2,
          odds:odds1 + " " + odds2,
          dynamicBets: dynamicBet1 +" " + dynamicBet2
        }

        //console.log(debug)

        //console.log("Game: " + team1 + " " + team2)
        //console.log("Odds: " + odds1 + " " + odds2 + " : " + "Payouts: " + payout1 + " " + payout2)
        //console.log("Odds: " + prob1 + " " + prob2)
        if(odds1 + .03 > prob1){
          //We bet on team1

          if(spread > 3){
            console.log(obj)
          }

            // if(odds1 > .35){
            //   passes++;
            //   continue;
            // }

          if(odds1 > .5){
            overdogs++
            score1 -= spread;
            payout1 = betsize - 2.5;
          }
          else{
            underdogs++
            score1 += spread;
            payout1 = betsize - 2.5;
            //console.log(spread)
          }

          if(score1 >= score2){

            if(score1 == score2){
              continue;
            }

            //We won
            if(isNaN(dynamicBet1)){
              console.log(dynamicBet1)
              return;
            }
            //bankroll += payout1;
            bankroll += payout1
            wins++;
            if(desiredPayout > biggestWin){
              biggestWin = payout1;
              biggestWinTeam.winner = team1;
              biggestWinTeam.loser = team2;
            }
          }
          else{
            //We lost
            bankroll -= betsize;
            losses++
          }

        }
        else if(odds2 + .03 > prob2){
          //We bet on team2

          if(spread > 3){
            console.log(obj)
          }

            // if(odds2 > .35){
            //   passes++;
            //   continue;
            // }

          if(odds2 > .5){
            overdogs++
            score2 -= spread;
            payout2 = betsize - 2.5;
          }
          else{
            underdogs++
            score2 += spread;
            payout2 = betsize - 2.5;
          }

          if(score2 >= score1){

            if(score1 == score2){
              continue;
            }

            //We won
            //bankroll += payout2;
            bankroll += payout2;
            wins++;
            if(desiredPayout > biggestWin){
              biggestWin = payout2;
              biggestWinTeam.winner = team2;
              biggestWinTeam.loser = team1;
            }
          }
          else{
            //We lost
            bankroll -= betsize;
            losses++;
          }
        }
        else{
          //We passed on the game
          //console.log("We passed")
          passes++
        }
        if(bankroll < 0){
          //console.log("We went below 0")
        }
        if(bankroll < lowest){
          lowest = bankroll;
        }
      }
     }
    }
  }
}


function combineObjects(){

  //var size = Object.keys(tempObj).length;
  var length = 2623;

  for(var i = 0; i < length; i++){

    if(tempObj[i] == undefined){

    }

    else {


      var team1 = tempObj[i]["team1"];
      var team2 = tempObj[i]["team2"]

      var team1Odds = oddsConverter(tempObj[i]["team1Odds"])
      var team2Odds = oddsConverter(tempObj[i]["team2Odds"])

      var spread = tempObj[i]["spread"]

      //console.log(spread)

      var date1 = tempObj[i]["date"]

      var array = bigObj[date1];


      //console.log(date1)

      for(var j = 0; j < array.length; j++){

        var obj = array[j];

        if(obj["team1"] == team1 || obj["team1"] == team2){
          bigObj[date1][j][team1] = team1Odds;
          bigObj[date1][j][team2] = team2Odds;
          bigObj[date1][j]["spread"] = spread
        }

      }

    }

  }


}

function oddsConverter(input){

  input = input * 1;

  var oldInput = input;

  input+=0;

  //console.log("Old input: " + oldInput + " New Input: " + input)

  if(input < 0){
    return Math.abs(input)/ (Math.abs(input) + 100);
  }
  else{
    return (100 / (input + 100))
  }

}


function nameParser(input){

var result;

switch(input){
  case "Atlanta" : result =  "ATL";
  break;
  case "Boston" : result = "BOS";
  break;
  case "Brooklyn" : result = "BRK";
  break;
  case "Charlotte" : result = "CHO";
  break;
  case "NewYork" : result = "NYK";
  break;
  case "Chicago" : result = "CHI";
  break;
  case "Cleveland": result = "CLE";
  break;
  case "Dallas": result = "DAL";
  break;
  case "Denver": result = "DEN";
  break;
  case "Detroit": result = "DET";
  break;
  case"GoldenState": result = "GSW";
  break;
  case"Houston": result = "HOU";
  break;
  case "Indiana": result = "IND";
  break;
  case "LAClippers": result = "LAC";
  break;
  case "LALakers": result = "LAL";
  break;
  case "Memphis": result = "MEM";
  break;
  case "Miami": result = "MIA";
  break;
  case "Milwaukee": result = "MIL";
  break;
  case "Minnesota" : result = "MIN";
  break;
  case "NewOrleans": result = "NOP";
  break;
  case "OklahomaCity": result = "OKC";
  break;
  case "Orlando": result = "ORL";
  break;
  case"Philadelphia": result = "PHI";
  break;
  case"Phoenix": result = "PHO";
  break;
  case"Portland": result = "POR";
  break;
  case"Sacramento": result = "SAC";
  break;
  case"SanAntonio": result = "SAS";
  break;
  case"Toronto": result = "TOR";
  break;
  case"Utah": result = "UTA";
  break;
  case"Washington": result = "WAS";
  break;

}

return result;

}

function convertDate(){

  //var size = Object.keys(tempObj).length;

  var size = 2623;

  for(var i = 0; i < size; i++){

    if(tempObj[i] == undefined){

    }
    else{
      var date = "date"
      var team1 = "team1"
      var team2 = "team2"

      var input = tempObj[i].date;

      var team01 = tempObj[i].team1;
      var team02 = tempObj[i].team2;


      team01 = nameParser(team01);
      team02 = nameParser(team02);

      var year;

      if (input > 1000){
        //year = 2018;
        year = 2018
      }
      else{
        //year = 2019;
        year = 2019;
      }

      var res = year + "" + input;

      res = res.replace(/,/g, "")

      tempObj[i][date] = res;
      tempObj[i][team1] = team01;
      tempObj[i][team2] = team02;

    }
  }
}
