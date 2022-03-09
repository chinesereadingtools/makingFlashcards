const fs = require('fs');
const wordStats = require("./wordStats.js")

const config = JSON.parse(fs.readFileSync("../config.json", "UTF-8", "r"))

var known = JSON.parse(fs.readFileSync(
  config.knownWordsJson, "UTF-8", "r"));
var knownCharacters = new Set();
Object.keys(known).forEach(word => {
  Array.from(word).forEach(ch => knownCharacters.add(ch));
});

function addWord(word, age) {
  known[word] = age;
}

function saveWords(callback) {
  fs.writeFile(config.knownWordsJson, JSON.stringify(known), (err) => {
    words = Object.keys(known);
    fs.writeFile(config.knownWords, words.join("\n"), callback);
  });
}

function mergeWords(other) {
  Object.assign(known, other);
}

function knownWordsTable() {
  return Object.entries(known).map(([key, value]) => {
    return {
      word: key,
      interval: value,
      stars: wordStats.frequency(key)
    }
  });
}

function numKnownCharacters() {
  return knownCharacters.size;
}

// exports various dictionaries
module.exports = {
  addWord: addWord,
  mergeWords: mergeWords,
  isKnown: (word, howKnown = 0) => {
    // if word is completly unknown return false
    if (!(word in known)) {
      return false;
    }
    // we know it at least somewhat known
    return known[word] >= howKnown;
  },

  knownWordsTable: knownWordsTable,
  knownWords: () => Object.keys(known).length,
  saveWords: saveWords,
  knownCharacters: numKnownCharacters,

}
