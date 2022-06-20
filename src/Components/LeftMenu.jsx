import { Menu } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';

const LeftMenu = inject('GlobalStore')(
  observer((props) => {
    return props.GlobalStore.CurrentTabKey != null ? (
      <Menu
        onSelect={(MenuElement) => {
          props.GlobalStore.GetCurrentTab.SetCurrentMenuElementKey(
            MenuElement.key
          );
        }}
        items={props.GlobalStore.GetCurrentTab.Menu}
        defaultSelectedKeys={[
          props.GlobalStore.GetCurrentTab.CurrentMenuElementKey,
        ]}
      />
    ) : null;
  })
);

export default LeftMenu;
