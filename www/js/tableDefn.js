function override(dictA, dictB) {
  return {
    ...dictA,
    ...dictB
  }
}

function starsColumn(other) {
  return override({
    headerName: 'Stars',
    field: 'stars',
    width: 200,
    cellRenderer: CenteredRenderer,
    filter: StarsFilter,
    suppressSizeToFit: true
  }, other);
}

function markLearnedColumn(other) {
  return override({
      headerName: 'Mark',
      field: 'markButton',
      cellRenderer: MarkLearnedRenderer,
      resizable: false,
      width: 50,
      suppressSizeToFit: true
    },
    other);
}

function wordColumn() {
  return {
    headerName: 'Word',
    field: 'word',
    resizable: true,
    cellRenderer: CenteredRenderer,
    width: 130,
    filter: WordFilter,
    suppressSizeToFit: true
  }
}

function occuranceColumn(other) {
  return override({
    headerName: '#',
    field: 'occurances',
    sortable: true,
    width: 100,
    cellRenderer: CenteredRenderer,
    filter: 'agNumberColumnFilter',
    suppressSizeToFit: true
  }, other);
}

function isKnownColumn(other) {
  return override({
    headerName: 'isKnown',
    field: 'isKnown',
    resizable: false,
    filter: KnownFilter,
    cellRenderer: CenteredRenderer,
    width: 160,
    suppressSizeToFit: true
  }, other);
}

var sentenceCols = [
  markLearnedColumn(),
  wordColumn(),
  occuranceColumn(),
  starsColumn({
    width: 160
  }),
  {
    headerName: 'Pos',
    field: 'position',
    width: 100,
    filter: true,
    cellRenderer: CenteredRenderer,
    suppressSizeToFit: true
  },
  {
    headerName: 'Sentence',
    field: 'sentence',
    resizable: true,
    cellRenderer: CenteredRenderer,
    wrapText: true,
    autoHeight: true
  },
]

wordsCols = [
  wordColumn(),
  starsColumn(),
  {
    headerName: 'Interval',
    field: 'interval',
    resizable: false,
    sortable: true,
    cellRenderer: CenteredRenderer,
    width: 160,
    suppressSizeToFit: true
  },

]

docWordsCols = [
  markLearnedColumn(),
  wordColumn(),
  starsColumn(),
  occuranceColumn({
    width: 80
  }),
  isKnownColumn()
]

charCols = [
  wordColumn(),
  isKnownColumn({
    headerName: 'Alone',
  }),
]

docCharCols = [
  wordColumn(),
  occuranceColumn({
    width: 80
  }),
  isKnownColumn()
]

var Tables = {
  sentences: {
    columnDefs: sentenceCols,
    rowData: [],
    rowHeight: 100,
    // todo, predict height based on number of characters in sentence
    //getRowHeight: params => params.
    rowBuffer: 100,
    rowSelection: 'multiple',
    enableCellTextSelection: true,
    ensureDomOrder: true,
    suppressColumnVirtualisation: true,
    suppressRowClickSelection: true,
    // If these can be ratelimited then reenable
    // onBodyScrollEnd: (event) => migakuParse(),
    onSortChanged: (event) => migakuParse(),
    onFilterChanged: (event) => {
      reCalcSentenceStats();
      migakuParse();
    },
  },
  words: {
    columnDefs: wordsCols,
    rowData: [],
    rowHeight: 60,
    rowBuffer: 20,
    enableCellTextSelection: true,
    suppressRowClickSelection: true,
  },
  docWords: {
    columnDefs: docWordsCols,
    rowData: [],
    rowHeight: 60,
    rowBuffer: 20,
    enableCellTextSelection: true,
    suppressRowClickSelection: true,
  },
  chars: {
    columnDefs: charCols,
    rowData: [],
    rowHeight: 60,
    rowBuffer: 20,
    enableCellTextSelection: true,
    suppressRowClickSelection: true,
  },
  docChars: {
    columnDefs: docCharCols,
    rowData: [],
    rowHeight: 60,
    rowBuffer: 20,
    enableCellTextSelection: true,
    suppressRowClickSelection: true,
  }
}
