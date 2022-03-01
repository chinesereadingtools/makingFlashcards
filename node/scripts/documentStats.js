const fs = require('fs')
const known = require("./knownWords.js")
const config = JSON.parse(fs.readFileSync("../config.json", "UTF-8", "r"));

var frequencyData = JSON.parse(fs.readFileSync(
  config.frequencyData + "Combined.json", "UTF-8", "r"));

function generateStats(segText) {
  wordTable = {}
  totalWords = 0
  totalKnownWords = 0
  totalWellKnownWords = 0
  segText.forEach((sentence) => {
    sentence.forEach(([word, type]) => {
      if (type != 3) return;
      totalWords += 1
      // todo, iterate the word table to make this faster
      if (known.isKnown(word)) {
        totalKnownWords += 1
        if (known.isKnown(word, 20)) {
          totalWellKnownWords += 1
        }
      }
      if (word in wordTable) {
        wordTable[word] += 1
      } else {
        wordTable[word] = 1
      }

    });
  });
  return [wordTable, totalWords, totalKnownWords, totalWellKnownWords]

}

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

class Document {
  #segText;
  constructor(filename) {
    this.filename = filename

    var fullFilename = config.segmentedText + filename
    this.#segText = JSON.parse(fs.readFileSync(
      fullFilename,
      "UTF-8", "r"));

    [
      this.wordTable,
      this.totalWords,
      this.totalWellKnownWords,
      this.totalKnownWords
    ] = generateStats(this.#segText)

    this.wellKnownWords = {}
    this.knownWords = {}
    this.unKnownWords = {}

    Object.entries(this.wordTable).forEach(([word, occurances]) => {
      if (known.isKnown(word)) {
        this.knownWords[word] = occurances
      } else {
        this.unKnownWords[word] = occurances
      }
    });

  };
  get text() {
    return this.#segText
  };

  documentStats() {
    return {
      totalWords: this.totalWords,
      curentKnownWords: this.totalKnownWords,
      currentWellKnownWords: this.totalWellKnownWords,
      currentKnown: this.totalKnownWords / this.totalWords * 100,
      currentWellKnown: this.totalWellKnownWords / this.totalWords * 100
    }
  }

  stats(word) {
    var occurances = this.wordTable[word]
    return {
      occurances: occurances,
      percent: occurances / this.totalWords * 100,
      stars: convertRanking(word),
    }

  }


}

module.exports = {
  Document: Document
}
