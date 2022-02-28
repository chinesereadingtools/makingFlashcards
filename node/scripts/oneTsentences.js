const documentStats = require("./documentStats.js")

function sentenceMostlyKnown(sentence, known) {

  var unknown = 0;
  var unknownWord = ""
  sentence.forEach(([word, type]) => {
    if (type != 3) return;

    if (!(word in known)) {
      unknown += 1;
      unknownWord = word;
    }
  });

  return [unknown == 1, unknownWord];

}


function sentenceKnown(sentence, exception, known) {
  var allKnown = true;
  sentence.forEach(([word, type]) => {
    if (type != 3) return;
    if (word == exception) return;
    if (!(word in known)) {
      allKnown = false;
    }
  });
  return allKnown;
}

function toText(sentence) {
  return sentence.map(([word, type]) => word).join("");
}

function parseFile(filename, known) {

  console.log(`Loading ${filename}`)
  var document = new documentStats.Document(filename, known)
  var segText = document.text

  var oneT = []
  segText.forEach((sentence, index) => {
    var [isOneT, unknownWord] = sentenceMostlyKnown(sentence, known);

    if (isOneT) {
      var combinedSentence = toText(sentence)
      for (var i = index - 1; i >= Math.max(index - 6, 0); i--) {
        var isKnown = sentenceKnown(segText[i], unknownWord, known)
        if (!isKnown) {
          break;
        }
        combinedSentence = toText(segText[i]) + combinedSentence
      }
      for (var i = index + 1; i < Math.min(index + 6, segText
          .length); i++) {
        var isKnown = sentenceKnown(segText[i], unknownWord, known)
        if (!isKnown) {
          break;
        }
        combinedSentence = combinedSentence + toText(segText[i])
      }

      var stats = document.stats(unknownWord)

      oneT.push({
        word: unknownWord,
        occurances: stats.occurances,
        stars: stats.stars,
        position: index / segText.length * 100,
        sentence: combinedSentence
      });
    }
  });

  var candidateWords = new Set([...oneT.map((entry) => entry.word)])
  var stats = document.documentStats()

  return {
    rowData: oneT,
    words: candidateWords.length,
    ...stats
  }

}



module.exports = {
  parse: (filename, known) => parseFile(filename, known),
}
