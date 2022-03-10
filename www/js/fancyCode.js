async function main() {
  var eGridDiv = document.querySelector('#sentenceGrid')
  new agGrid.Grid(eGridDiv, Tables.sentences)
  var wGridDiv = document.querySelector('#wordGrid')
  new agGrid.Grid(wGridDiv, Tables.words)
  var dGridDiv = document.querySelector('#docWordGrid')
  new agGrid.Grid(dGridDiv, Tables.docWords)
  var dcGridDiv = document.querySelector('#docCharGrid')
  new agGrid.Grid(dcGridDiv, Tables.docChars)
  var cGridDiv = document.querySelector('#charGrid')
  new agGrid.Grid(cGridDiv, Tables.chars)

  let response = await fetch("/filelist");
  let data = await response.json();
  var fileSelector = document.querySelector('#jsonFiles');

  Tables.sentences.columnApi.sizeColumnsToFit(eGridDiv.offsetWidth -
    40)

  data.forEach((file) => {
    var opt = document.createElement('option');
    opt.value = file;
    opt.innerHTML = file;
    fileSelector.appendChild(opt);
  });


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

  document.querySelectorAll('.tablinks').forEach((target) => {
    target.addEventListener('click',
      (event) => openGrid(target)
    )
  });

  document.getElementById("defaultTab").click();

  await loadFile()
  await loadKnownWords()
  setTimeout(() => {
      migakuParse()
    },
    3000);

}



function openGrid(button) {
  // Declare all variables
  var gridName = button.getAttribute('target')
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
  document.getElementById(gridName).style.display = "";
  button.className += " active";
  migakuParse();
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
    Tables.words.data = obj.words;
    Tables.words.api.setRowData(obj.words);
    reCalcWordStats();

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

async function loadKnownWords() {
  let response = await fetch("/getKnownWords", {
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=utf-8"
    },
    body: JSON.stringify({})
  });
  let data = await response.json();

  var words = data.words;
  var chars = data.chars;

  Tables.words.data = words;
  Tables.words.api.setRowData(words);
  Tables.chars.data = chars;
  Tables.chars.api.setRowData(chars);
  reCalcWordStats();

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

  var sentences = data.sentences;
  var words = data.docWords;
  var chars = data.chars;

  Tables.sentences.data = sentences
  Tables.docWords.data = words
  Tables.sentences.data.wellKnown = wellKnown;
  sortRowData(sentences.rowData)
  Tables.sentences.api.setRowData(sentences.rowData)
  Tables.docWords.api.setRowData(words);
  Tables.docChars.api.setRowData(chars);

  reCalcSentenceStats()
  return
}

function reCalcSentenceStats() {
  var data = Tables.sentences.data
  if (data == undefined) {
    return;
  }
  var wellKnown = data.wellKnown
  var currentWords = {}
  Tables.sentences.api.forEachNodeAfterFilter((rowNode, index) => {
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
  var bookWords = Tables.docWords.data.length
  var knownBookWords = Tables.docWords.data.filter(entry => entry.isKnown)
    .length
  document.querySelector('#bookWords').innerHTML = bookWords;
  document.querySelector('#knownBookWords').innerHTML = knownBookWords;
}

function reCalcWordStats() {
  var totalWords = Tables.words.data.length;
  var knownCharacters = Tables.chars.data.length;
  document.querySelector('#totalWords').innerHTML = totalWords;
  document.querySelector('#totalCharacters').innerHTML = knownCharacters;
}

// Prevent migaku empty spans from messing stuff up
const observer = new MutationObserver(mutations_list => {
  mutations_list.forEach(mutation => {
    mutation.addedNodes.forEach(added_node => {
      if (added_node.innerText == '' && added_node.nodeName ==
        'SPAN') {
        added_node.remove()
      }
    });
  });
});
observer.observe(document.querySelector('body'), {
  subtree: true,
  childList: true
});


main()
