import { inject, observer } from 'mobx-react';
import React from 'react';

const ReferenceLayoutGenerator = inject('GlobalStore')(
  observer((props) => {
    return 'Генератор верстки';
  })
);
export default ReferenceLayoutGenerator;
