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

const config = JSON.parse(fs.readFileSync("../config.json", "UTF-8", "r"))


// Creating server, loads files from current dir
app.use(express.static('../www/'))
app.use(bodyParser.json())

app.get("/hello", (req, res, next) => {
  res.json(JSON.parse('{"msg": "This is the hello response"}'));
})

app.get("/filelist", (req, res, next) => {
  fs.readdir(config.parsedSentences, (err, files) => {
    var jsonFiles = files.filter((elem) => {
      return elem.endsWith(".json")
    });
    res.json(jsonFiles);
  });
});

app.post("/exportwords", (req, res, next) => {
  var words = req.body.words
  console.log(words)
  words.forEach(word => knownWords.addWord(word, 365))
  fs.appendFile(config.exportedWords,
    words.join("\n") + "\n",
    (err) => {
      res.json({
        success: err,
        totalWords: knownWords.knownWords()
      });
    });
});

app.post("/loadfile", (req, res, next) => {
  var filename = req.body.name
  var wellKnown = req.body.wellKnown
  var parsed;
  if (wellKnown) {
    parsed = oneTsentences.parse(filename, knownWords.wellKnown())
  } else {
    parsed = oneTsentences.parse(filename, knownWords.known())
  }
  res.json(parsed)
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
