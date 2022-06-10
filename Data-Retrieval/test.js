const NBA = require("nba");
const curry = NBA.findPlayer('Stephen Curry');
console.log(curry);
/* logs the following:
{
  firstName: 'Stephen',
  lastName: 'Curry',
  playerId: 201939,
  teamId: 1610612744,
  fullName: 'Stephen Curry',
  downcaseName: 'stephen curry'
}
*/
NBA.stats.playerStats({ PlayerID: curry.playerId }).then(console.log);
