import ReportTab from '../Classes/ReportTab';
import SettingTab from '../Classes/SettingsTab';
import { makeAutoObservable } from 'mobx';

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

  GetCurrentTab() {
    if (this.OpenTabs.length > 0) {
      return this.OpenTabs.find((Tab) => {
        return Tab.Key == this.CurrentTabKey;
      });
    } else {
      return null;
    }
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
    if (this.OpenTabs.length == 1) {
      this.CurrentTabKey = this.OpenTabs[0].Key;
    }
  }
}

const Store = new GlobalStore();
export default Store;
