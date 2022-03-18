const fs = require('fs');
const config = JSON.parse(fs.readFileSync("../config.json", "UTF-8", "r"))

var books = JSON.parse(fs.readFileSync(config.catalogue, "UTF-8", "r"))
const favoritesFile = config.catalogue + ".favorites"
if (!fs.existsSync(favoritesFile)) {
  fs.writeFileSync(favoritesFile, "[]");
}
var favorites = JSON.parse(fs.readFileSync(favoritesFile, "UTF-8", "r"))

module.exports = {
  listBooks: () => {
    books = JSON.parse(fs.readFileSync(config.catalogue, "UTF-8", "r"))
    return Object.keys(books)
  },
  getPath: bookName => books[bookName].segmentedText,
  addFavorite: (bookName) => {
    if (!favorites.includes(bookName)) {
      favorites.push(bookName)
      console.log(`Favorited ${bookName}`)
      fs.writeFileSync(favoritesFile, JSON.stringify(favorites));
    }
  },
  listFavorites: () => {
    books = JSON.parse(fs.readFileSync(config.catalogue, "UTF-8", "r"))
    return Object.keys(books).filter(title => favorites.includes(title));
  }

}
