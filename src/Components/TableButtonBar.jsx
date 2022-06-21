import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RowButtonsWrapperStyle } from '../Styles/TableStyles';

const TableButtonBar = inject('GlobalStore')(
  observer((props) => {
    return (
      <RowButtonsWrapperStyle>
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
      </RowButtonsWrapperStyle>
    );
  })
);

export default TableButtonBar;
