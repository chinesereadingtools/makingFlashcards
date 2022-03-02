var columnDefs = [{
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

globalThis.gridOptions = {
  columnDefs: columnDefs,
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
}
