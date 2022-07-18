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
        case 'UnitTypes':
          MenuElement.component = React.lazy(() =>
            import('../Components/CRUDReference')
          );
          break;
        case 'Users':
          MenuElement.component = React.lazy(() =>
            import('../Components/UsersReference')
          );
          break;
        case 'Manufacturers':
          MenuElement.component = React.lazy(() =>
            import('../Components/CRUDReference')
          );
          break;
        case 'TransportTypes':
          MenuElement.component = React.lazy(() =>
            import('../Components/CRUDReference')
          );
          break;
        case 'UnitStates':
          MenuElement.component = React.lazy(() =>
            import('../Components/CRUDReference')
          );
          break;
        case 'CargoTypes':
          MenuElement.component = React.lazy(() =>
            import('../Components/CRUDReference')
          );
          break;
        case 'Roles':
          MenuElement.component = React.lazy(() =>
            import('../Components/RolesReference')
          );
          break;
      }

      return MenuElement;
    });
  }
}
