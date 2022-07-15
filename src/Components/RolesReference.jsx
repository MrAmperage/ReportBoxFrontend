import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import TableButtonBar from './TableButtonBar';
import { Input, Table } from 'antd';
import { ApiFetch, TableSorter } from '../Helpers/Helpers';
import { RowTablePointerStyle } from '../Styles/TableStyles';
import { SearchOutlined } from '@ant-design/icons';

const RolesReference = inject('GlobalStore')(
  observer((props) => {
    const [RolesTable, SetNewRolesTable] = useState([]);
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const [SearchString, SetNewSearchString] = useState(null);
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
    const ClearSearch = (Event) => {
      if (Event.key == 'Escape') {
        SetNewSearchString(null);
      }
    };
    useEffect(() => {
      RequestData();
      EventListener();
    }, [props.GlobalStore.GetCurrentTab.GetCurrentMenuElementKey]);
    return (
      <>
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
              onDoubleClick: () => {},
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
