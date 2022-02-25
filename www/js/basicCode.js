
function sayHello() {
  file = document.getElementById('fileinput')
}

document.addEventListener("DOMContentLoaded", () => {
  fileSelector = document.getElementById('fileinput')
  fileSelector.addEventListener('change', (event) => {
    var reader = new FileReader();
    reader.onload = onReaderLoad
    reader.readAsText(event.target.files[0])
  });
});

function onReaderLoad(event) {
    var obj = JSON.parse(event.target.result);
    tableOutput = document.getElementById('jsonoutput')
    console.log(obj['occurances'])
    sentences = obj['sentences']
    console.log(sentences)
    keys = Object.keys(sentences)
    console.log(keys)
    keys.sort((x,y) => {
        if (sentences[x]['frequency'] > sentences[y]['frequency']) {
            return -1;
        } else {
            return 1;
        }
      });
    console.log(keys)
    for (var key of keys) {
        var data = sentences[key]
        var row = tableOutput.insertRow(-1)
        var cell = row.insertCell(0)
        cell.innerHTML = key
        cell = row.insertCell(1)
        cell.innerHTML = data['stars']
        cell = row.insertCell(2)
        cell.innerHTML = data['frequency']
        var candidates = data['sentences']
        var first = true
        for (var key of Object.keys(candidates)) {
            cand = candidates[key]
            sentence = cand['sentence']
            progress = cand['position']

            if (!first) {
                row = tableOutput.insertRow(-1)
                row.insertCell(0)
                row.insertCell(1)
                row.insertCell(2)
            }
            first = false

            var cell = row.insertCell(3)
            cell.innerHTML = progress
            var cell = row.insertCell(4)
            cell.innerHTML = sentence


        }

    }

}

