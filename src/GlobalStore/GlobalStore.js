import ReportTab from '../Classes/ReportTab';
import SettingTab from '../Classes/SettingsTab';
import { action, computed, makeAutoObservable, makeObservable } from 'mobx';

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

  get GetCurrentTab() {
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

  SetCurrentTab(NewTabKey) {
    this.CurrentTabKey = NewTabKey;
  }
  RemoveTab(TabKey) {
    if (this.OpenTabs.length == 1) {
      this.CurrentTabKey = null;
    }
    if (this.CurrentTabKey == TabKey && this.OpenTabs.length > 1) {
      if (
        this.OpenTabs.findIndex((Tab) => {
          return Tab.Key == TabKey;
        }) <
        this.OpenTabs.length - 1
      ) {
        this.CurrentTabKey =
          this.OpenTabs[
            this.OpenTabs.findIndex((Tab) => {
              return Tab.Key == TabKey;
            }) + 1
          ].Key;
      } else {
        this.CurrentTabKey =
          this.OpenTabs[
            this.OpenTabs.findIndex((Tab) => {
              return Tab.Key == TabKey;
            }) - 1
          ].Key;
      }
    }
    this.OpenTabs.splice(
      this.OpenTabs.findIndex((Tab) => {
        return Tab.Key == TabKey;
      }),
      1
    );
  }
}

const Store = new GlobalStore();
export default Store;
