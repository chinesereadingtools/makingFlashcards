// Importing the http module
const http = require("http")
const https = require("https")
const fs = require('fs');
const bodyParser = require('body-parser')
const express = require("express")
const app = express()
const oneTsentences = require("./scripts/oneTsentences.js")
const importFromAnki = require("./scripts/importFromAnki.js")
const knownWords = require("./scripts/knownWords.js")
const documentStats = require("./scripts/documentStats.js")
const catalogue = require("./scripts/bookCatalogue.js")

const config = JSON.parse(fs.readFileSync("../config.json", "UTF-8", "r"))


// Creating server, loads files from current dir
app.use(express.static('../www/'))
app.use(bodyParser.json())

app.get("/hello", (req, res, next) => {
  res.json(JSON.parse('{"msg": "This is the hello response"}'));
})

app.get("/filelist", (req, res, next) => {
  var jsonFiles = catalogue.listBooks()
  res.json(jsonFiles);
});

app.post("/exportwords", (req, res, next) => {
  var words = req.body.words
  console.log(words)
  words.forEach(word => knownWords.addWord(word, 365))
  fs.appendFile(config.exportedWords,
    words.join("\n") + "\n",
    (err) => {
      var myWords = knownWords.knownWordsTable();
      res.json({
        success: err,
        totalWords: knownWords.knownWords(),
        words: myWords,
      });
    });
});

app.post("/loadfile", (req, res, next) => {
  var bookname = req.body.name;
  var wellKnown = req.body.wellKnown;
  if (wellKnown) {
    var howKnown = 20
  } else {
    var howKnown = 0
  }

  var filename = catalogue.getPath(bookname)
  console.log(`Loading ${filename}`)
  var document = new documentStats.Document(filename);
  var documentWords = document.documentWords();
  var documentChars = document.documentChars();
  var stats = document.documentStats()
  var parsed = oneTsentences.parse(document, howKnown)
  res.json({
    stats: stats,
    sentences: parsed,
    docWords: documentWords,
    chars: documentChars
  })
});

app.post("/getKnownWords", (req, res, next) => {
  var words = knownWords.knownWordsTable();
  var chars = knownWords.knownCharsTable();
  res.json({
    words: words,
    chars: chars,
  });
});


app.get("/saveWordlist", (req, res, next) => {
  // todo, do a callback promise or smth
  knownWords.saveWords((err) => {
    res.json({
      success: err,
      totalWords: knownWords.knownWords()
    })
  });

});

app.get("/loadAnki", (req, res, next) => {
  importFromAnki.exportAnkiKeywords().then(ankiObject => {
    knownWords.mergeWords(ankiObject);
    res.json({
      success: 1
    })
  });
});


var httpServer = http.createServer(app);


httpServer.listen(8080);
console.log("Server is Running");
