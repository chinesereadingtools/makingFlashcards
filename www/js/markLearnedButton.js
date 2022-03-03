class MarkLearnedRenderer {
  // init method gets the details of the cell to be renderer
  init(params) {
    this.eGui = document.createElement('button');
    this.eGui.innerHTML = 'X';
    this.eGui.classList.add('markLearned');
    this.eventListener = () => {
      var row = params.node.data
      exportWords([row])
      const filterInstance = Tables.sentences.api.getFilterInstance(
        'word');
      filterInstance.addWord(row.word);
    }
    this.eGui.addEventListener('click', this.eventListener);
  }

  getGui() {
    return this.eGui;
  }

  refresh(params) {
    return false;
  }
}
