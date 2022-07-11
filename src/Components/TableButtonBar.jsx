import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RowStyle } from '../Styles/TableStyles';

const TableButtonBar = inject('GlobalStore')(
  observer((props) => {
    return (
      <RowStyle width="160px" justifyContent="space-between">
        <Button
          type="primary"
          size="small"
          onClick={() => {
            props.OnAdd();
          }}
        >
          Добавить
        </Button>
        <Button
          type="primary"
          danger
          size="small"
          onClick={() => {
            props.OnDelete();
          }}
        >
          Удалить
        </Button>
      </RowStyle>
    );
  })
);

export default TableButtonBar;
