import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import TableButtonBar from './TableButtonBar';
import { Input, Modal, Table } from 'antd';
import { ApiFetch, TableSorter } from '../Helpers/Helpers';
import { RowTablePointerStyle } from '../Styles/TableStyles';
import { SearchOutlined } from '@ant-design/icons';
import RoleProfile from '../Components/RoleProfile';

const RolesReference = inject('GlobalStore')(
  observer((props) => {
    const [RolesTable, SetNewRolesTable] = useState([]);
    const [Profile, SetNewProfile] = useState(null);
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const [SearchString, SetNewSearchString] = useState(null);
    const [ShowModal, SetNewShowModal] = useState(false);
    const [UserMenu, SetNewUserMenu] = useState([]);
    const SearchRef = React.createRef();
    const EventListener = () => {
      document.addEventListener('keydown', ClearSearch, false);
      return () => {
        document.removeEventListener('keydown', ClearSearch, false);
      };
    };
    const RequestData = () => {
      ApiFetch('api/Roles', 'GET', undefined, (Response) => {
        SetNewRolesTable(Response.Data);
      });
    };

    const RequestProfile = () => {
      let PromiseArray = [];
      PromiseArray.push(
        ApiFetch(`api/Roles/${SelectedKey}`, 'GET', undefined, (Response) => {
          SetNewProfile(Response.Data);
        })
      );
      PromiseArray.push(
        ApiFetch(
          'api/configuration/GetApplicationMenu',
          'GET',
          undefined,
          (Response) => {
            SetNewUserMenu(Response.Data);
          }
        )
      );
      return Promise.all(PromiseArray);
    };
    const ClearSearch = (Event) => {
      if (Event.key == 'Escape') {
        SetNewSearchString(null);
      }
    };
    const ProfileHandler = (Feeld, Value) => {
      let NewProfile = { ...Profile };
      NewProfile[Feeld] = Value;
      SetNewProfile(NewProfile);
    };
    useEffect(() => {
      RequestData();
      EventListener();
    }, [props.GlobalStore.GetCurrentTab.GetCurrentMenuElementKey]);
    return (
      <>
        <Modal
          title="Профиль роли"
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
          onOk={() => {}}
        >
          <RoleProfile
            Profile={Profile}
            UserMenu={UserMenu}
            ProfileHandler={ProfileHandler}
          />
        </Modal>
        <TableButtonBar />
        <Table
          scroll={{ y: 700 }}
          pagination={false}
          rowKey="Id"
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
              filteredValue: ['Rolename'],
              filterDropdown: () => (
                <Input
                  placeholder="Поиск"
                  size="small"
                  ref={SearchRef}
                  onPressEnter={(Event) => {
                    SetNewSearchString(SearchRef.current.input.value);
                  }}
                />
              ),
              defaultSortOrder: 'ascend',
              sorter: TableSorter('Rolename'),
              filterIcon: <SearchOutlined />,
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
              onDoubleClick: () => {
                RequestProfile().then(() => {
                  SetNewShowModal(true);
                });
              },
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
