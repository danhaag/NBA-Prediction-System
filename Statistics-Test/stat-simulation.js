var simMax = 10;

var dollars = 600;
var betSize = 25;
var runs = 9000;

var simCount = 0;
var bankruptcies = 0;

function random(min, max){
   return Math.floor(Math.random() * (max - min) ) + min;
}

var count = 0;

function simulator(){

  if(count >= runs){
    console.log(dollars);
    dollars = 1000;
    count = 0;
    return dollars;
  }
  if(dollars < 0){
    console.log("bankrupt");
    bankruptcies++;
    return;
  }

//odds for game
var impliedProb = random(1,50);

var decimalPayout = 100 / impliedProb;

//console.log(decimalPayout + "  " + impliedProb);

//bet
if(random(1,101) <= impliedProb){
  dollars += (betSize * decimalPayout);
}
else{
  dollars -= betSize;
}

count++;
simulator();

}
function simReEnter(){

  if(simCount > simMax){
    console.log(simCount + " simulations complete.")
    console.log("We had " + bankruptcies + " bankruptcies.")
    return;
  }
simulator();
simCount++;
simReEnter();
}
simReEnter();
