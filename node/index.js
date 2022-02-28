// Importing the http module
const http = require("http")
const https = require("https")
const fs = require('fs');
const bodyParser = require('body-parser')
const express = require("express")
const app = express()
const oneTsentences = require("./scripts/oneTsentences.js")

const config = JSON.parse(fs.readFileSync("../config.json", "UTF-8", "r"))

var knownWordsText = fs.readFileSync(
  config.knownWords, "UTF-8", "r");
var known = new Set([...knownWordsText.split("\n")]);


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
  words.forEach(word => known.add(word))
  fs.appendFile(config.exportedWords,
    words.join("\n") + "\n",
    (err) => {
      res.json({
        success: err,
        totalWords: known.size
      });
    });
});

app.post("/loadfile", (req, res, next) => {
  var filename = req.body.name
  var parsed = oneTsentences.parse(filename, known)
  res.json(parsed)
});

app.get("/saveWordlist", (req, res, next) => {
  fs.writeFile(config.knownWords, [...known.values()].join("\n"), (err) => {
    res.json({
      success: err,
      totalWords: known.size
    })
  });

});


var httpServer = http.createServer(app);


httpServer.listen(8080);
console.log("Server is Running");
