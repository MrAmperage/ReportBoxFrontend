import { inject, observer } from 'mobx-react';
import React from 'react';

const GeneralCRUD = inject('GlobalStore')(
  observer((props) => {
    return 'Круд';
  })
);

export default GeneralCRUD;
