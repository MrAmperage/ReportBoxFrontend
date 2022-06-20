import { inject, observer } from 'mobx-react';
import React from 'react';

const Statistic = inject('GlobalStore')(
  observer((props) => {
    return 'Статистика';
  })
);

export default Statistic;
