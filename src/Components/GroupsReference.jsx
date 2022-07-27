import { SearchOutlined } from '@ant-design/icons';
import { Input, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { ApiFetch, TableSorter } from '../Helpers/Helpers';
import { RowTablePointerStyle } from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';
const GroupProfile = React.lazy(() => import('./GroupProfile'));
export default function GroupsReference() {
  const [GroupsTable, SetNewGroupsTable] = useState([]);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [Profile, SetNewProfile] = useState(null);
  const [ShowModal, SetNewShowModal] = useState(false);
  const [SearchString, SetNewSearchString] = useState(null);
  const SearchRef = React.createRef();
  const RequestProfile = (Id) => {
    return ApiFetch(`api/Groups/${Id}`, 'GET', undefined, (Response) => {
      SetNewProfile(Response.Data);
    });
  };
  const EventListener = () => {
    document.addEventListener('keydown', ClearSearch, false);
    return () => {
      document.removeEventListener('keydown', ClearSearch, false);
    };
  };
  const ClearSearch = (Event) => {
    if (Event.key == 'Escape') {
      SetNewSearchString(null);
    }
  };
  const AddGroup = () => {
    SetNewProfile({
      Caption: '',
      ShouldersRound: 'Math',
      ShouldersPrecision: 1,
    });
    SetNewShowModal(true);
  };
  const ProfileHandler = (Feeld, Value) => {
    let NewProfile = { ...Profile };
    NewProfile[Feeld] = Value;
    SetNewProfile(NewProfile);
  };
  const RequestData = () => {
    return ApiFetch('api/Groups', 'GET', undefined, (Response) => {
      SetNewGroupsTable(Response.Data);
    });
  };
  const ShowDeleteModal = () => {
    if (SelectedKey != null) {
      Modal.confirm({
        title: 'Подтвердите действие',
        content: 'Вы действительно хотите удалить объект?',
        okButtonProps: { size: 'small', danger: true },
        cancelButtonProps: { size: 'small' },
        okText: 'Удалить',
        cancelText: 'Отмена',
        onOk: () => {
          DeleteGroup().then(() => {
            RequestData();
          });
        },
      });
    }
  };
  const DeleteGroup = () => {
    return ApiFetch(
      `api/Groups/${SelectedKey}`,
      'DELETE',
      undefined,
      (Response) => {}
    );
  };
  const SaveProfile = () => {
    return ApiFetch(
      `api/Groups${'Id' in Profile ? `/${Profile.Id}` : ''}`,
      `${'Id' in Profile ? 'PATCH' : 'POST'}`,
      Profile,
      (Response) => {}
    );
  };
  useEffect(() => {
    RequestData();
    EventListener();
  }, []);
  return (
    <>
      <Modal
        title="Профиль группы"
        onCancel={() => {
          SetNewShowModal(false);
        }}
        onOk={() => {
          SaveProfile().then(() => {
            RequestData().then(() => {
              SetNewShowModal(false);
            });
          });
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
          <GroupProfile Profile={Profile} ProfileHandler={ProfileHandler} />
        </React.Suspense>
      </Modal>
      <TableButtonBar
        OnDelete={() => {
          ShowDeleteModal();
        }}
        OnAdd={() => {
          AddGroup();
        }}
      />
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
            sorter: TableSorter('Caption'),
            onFilter: (Value, Record) => {
              if (SearchString != null) {
                return Record[Value].toString()
                  .toLowerCase()
                  .includes(SearchString);
              } else {
                return true;
              }
            },
            filteredValue: ['Caption'],
            filterIcon: <SearchOutlined />,
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
            sortOrder: 'ascend',
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
