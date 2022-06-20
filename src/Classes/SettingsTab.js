import { BaseTab } from './BaseTab';
import React from 'react';

export default class SettingTab extends BaseTab {
  constructor(TabObject, OpenTabs) {
    super(TabObject, OpenTabs);
    this.LeftSidebar = [React.lazy(() => import('../Components/LeftMenu'))];
    this.Menu = this.SetComponents();
  }
  SetComponents() {
    return this.Menu.map((MenuElement) => {
      switch (MenuElement.key) {
        case 'Statistic':
          MenuElement.component = React.lazy(() =>
            import('../Components/Statistic')
          );
          break;
        case 'UnitTypes':
          MenuElement.component = React.lazy(() =>
            import('../Components/GeneralCRUD')
          );
          break;
      }
      return MenuElement;
    });
  }
}
