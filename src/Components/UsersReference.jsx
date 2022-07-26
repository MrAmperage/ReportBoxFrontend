import { SearchOutlined } from '@ant-design/icons';
import { Input, message, Modal, Table } from 'antd';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ApiFetch, TableSorter } from '../Helpers/Helpers';
import { RowTablePointerStyle } from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';
const UserProfile = React.lazy(() => import('./UserProfile'));
export default function UsersReference(props) {
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [UsersTable, SetNewUsersTable] = useState([]);
  const [ShowModal, SetNewShowModal] = useState(false);
  const [Profile, SetNewProfile] = useState(null);
  const [Roles, SetNewRoles] = useState([]);
  const [SearchString, SetNewSearchString] = useState(null);
  const SearchRef = React.createRef();
  const RequestData = () => {
    return ApiFetch(`api/Users`, 'GET', undefined, (Response) => {
      SetNewUsersTable(Response.Data);
    });
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
  const ShowDeleteModal = () => {
    if (SelectedKey != null) {
      Modal.confirm({
        title: 'Подтвердите действие',
        content: 'Вы действительно хотите удалить объект?',
        okButtonProps: { size: 'small', type: 'primary', danger: true },
        okText: 'Удалить',
        okCancel: 'Отмена',
        cancelButtonProps: {
          size: 'small',
        },
        onOk: () => {
          DeleteUser();
        },
      });
    }
  };
  const DeleteUser = () => {
    ApiFetch(`api/Users/${SelectedKey}`, 'DELETE', undefined, (Response) => {
      SetNewSelectedKey(null);
      RequestData();
    });
  };
  const ProfileHandler = (Feeld, Value) => {
    let NewProfile = { ...Profile };
    NewProfile[Feeld] = Value;
    SetNewProfile(NewProfile);
  };
  const ClearSearch = (Event) => {
    if (Event.key == 'Escape') {
      SetNewSearchString(null);
    }
  };

  const EventListener = () => {
    document.addEventListener('keydown', ClearSearch, false);
    return () => {
      document.removeEventListener('keydown', ClearSearch, false);
    };
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
    EventListener();
  }, []);
  return (
    <>
      <Modal
        title="Профиль пользователя"
        width="450px"
        destroyOnClose={true}
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
        OnDelete={() => {
          ShowDeleteModal();
        }}
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
            onFilter: (Value, Record) => {
              if (SearchString != null) {
                return Record[Value].toString()
                  .toLowerCase()
                  .includes(SearchString);
              } else {
                return true;
              }
            },
            filteredValue: ['Username'],
            filterDropdown: () => (
              <Input
                placeholder="Поиск"
                size="small"
                ref={SearchRef}
                onPressEnter={(Event) => {
                  SetNewSearchString(
                    SearchRef.current.input.value.toLowerCase()
                  );
                }}
              />
            ),
            filterIcon: <SearchOutlined />,
            defaultSortOrder: 'ascend',
            sorter: TableSorter('Username'),
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
}
