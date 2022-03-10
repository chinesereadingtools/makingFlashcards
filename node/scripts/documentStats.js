const fs = require('fs')
const known = require("./knownWords.js")
const wordStats = require("./wordStats.js")

const config = JSON.parse(fs.readFileSync("../config.json", "UTF-8", "r"));



class Document {
  #segText;
  constructor(filename) {
    this.filename = filename

    var fullFilename = config.segmentedText + filename
    this.#segText = JSON.parse(fs.readFileSync(
      fullFilename,
      "UTF-8", "r"));

    //this.wordTable,
    //this.totalWords,
    //this.totalWellKnownWords,
    //this.totalKnownWords
    this.#generateStats();

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

  #generateStats() {
    this.wordTable = {}
    this.totalWords = 0
    this.totalKnownWords = 0
    this.totalWellKnownWords = 0
    this.charTable = {}
    this.#segText.forEach((sentence) => {
      sentence.forEach(([word, type]) => {
        if (type != 3) return;
        this.totalWords += 1
        // todo, iterate the word table to make this faster
        if (known.isKnown(word)) {
          this.totalKnownWords += 1
          if (known.isKnown(word, 20)) {
            this.totalWellKnownWords += 1
          }
        }
        if (word in this.wordTable) {
          this.wordTable[word] += 1
        } else {
          this.wordTable[word] = 1
        }
        Array.from(word).forEach(ch => {
          if (ch in this.charTable) {
            this.charTable[ch] += 1
          } else {
            this.charTable[ch] = 1
          }
        });
      });
    });
  }

  get text() {
    return this.#segText
  };

  inDocument(word) {
    return word in this.wordTable;
  }

  documentWords() {
    return Object.entries(this.wordTable).map(([word, occurances]) => {
      return {
        word: word,
        occurances: occurances,
        isKnown: known.isKnown(word),
        stars: wordStats.frequency(word),
      };
    });
  }

  documentChars() {
    return Object.entries(this.charTable).map(([ch, occurances]) => {
      return {
        word: ch,
        occurances: occurances,
        isKnown: known.isKnownChar(ch),
      }
    });
  }

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
      stars: wordStats.frequency(word),
    }

  }


}

module.exports = {
  Document: Document
}
