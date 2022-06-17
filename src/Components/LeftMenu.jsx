import { Menu } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';

const LeftMenu = inject('GlobalStore')(
  observer((props) => {
    return props.GlobalStore.CurrentTabKey != null ? (
      <Menu
        items={props.GlobalStore.GetCurrentTab().Items.map((Element) => {
          return { label: Element.Caption, key: Element.Key };
        })}
      />
    ) : null;
  })
);

export default LeftMenu;
