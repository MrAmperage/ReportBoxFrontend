import { Modal, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { RowTablePointerStyle } from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';
const UserProfile = React.lazy(() => import('../Components/UserProfile'));
const UsersReference = inject('GlobalStore')(
  observer((props) => {
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const [UsersTable, SetNewUsersTable] = useState([]);
    const [ShowModal, SetNewShowModal] = useState(false);
    const [Profile, SetNewProfile] = useState(null);
    const [Roles, SetNewRoles] = useState([]);
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
    const ProfileHandler = (Feeld, Value) => {
      let NewProfile = { ...Profile };
      NewProfile[Feeld] = Value;
      SetNewProfile(NewProfile);
    };
    const RequestProfile = (Id) => {
      let PromiseArray = [];
      PromiseArray.push(
        ApiFetch(`api/Users/${Id}`, 'GET', undefined, (Response) => {
          SetNewProfile(Response.Data);
        })
      );
      PromiseArray.push(
        ApiFetch(`api/Roles`, 'GET', undefined, (Response) => {
          SetNewRoles(
            Response.Data.map((Role) => {
              return { value: Role.Id, label: Role.Rolename };
            })
          );
        })
      );
      return Promise.all(PromiseArray);
    };
    useEffect(() => {
      RequestData();
    }, [props.GlobalStore.GetCurrentTab.GetCurrentMenuElementKey]);
    return (
      <>
        <Modal
          title="Профиль пользователя"
          width="450px"
          closable={false}
          maskClosable={false}
          okButtonProps={{ size: 'small' }}
          cancelButtonProps={{ size: 'small' }}
          okText="Сохранить"
          cancelText="Отмена"
          visible={ShowModal}
          onCancel={() => {
            SetNewShowModal(false);
          }}
        >
          <React.Suspense>
            <UserProfile
              Profile={Profile}
              Roles={Roles}
              ProfileHandler={ProfileHandler}
            />
          </React.Suspense>
        </Modal>
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
                RequestProfile(Record.Id).then(() => {
                  SetNewShowModal(true);
                });
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
