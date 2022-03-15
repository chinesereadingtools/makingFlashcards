const fs = require('fs');
const config = JSON.parse(fs.readFileSync("../config.json", "UTF-8", "r"))

var books = JSON.parse(fs.readFileSync(config.catalogue, "UTF-8", "r"))

module.exports = {
  listBooks: () => {
    books = JSON.parse(fs.readFileSync(config.catalogue, "UTF-8", "r"))
    return Object.keys(books)
  },
  getPath: bookName => books[bookName].segmentedText,

}
