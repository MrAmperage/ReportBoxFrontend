import { Checkbox, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { RowTablePointerStyle } from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';

export default function Organizations() {
  const [OrganizationsTable, SetNewOrganizationsTable] = useState([]);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const RequestData = () => {
    ApiFetch('api/Organizations', 'GET', undefined, (Response) => {
      SetNewOrganizationsTable(Response.Data);
    });
  };
  useEffect(() => {
    RequestData();
  }, []);
  return (
    <>
      <TableButtonBar />
      <Table
        scroll={{ y: 700 }}
        pagination={false}
        rowKey="Id"
        size="small"
        dataSource={OrganizationsTable}
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
        columns={[
          {
            title: 'Наименование',
            dataIndex: 'Caption',
            key: 'Caption',
            render: (Value, Record, Index) => {
              return <RowTablePointerStyle>{Value}</RowTablePointerStyle>;
            },
          },
          {
            title: 'Внутренняя',
            dataIndex: 'Internal',
            key: 'Internal',
            render: (Value, Record, Index) => {
              return (
                <RowTablePointerStyle>
                  <Checkbox checked={Value} />
                </RowTablePointerStyle>
              );
            },
          },
        ]}
      />
    </>
  );
}
