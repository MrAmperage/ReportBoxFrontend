import { Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { RowTablePointer } from '../Styles/TableStyles';

const GeneralCRUD = inject('GlobalStore')(
  observer((props) => {
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const [Objects, SetNewObjects] = useState([]);
    const RequestObjects = () => {
      return ApiFetch(
        `api/${props.GlobalStore.GetCurrentTab.CurrentMenuElementKey}`,
        'GET',
        undefined,
        (Response) => {
          SetNewObjects(
            Response.Data.map((Object, Index) => {
              Object.Key = Index;
              Object.Editing = false;
              return Object;
            })
          );
        }
      );
    };
    useEffect(() => {
      RequestObjects();
    }, []);
    return (
      <>
        <Table
          scroll={{ y: 700 }}
          onRow={(Record) => {
            return {
              onClick: () => {
                SetNewSelectedKey(Record.Key);
              },
              onDoubleClick: () => {},
            };
          }}
          rowSelection={{
            selectedRowKeys: [SelectedKey],
            renderCell: () => null,
            hideSelectAll: true,
            columnWidth: '0px',
          }}
          rowKey="Key"
          pagination={false}
          dataSource={Objects}
          size="small"
          columns={[
            {
              title: 'Наименование',
              dataIndex: 'Caption',
              key: 'Caption',
              render: (Value, Record, Index) => {
                return <RowTablePointer>{Value}</RowTablePointer>;
              },
            },
          ]}
        />
      </>
    );
  })
);

export default GeneralCRUD;
