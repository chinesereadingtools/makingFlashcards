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
    this.numberOfStars.addEventListener('change', this.onRbChanged.bind(this));
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

  // this example isn't using getModel() and setModel(),
  // so safe to just leave these empty. don't do this in your code!!!
  //
  // except I did anyways boi
  getModel() {}

  setModel() {}
}
