import { inject, observer } from 'mobx-react';
import React from 'react';

const LeftMenu = inject('GlobalStore')(
  observer((props) => {
    return props.GlobalStore.CurrentTabKey != null
      ? props.GlobalStore.GetCurrentTab().Items.map((Element) => {
          return Element.Caption;
        })
      : null;
  })
);

export default LeftMenu;
