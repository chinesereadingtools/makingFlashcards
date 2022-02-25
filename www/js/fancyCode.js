var columnDefs = [{
    headerName: 'Word',
    field: 'word',
    // sortable: true,
    width: 130,
    checkboxSelection: true,
    filter: true,
    suppressSizeToFit: true
  },
  {
    headerName: '#',
    field: 'occurances',
    // sortable: true,
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

async function main() {
  var eGridDiv = document.querySelector('#myGrid')
  new agGrid.Grid(eGridDiv, globalThis.gridOptions)

  let response = await fetch("/filelist");
  let data = await response.json();
  console.log(data)
  var fileSelector = document.querySelector('#jsonFiles');

  globalThis.gridOptions.columnApi.sizeColumnsToFit(eGridDiv.offsetWidth - 40)

  data.forEach((file) => {
    var opt = document.createElement('option');
    opt.value = file;
    opt.innerHTML = file;
    fileSelector.appendChild(opt);
  });

  fileSelector.addEventListener('change', async (event) => {
    console.log(event)
    console.log(fileSelector.value)
    let contents = await fetch("/loadfile", {
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=utf-8"
      },
      body: JSON.stringify({
        "name": fileSelector.value
      })
    });
    let obj = await contents.json()
    onReaderLoad(obj)
    migakuParse()
  });

}

function clearSelection() {
  globalThis.gridOptions.api.deselectAll()
  // Todo, delele selected from rowData???
}

async function exportWords() {

  const selectedRows = globalThis.gridOptions.api.getSelectedRows();
  var words = [...new Set(selectedRows.map(row => row.word))];
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
  alert("Exported words " + words.join(','))
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
    console.log(migakuParse)
  }
}

main()

function onReaderLoad(obj) {
  console.log(obj.occurances)
  var sentences = obj.sentences
  console.log(sentences)
  var keys = Object.keys(sentences)
  console.log(keys)
  keys.sort((x, y) => {
    if (sentences[x].frequency > sentences[y].frequency) {
      return -1;
    } else {
      return 1;
    }
  });


  console.log(keys)
  globalThis.jsonObj = obj

  var rowData = []

  for (var key of keys) {
    var data = sentences[key]
    var candidates = data['sentences']
    for (var sentIdx of Object.keys(candidates)) {

      cand = candidates[sentIdx]
      sentence = cand['sentence']
      progress = cand['position']

      rowData.push({
        word: key,
        occurances: data['frequency'],
        stars: data['stars'],
        position: progress,
        sentence: sentence
      });
    }
  }
  console.log(rowData.length)
  globalThis.gridOptions.api.setRowData(rowData)
  reCalcStats();
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
  document.querySelector('#known').innerHTML = globalThis.jsonObj.currentKnown.toFixed(2);
}
