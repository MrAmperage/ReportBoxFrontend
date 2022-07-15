import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import TableButtonBar from './TableButtonBar';
import { Table } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import { RowTablePointerStyle } from '../Styles/TableStyles';

const RolesReference = inject('GlobalStore')(
  observer((props) => {
    const [RolesTable, SetNewRolesTable] = useState([]);
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const RequestData = () => {
      ApiFetch('api/Roles', 'GET', undefined, (Response) => {
        SetNewRolesTable(Response.Data);
      });
    };
    useEffect(() => {
      RequestData();
    }, [props.GlobalStore.GetCurrentTab.GetCurrentMenuElementKey]);
    return (
      <>
        <TableButtonBar />
        <Table
          scroll={{ y: 700 }}
          pagination={false}
          rowKey="Id"
          columns={[
            {
              title: 'Наименование',
              dataIndex: 'Rolename',
              render: (Value, Record, Index) => {
                return <RowTablePointerStyle>{Value}</RowTablePointerStyle>;
              },
            },
          ]}
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
                SetNewSelectedKey(Record.Id);
              },
              onDoubleClick: () => {},
            };
          }}
          dataSource={RolesTable}
          size="small"
        />
      </>
    );
  })
);

export default RolesReference;
