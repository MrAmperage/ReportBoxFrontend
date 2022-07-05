import { Button, Input, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import {
  RowButtonsWrapperStyle,
  RowInputStyle,
  RowStyle,
  RowTablePointerStyle,
} from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';

const CRUDComponent = inject('GlobalStore')(
  observer((props) => {
    const [ObjectTable, SetNewObjectTable] = useState([]);
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const RequestData = () => {
      ApiFetch(
        `api/${props.GlobalStore.GetCurrentTab.GetCurrentMenuElementKey}`,
        'GET',
        undefined,
        (Response) => {
          SetNewObjectTable(
            Response.Data.map((Object) => {
              Object.Key = nanoid();
              Object.Edited = false;
              Object.InputRef = React.createRef();
              return Object;
            })
          );
        }
      );
    };
    const EditObject = (Index) => {
      let NewObjectTable = [...ObjectTable];
      NewObjectTable[Index].Edited = true;
      SetNewObjectTable(NewObjectTable);
    };
    useEffect(() => {
      RequestData();
    }, []);
    return (
      <>
        <TableButtonBar />
        <Table
          scroll={{ y: 700 }}
          rowSelection={{
            columnWidth: 0,
            selectedRowKeys: [SelectedKey],
            hideSelectAll: true,
            renderCell: () => {
              return null;
            },
          }}
          onRow={(Record, Index) => {
            return {
              onClick: () => {
                SetNewSelectedKey(Record.Key);
              },
              onDoubleClick: () => {
                EditObject(Index);
              },
            };
          }}
          pagination={false}
          dataSource={ObjectTable}
          rowKey="Key"
          size="small"
          columns={[
            {
              title: 'Наименование',
              dataIndex: 'Caption',
              key: 'Caption',
              render: (Value, Record, Index) => {
                if (Record.Edited) {
                  return (
                    <RowStyle>
                      <RowInputStyle>
                        <Input
                          size="small"
                          defaultValue={Value}
                          ref={Record.InputRef}
                        />
                      </RowInputStyle>
                      <RowButtonsWrapperStyle>
                        <Button size="small" type="primary">
                          Сохранить
                        </Button>
                        <Button size="small">Отмена</Button>
                      </RowButtonsWrapperStyle>
                    </RowStyle>
                  );
                } else {
                  return <RowTablePointerStyle>{Value}</RowTablePointerStyle>;
                }
              },
            },
          ]}
        />
      </>
    );
  })
);

export default CRUDComponent;
