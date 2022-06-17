import { Menu } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';

const LeftMenu = inject('GlobalStore')(
  observer((props) => {
    return props.GlobalStore.CurrentTabKey != null ? (
      <Menu items={props.GlobalStore.GetCurrentTab().Menu} />
    ) : null;
  })
);

export default LeftMenu;
