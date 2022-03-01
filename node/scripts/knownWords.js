const fs = require('fs');

const config = JSON.parse(fs.readFileSync("../config.json", "UTF-8", "r"))

var known = JSON.parse(fs.readFileSync(
  config.knownWords, "UTF-8", "r"));

function addWord(word, age) {
  known[word] = age;
}

function saveWords(callback) {
  fs.writeFile(config.knownWords, JSON.stringify(known), callback);
}

function mergeWords(other) {
  Object.assign(known, other);
}

// exports various dictionaries
module.exports = {
  addWord: addWord,
  mergeWords: mergeWords,
  isKnown: (word, howKnown=0) => {
    // if word is completly unknown return false
    if (!(word in known)) {
      return false;
    }
    // we know it at least somewhat known
    return known[word] >= howKnown;
  },

  knownWords: () => Object.keys(known).length,
  saveWords: saveWords

}
