// Importing the http module
const http = require("http")
const https = require("https")
const fs = require('fs');
const bodyParser = require('body-parser')
const express = require("express")
const app = express()

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

app.post("/loadfile", (req, res, next) => {
  var filename = req.body.name
  fs.readFile(config.parsedSentences + "/" + filename, (err, data) => {
    res.json(JSON.parse(data));
  });
});

app.post("/exportwords", (req, res, next) => {
  var words = req.body.words
  console.log(words)
  fs.appendFile(config.exportedWords,
    words.join("\n") + "\n",
    (err) => {
      res.json({
        success: err
      });
    });
});

var httpServer = http.createServer(app);


httpServer.listen(8080);
console.log("Server is Running");
