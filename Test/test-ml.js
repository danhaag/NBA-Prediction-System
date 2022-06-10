
const brain = require("brain.js")
// provide optional config object (or undefined). Defaults shown.
const net = new brain.NeuralNetwork()

net.train([
  { input:{ team1:"g", team2:"w"}, output: {team1:1, team2:0} },
  { input:{ team1:"q", team2:"g"}, output: {team1:1, team2:0} },
  { input:{ team1:"w", team2:"q"}, output: {team1:0, team2:1} },
])

const output = net.run({team1:"q", team2:"g"}) // { white: 0.99, black: 0.002 }
console.log(output)
