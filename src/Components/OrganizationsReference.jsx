import { SearchOutlined } from '@ant-design/icons';
import { Input, Modal, Table } from 'antd';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { RowTablePointerStyle } from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';
const OrganizationProfile = React.lazy(() =>
  import('../Components/OrganizattionProfile')
);
export default function Organizations() {
  const [OrganizationsTable, SetNewOrganizationsTable] = useState([]);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [ShowModal, SetNewShowModal] = useState(false);
  const [Profile, SetNewProfile] = useState(null);
  const [SearchString, SetNewSearchString] = useState(null);
  const SearchRef = React.createRef();
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
  const RequestData = () => {
    ApiFetch('api/Organizations', 'GET', undefined, (Response) => {
      SetNewOrganizationsTable(Response.Data);
    });
  };
  const RequestProfile = () => {
    return ApiFetch(
      `api/Organizations/${SelectedKey}`,
      'GET',
      undefined,
      (Response) => {
        Response.Data.Areas.map((Area) => {
          Area.Edited = false;
          Area.Key = nanoid();
          return Area;
        });
        SetNewProfile(Response.Data);
      }
    );
  };
  const AreasHandler = (Action, Index, Value) => {
    let NewProfile = { ...Profile };
    switch (Action) {
      case 'Edit':
        NewProfile.Areas[Index].Edited = Value;
        break;
    }
    SetNewProfile(NewProfile);
  };
  const ProfileHandler = (Feeld, Value) => {
    let NewProfile = { ...Profile };
    NewProfile[Feeld] = Value;
    SetNewProfile(NewProfile);
  };
  useEffect(() => {
    RequestData();
    EventListener();
  }, []);
  return (
    <>
      <Modal
        destroyOnClose={true}
        title="Профиль организации"
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
          <OrganizationProfile
            Profile={Profile}
            ProfileHandler={ProfileHandler}
            AreasHandler={AreasHandler}
          />
        </React.Suspense>
      </Modal>
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
            onDoubleClick: () => {
              RequestProfile().then(() => {
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
