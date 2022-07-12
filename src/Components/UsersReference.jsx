import { message, Modal, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import Moment from 'moment';
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
      return ApiFetch(
        `api/${props.GlobalStore.GetCurrentTab.GetCurrentMenuElementKey}`,
        'GET',
        undefined,
        (Response) => {
          SetNewUsersTable(Response.Data);
        }
      );
    };
    const SaveProfile = () => {
      if (Profile.Password.length > 0 && Profile.Username.length > 0) {
        ApiFetch(
          `api/Users${'Id' in Profile ? `/${Profile.Id}` : ''}`,
          `${'Id' in Profile ? 'PATCH' : 'POST'}`,
          Profile,
          (Response) => {
            RequestData().then(() => {
              SetNewShowModal(false);
            });
          }
        );
      } else {
        message.warning('Укажите имя пользователя и пароль');
      }
    };
    const AddUser = () => {
      ApiFetch(`api/Roles`, 'GET', undefined, (Response) => {
        SetNewRoles(
          Response.Data.map((Role) => {
            return { value: Role.Id, label: Role.Rolename };
          })
        );
        SetNewProfile({
          Username: '',
          Password: '',
          NotHashedPassword: '',
          Enabled: false,
          RoleId: Response.Data.find((Role) => {
            return Role.Rolename == '-';
          }).Id,
          StartDate: Moment().format(),
          EndDate: Moment().format(),
        });
        SetNewShowModal(true);
      });
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
          Response.Data.NotHashedPassword = '';
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
          onOk={() => {
            SaveProfile();
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
        <TableButtonBar
          OnAdd={() => {
            AddUser();
          }}
          OnDelete={() => {}}
        />
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
