import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { RowTablePointerStyle } from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';

export default function GroupsReference() {
  const [GroupsTable, SetNewGroupsTable] = useState([]);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [Profile, SetNewProfile] = useState(null);
  const [ShowModal, SetNewShowModal] = useState(false);
  const RequestData = () => {
    ApiFetch('api/Groups', 'GET', undefined, (Response) => {
      SetNewGroupsTable(Response.Data);
    });
  };
  const RequestProfile = (Id) => {
    return ApiFetch(`api/Groups/${Id}`, 'GET', (Response) => {
      SetNewProfile(Response.Data);
    });
  };
  useEffect(RequestData, []);
  return (
    <>
      <TableButtonBar />
      <Table
        scroll={{ y: 700 }}
        pagination={false}
        dataSource={GroupsTable}
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
            onDoubleClick: () => {
              RequestProfile(Record.Id).then(() => {
                SetNewShowModal(true);
              });
            },
          };
        }}
        rowKey="Id"
        size="small"
        columns={[
          {
            title: 'Наименование',
            dataIndex: 'Caption',
            key: 'Caption',
            render: (Value, Record, Index) => {
              return <RowTablePointerStyle>{Value}</RowTablePointerStyle>;
            },
          },
        ]}
      />
    </>
  );
}
