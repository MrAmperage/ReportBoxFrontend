const { makeAutoObservable } = require('mobx');

class GlobalStore {
  OpenTabs = [];
  CurrentTabKey = null;
  ApplicationMenu = [];

  constructor() {
    makeAutoObservable(this);
  }
  SetNewApplicationMenu(NewApplicationMenu) {
    this.ApplicationMenu = NewApplicationMenu;
  }
}

const Store = new GlobalStore();
export default Store;
