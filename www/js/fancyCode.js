async function main() {
  var eGridDiv = document.querySelector('#sentenceGrid')
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
  setTimeout(() => {
      migakuParse()
    },
    3000);

  document.querySelector('#toggleButton').addEventListener('click',
    toggleMigakuContainer);
  document.querySelector('#parseButton').addEventListener('click',
    migakuParse);
  document.querySelector('#syncButton').addEventListener('click',
    ankiLoad);
  document.querySelector('#loadAll').addEventListener('click',
    () => loadFile(false));
  document.querySelector('#loadKnown').addEventListener('click',
    () => loadFile(true));
  document.querySelector('#saveProgress').addEventListener('click',
    saveWordList);
  document.querySelector('#jsonFiles').addEventListener('change',
    () => loadFile(false));

  document.getElementById("defaultTab").click();

}



function openGrid(evt, gridName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  var contents = document.getElementById(gridName)
  console.log(contents)
  document.getElementById(gridName).style.display = "block";
  evt.currentTarget.className += " active";

  var eGridDiv = document.querySelector('#sentenceGrid')
  globalThis.gridOptions.columnApi.sizeColumnsToFit(eGridDiv.offsetWidth -
    40)
} 

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
    console.log(
      `Exported words ${words.join(',')} now know ${obj.totalWords} total words`
    )
  });
}


function toggleMigakuContainer() {
  var container = document.querySelector('#migaku-toolbar-container')
  var state = container.style.display;
  if (state != 'block') {
    container.style.display = 'block';
  } else {
    container.style.display = 'none';
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

  globalThis.wellKnown = wellKnown;
  globalThis.jsonObj = data
  sortRowData(data.rowData)
  globalThis.gridOptions.api.setRowData(data.rowData)
  reCalcStats();
  migakuParse();

}


function reCalcStats() {
  var wellKnown = globalThis.wellKnown
  var data = globalThis.jsonObj
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
  var percent = occurances / data.totalWords * 100;

  var currentKnown = !wellKnown ? data.currentWellKnown : data.currentKnown

  document.querySelector('#oneTwords').innerHTML = words;
  document.querySelector('#occurances').innerHTML = occurances;
  document.querySelector('#percent').innerHTML = percent.toFixed(2);
  document.querySelector('#known').innerHTML = currentKnown.toFixed(2);
}

main()
