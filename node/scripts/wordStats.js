const fs = require('fs')

const config = JSON.parse(fs.readFileSync("../config.json", "UTF-8", "r"));
const frequencyData = JSON.parse(fs.readFileSync(
  config.frequencyData + "Combined.json", "UTF-8", "r"));

function convertRanking(word) {
  var rank = frequencyData[word]
  if (rank == undefined) {
    return "none"
  } else if (rank < 1500) {
    return "★★★★★"
  } else if (rank < 5000) {
    return "★★★★"
  } else if (rank < 15000) {
    return "★★★"
  } else if (rank < 30000) {
    return "★★"
  } else if (rank < 60000) {
    return "★"
  } else {
    return "none"
  }
}

module.exports = {
  frequency: convertRanking

}
