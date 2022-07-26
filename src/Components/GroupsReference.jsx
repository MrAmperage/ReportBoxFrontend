import { Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { RowTablePointerStyle } from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';
const GroupProfile = React.lazy(() => import('./GroupProfile'));
export default function GroupsReference() {
  const [GroupsTable, SetNewGroupsTable] = useState([]);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [Profile, SetNewProfile] = useState(null);
  const [ShowModal, SetNewShowModal] = useState(false);
  const RequestProfile = (Id) => {
    return ApiFetch(`api/Groups/${Id}`, 'GET', undefined, (Response) => {
      SetNewProfile(Response.Data);
    });
  };
  const RequestData = () => {
    ApiFetch('api/Groups', 'GET', undefined, (Response) => {
      SetNewGroupsTable(Response.Data);
    });
  };

  useEffect(RequestData, []);
  return (
    <>
      <Modal
        title="Профиль группы"
        onCancel={() => {
          SetNewShowModal(false);
        }}
        visible={ShowModal}
        width="450px"
        destroyOnClose={true}
        closable={false}
        maskClosable={false}
        okButtonProps={{ size: 'small' }}
        cancelButtonProps={{ size: 'small' }}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <React.Suspense>
          <GroupProfile Profile={Profile} />
        </React.Suspense>
      </Modal>
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
