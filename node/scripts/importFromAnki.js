// import fetch from 'node-fetch'
// const fetch = require('node-fetch')
const fetch = (...args) => import('node-fetch').then(({
  default: fetch
}) => fetch(...args));

const fs = require('fs/promises')
const fsSync = require('fs')
const config = JSON.parse(fsSync.readFileSync("../config.json", "UTF-8", "r"));

async function invoke(action, params) {
  const response = await fetch("http://127.0.0.1:8765", {
    method: 'Post',
    body: JSON.stringify({
      action: action,
      version: 6,
      params: {
        ...params
      }
    })
  });
  return response.json()
}

function resolveAfter2Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 2000);
  });
}

async function exportAnkiKeywords() {
  var sync = await invoke('sync')
  var reading = await invoke('findCards', {
    query: 'deck:Reading'
  });
  var readingInfo = await invoke('cardsInfo', {
    cards: reading.result
  });

  var readingWords = readingInfo.result.map(card => card.fields.Simplified
    .value);

  var skritter = await invoke('findCards', {
    query: 'deck:Skritter'
  });
  var skritterInfo = await invoke('cardsInfo', {
    cards: skritter.result
  });
  var skritterWords = skritterInfo.result.map(card =>
    card.fields.Word.value
  );

  var words = [...readingWords, ...skritterWords]
  return words;

  // var writeFile = fs.writeFile(config.ankiKeywords, words.join("\n"), (err) => console.log(err));
  var writeFile = await fs.writeFile(config.ankiKeywords, words.join("\n"));
}

module.exports = {
  exportAnkiKeywords: () => exportAnkiKeywords()

}
