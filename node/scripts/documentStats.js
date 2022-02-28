const fs = require('fs')
const config = JSON.parse(fs.readFileSync("../config.json", "UTF-8", "r"));

var frequencyData = JSON.parse(fs.readFileSync(
  config.frequencyData + "Combined.json", "UTF-8", "r"));

function generateStats(segText, knownWords) {
  wordTable = {}
  totalWords = 0
  totalKnownWords = 0
  segText.forEach((sentence) => {
    sentence.forEach(([word, type]) => {
      if (type != 3) return;
      totalWords += 1
      // todo, iterate the word table to make this faster
      if (word in knownWords) {
        totalKnownWords += 1
      }
      if (word in wordTable) {
        wordTable[word] += 1
      } else {
        wordTable[word] = 1
      }

    });
  });
  return [wordTable, totalWords, totalKnownWords]

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
  constructor(filename, knownWords) {
    this.filename = filename

    var fullFilename = config.segmentedText + filename
    this.#segText = JSON.parse(fs.readFileSync(
      fullFilename,
      "UTF-8", "r"));

    [this.wordTable, this.totalWords, this.totalKnownWords] = generateStats(
      this.#segText, knownWords)

    this.knownWords = {}
    this.unKnownWords = {}

    Object.entries(this.wordTable).forEach(([word, occurances]) => {
      if (word in knownWords) {
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
      currentKnown: this.totalKnownWords / this.totalWords * 100




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
