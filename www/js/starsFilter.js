class StarsFilter {
  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = `<div style="display: inline-block;">
                <select id="numberOfStars" name="fruit">
                  <option value ="0">Nothing</option>
                  <option value ="5">★★★★★</option>
                  <option value ="4">★★★★</option>
                  <option value ="3">★★★</option>
                  <option value ="2">★★</option>
                  <option value ="1">★</option>
                </select> 
            </div>`;
    this.numberOfStars = this.eGui.querySelector('#numberOfStars');
    this.numberOfStars.addEventListener('change', this.onRbChanged.bind(
      this));
    this.filterActive = false;
    this.stars = 0
    this.filterChangedCallback = params.filterChangedCallback;
  }

  onRbChanged() {
    var value = this.numberOfStars.value;
    console.log(value)
    this.stars = parseInt(value)
    this.filterChangedCallback();
  }

  getGui() {
    return this.eGui;
  }

  doesFilterPass(params) {
    return params.data.stars == "★".repeat(this.stars);
  }

  isFilterActive() {
    return this.stars != 0;
  }
}

class KnownFilter {
  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = `<div style="display: inline-block;">
      <input class='knownRadio' type='radio' name='known' value='all' checked>
      <lable>show all</lable>
      <input class='knownRadio' type='radio' name='known' value='known'>
      <lable>show known</lable>
      <input class='knownRadio' type='radio' name='known' value='unknown'>
      <lable>show unknown</lable>
    </div>`;
    this.radios = this.eGui.querySelectorAll("[name='known']");
    this.radios.forEach(radio => {
      radio.addEventListener('change', event => {
        this.onChanged(radio);
      });
    });
    this.filterActive = false;
    this.value = 'all'
    this.filterChangedCallback = params.filterChangedCallback;
  }

  onChanged(radio) {
    this.value = radio.value;
    this.filterChangedCallback();
  }

  getGui() {
    return this.eGui;
  }

  doesFilterPass(params) {
    if (this.value == 'known') {
      return params.data.isKnown;
    } else {
      return !params.data.isKnown;
    }
  }

  isFilterActive() {
    return this.value != 'all';
  }
}

class WordFilter {
  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = `<div style="display: inline-block;">
        <span class=words></span>
      </div>`;
    this.wordsSpan = this.eGui.querySelector('.words');
    this.filterActive = false;
    this.filterChangedCallback = params.filterChangedCallback;
    this.addedWords = new Set()
  }

  addWord(word) {
    this.addedWords.add(word)
    this.filterChangedCallback();
  }

  getGui() {
    this.wordsSpan = [...this.addedWords.values()].join(",");
    return this.eGui;
  }

  doesFilterPass(params) {
    return !this.addedWords.has(params.data.word);
  }

  isFilterActive() {
    return this.addedWords.size != 0;
  }
}
