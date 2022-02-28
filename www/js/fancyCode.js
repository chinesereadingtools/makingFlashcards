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

function sortRowData(rowData) {
  rowData.sort((x, y) => {
    if (x.occurances == y.occurances) {
      if (x.word > y.word) {
        return -1
      } else {
        return 1
      }
    } else {
      if (x.occurances > y.occurances) {
        return -1;
      } else {
        return 1;
      }
    }
  });
}


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

async function main() {
  var eGridDiv = document.querySelector('#myGrid')
  new agGrid.Grid(eGridDiv, globalThis.gridOptions)

  let response = await fetch("/filelist");
  let data = await response.json();
  console.log(data)
  var fileSelector = document.querySelector('#jsonFiles');

  globalThis.gridOptions.columnApi.sizeColumnsToFit(eGridDiv.offsetWidth -
    40)

  data.forEach((file) => {
    var opt = document.createElement('option');
    opt.value = file;
    opt.innerHTML = file;
    fileSelector.appendChild(opt);
  });

  loadFile()
}

function clearSelection() {
  globalThis.gridOptions.api.deselectAll()
  // Todo, delele selected from rowData???
}

async function exportSelectedWords() {
  const selectedRows = globalThis.gridOptions.api.getSelectedRows();
  exportWords(selectedRows)
}

async function exportWords(rows) {
  withLoader(async () => {
    var words = [...new Set(rows.map(row => row.word))];
    let contents = await fetch("/exportwords", {
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=utf-8"
      },
      body: JSON.stringify({
        words: words
      })
    });
    let obj = await contents.json()
    console.log(obj)
    clearSelection()
    console.log(
      `Exported words ${words.join(',')} now know ${obj.totalWords} total words`
    )
  });
}

function toggleMigakuContainer() {
  var container = document.querySelector('#migaku-toolbar-container')
  var state = container.style.display;
  if (state != 'none') {
    container.style.display = 'none';
  } else {
    container.style.display = '';
  }
}

function migakuParse() {
  var migakuParse = document.querySelector('#migaku-toolbar-po-parse')
  if (migakuParse) {
    migakuParse.click()
  } else {
    console.log("Consider installing Migaku")
  }
}

main()

async function withLoader(fn) {
  showLoader();
  await fn();
  finishLoader();
}

async function saveWordList() {
  withLoader(async () => {
    let response = await fetch("/saveWordlist");
    let data = await response.json();
  });
}

async function ankiLoad() {
  withLoader(async () => {
    let response = await fetch("/loadAnki");
    let data = await response.json();
    console.log(data);
  });
}

async function loadFile(wellKnown = false) {

  var fileSelector = document.querySelector('#jsonFiles');

  let response = await fetch("/loadfile", {
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=utf-8"
    },
    body: JSON.stringify({
      name: fileSelector.value,
      wellKnown: wellKnown
    })
  });
  let data = await response.json();

  globalThis.jsonObj = data
  sortRowData(data.rowData)
  globalThis.gridOptions.api.setRowData(data.rowData)
  reCalcStats();
  migakuParse();

}


function reCalcStats() {
  var currentWords = {}
  globalThis.gridOptions.api.forEachNodeAfterFilter((rowNode, index) => {
    currentWords[rowNode.data.word] = rowNode.data.occurances
  });
  var words = 0;
  var occurances = 0;

  Object.entries(currentWords).forEach(([word, val]) => {
    words += 1;
    occurances += val;
  });
  var percent = occurances / globalThis.jsonObj.totalWords * 100;

  document.querySelector('#oneTwords').innerHTML = words;
  document.querySelector('#occurances').innerHTML = occurances;
  document.querySelector('#percent').innerHTML = percent.toFixed(2);
  document.querySelector('#known').innerHTML = globalThis.jsonObj.currentKnown
    .toFixed(2);
}
