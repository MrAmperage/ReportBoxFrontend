import ReportTab from '../Classes/ReportTab';
import SettingTab from '../Classes/SettingsTab';

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
  AddTab(TabObject) {
    switch (TabObject.Type) {
      case 'setting':
        this.OpenTabs.push(new SettingTab(TabObject, this.OpenTabs));
        break;
      case 'report':
        this.OpenTabs.push(new ReportTab(TabObject, this.OpenTabs));
        break;
    }
  }
}

const Store = new GlobalStore();
export default Store;
