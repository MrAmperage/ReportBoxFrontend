import { action, computed, makeObservable, observable } from 'mobx';
import React from 'react';

export class BaseTab {
  constructor(TabObject, OpenTabs) {
    this.Id = TabObject.Id;
    this.Caption = TabObject.Caption;
    this.Key = this.GenerateTabKey(TabObject.Id, OpenTabs);
    this.Menu = this.GenerateMenu(TabObject);
    this.CurrentMenuElementKey =
      TabObject.LeftMenu.length > 0 ? TabObject.LeftMenu[0].Id : null;
    this.LeftSidebar = [];
    makeObservable(this, {
      CurrentMenuElementKey: observable,
      GetComponent: computed,
      SetCurrentMenuElementKey: action,
      GetCurrentMenuElementKey: computed,
    });
  }
  SetCurrentMenuElementKey(NewCurrentMenuElementKey) {
    this.CurrentMenuElementKey = NewCurrentMenuElementKey;
  }
  get GetCurrentMenuElementKey() {
    return this.CurrentMenuElementKey;
  }

  get GetComponent() {
    let ReactComponent = React.lazy(() => import('../Components/MenuNotFound'));
    if (this.Menu.length > 0) {
      ReactComponent = this.Menu.find((MenuItem) => {
        return MenuItem.key == this.GetCurrentMenuElementKey;
      }).component;
    }

    return <ReactComponent />;
  }
  GenerateMenu(TabObject) {
    return TabObject.LeftMenu.map((Element) => {
      return {
        label: Element.Caption,
        key: Element.Id,
      };
    });
  }
  GenerateTabKey(TabID, OpenTabs) {
    let TabCount = 0;
    OpenTabs.forEach((Tab) => {
      if (Tab.Id == TabID) {
        TabCount = TabCount + 1;
      }
    });
    return `${TabID}${TabCount}`;
  }
}
