import { action, computed, makeObservable, observable } from 'mobx';
import React from 'react';

export class BaseTab {
  constructor(TabObject, OpenTabs) {
    this.Id = TabObject.Id;
    this.Caption = TabObject.Caption;
    this.Key = this.GenerateTabKey(TabObject.Id, OpenTabs);
    this.Menu = this.GenerateMenu(TabObject);
    this.CurrentMenuElementKey = TabObject.LeftMenu[0].Id;
    this.LeftSidebar = [];
    makeObservable(this, {
      CurrentMenuElementKey: observable,
      GetComponent: computed,
      GetCurrentMenuElement: computed,
      GetCurrentScheme: computed,
      SetCurrentMenuElementKey: action,
    });
  }
  SetCurrentMenuElementKey(NewCurrentMenuElementKey) {
    this.CurrentMenuElementKey = NewCurrentMenuElementKey;
  }
  get GetCurrentScheme() {
    return this.GetCurrentMenuElement.scheme;
  }
  get GetCurrentMenuElement() {
    return this.Menu.find((MenuItem) => {
      return MenuItem.Id == this.ChangeCurrentMenuElementKey;
    });
  }
  get GetComponent() {
    let ReactComponent = null;
    ReactComponent = this.Menu.find((MenuItem) => {
      return MenuItem.key == this.CurrentMenuElementKey;
    }).component;
    return <ReactComponent />;
  }
  GenerateMenu(TabObject) {
    return TabObject.LeftMenu.map((Element) => {
      return {
        label: Element.Caption,
        key: Element.Id,
        scheme: Element.Scheme.Scheme,
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
