import { Modal, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { RowTablePointerStyle } from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';
const UsersReference = inject('GlobalStore')(
  observer((props) => {
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const [UsersTable, SetNewUsersTable] = useState([]);
    const [ShowModal, SetNewShowModal] = useState(false);
    const RequestData = () => {
      ApiFetch(
        `api/${props.GlobalStore.GetCurrentTab.GetCurrentMenuElementKey}`,
        'GET',
        undefined,
        (Response) => {
          SetNewUsersTable(Response.Data);
        }
      );
    };
    useEffect(() => {
      RequestData();
    }, [props.GlobalStore.GetCurrentTab.GetCurrentMenuElementKey]);
    return (
      <>
        <Modal
          maskClosable={false}
          okButtonProps={{ size: 'small' }}
          cancelButtonProps={{ size: 'small' }}
          okText="Сохранить"
          cancelText="Отмена"
          visible={ShowModal}
          onCancel={() => {
            SetNewShowModal(false);
          }}
        ></Modal>
        <TableButtonBar OnAdd={() => {}} OnDelete={() => {}} />
        <Table
          scroll={{ y: 700 }}
          pagination={false}
          rowKey="Id"
          dataSource={UsersTable}
          size="small"
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
                SetNewShowModal(true);
              },
            };
          }}
          columns={[
            {
              title: 'Имя пользователя',
              dataIndex: 'Username',
              key: 'Username',
              render: (Value, Record, Index) => {
                return <RowTablePointerStyle>{Value}</RowTablePointerStyle>;
              },
            },
            {
              title: 'Роль',
              dataIndex: 'RoleId',
              key: 'RoleId',
              render: (Value, Record, Index) => {
                return (
                  <RowTablePointerStyle>
                    {Record.Role.Rolename}
                  </RowTablePointerStyle>
                );
              },
            },
          ]}
        />
      </>
    );
  })
);

export default UsersReference;
