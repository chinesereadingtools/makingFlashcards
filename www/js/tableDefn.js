var sentenceCols = [{
    headerName: 'Mark',
    field: 'markButton',
    cellRenderer: MarkLearnedRenderer,
    resizable: false,
    width: 50,
    suppressSizeToFit: true
  },
  {
    headerName: 'Word',
    field: 'word',
    resizable: true,
    width: 130,
    filter: WordFilter,
    suppressSizeToFit: true
  },
  {
    headerName: '#',
    field: 'occurances',
    sortable: true,
    width: 100,
    filter: 'agNumberColumnFilter',
    suppressSizeToFit: true
  },
  {
    headerName: 'Stars',
    field: 'stars',
    // sortable: true,
    width: 160,
    filter: StarsFilter,
    suppressSizeToFit: true
  },
  {
    headerName: 'Pos',
    field: 'position',
    width: 100,
    filter: true,
    suppressSizeToFit: true
  },
  {
    headerName: 'Sentence',
    field: 'sentence',
    resizable: true,
    wrapText: true,
    autoHeight: true
  },
]

wordsCols = [{
    headerName: 'Word',
    field: 'word',
    resizable: true,
    width: 130,
    filter: WordFilter,
    suppressSizeToFit: true
  },
  {
    headerName: 'Stars',
    field: 'stars',
    sortable: true,
    width: 160,
    filter: StarsFilter,
    suppressSizeToFit: true
  },
  {
    headerName: 'Interval',
    field: 'interval',
    resizable: false,
    sortable: true,
    width: 160,
    suppressSizeToFit: true
  },

]

docWordsCols = [{
    headerName: 'Mark',
    field: 'markButton',
    cellRenderer: MarkLearnedRenderer,
    resizable: false,
    width: 50,
    suppressSizeToFit: true
  },
  {
    headerName: 'Word',
    field: 'word',
    resizable: true,
    width: 130,
    filter: WordFilter,
    suppressSizeToFit: true
  },
  {
    headerName: 'Stars',
    field: 'stars',
    sortable: true,
    width: 160,
    filter: StarsFilter,
    suppressSizeToFit: true
  },
  {
    headerName: 'occurances',
    field: 'occurances',
    resizable: false,
    sortable: true,
    width: 160,
    suppressSizeToFit: true
  },
  {
    headerName: 'isKnown',
    field: 'isKnown',
    resizable: false,
    filter: KnownFilter,
    width: 160,
    suppressSizeToFit: true
  },

]

var Tables = {
  sentences: {
    columnDefs: sentenceCols,
    rowData: [],
    rowHeight: 100,
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
      reCalcStats();
      migakuParse();
    },
  },
  words: {
    columnDefs: wordsCols,
    rowData: [],
    rowHeight: 30,
    //getRowHeight: params => params.
    rowBuffer: 20,
    enableCellTextSelection: true,
    suppressRowClickSelection: true,
    // If these can be ratelimited then reenable
    // onBodyScrollEnd: (event) => migakuParse(),
  },

  docWords: {
    columnDefs: docWordsCols,
    rowData: [],
    rowHeight: 30,
    //getRowHeight: params => params.
    rowBuffer: 20,
    enableCellTextSelection: true,
    suppressRowClickSelection: true,
    // If these can be ratelimited then reenable
    // onBodyScrollEnd: (event) => migakuParse(),
  }
}
