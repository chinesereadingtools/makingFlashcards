const fs = require('fs');
const config = JSON.parse(fs.readFileSync("../config.json", "UTF-8", "r"))

const books = JSON.parse(fs.readFileSync(config.catalogue, "UTF-8", "r"))

module.exports = {
  listBooks: () => Object.keys(books),
  getPath: bookName => books[bookName].segmentedText,

}
