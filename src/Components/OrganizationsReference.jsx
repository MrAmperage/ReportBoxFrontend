import { SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Input, Table } from 'antd';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import {
  RowInputStyle,
  RowStyle,
  RowTablePointerStyle,
} from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';

export default function Organizations() {
  const [OrganizationsTable, SetNewOrganizationsTable] = useState([]);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
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
      SetNewOrganizationsTable(
        Response.Data.map((Organization) => {
          Organization.CaptionEdit = false;
          Organization.InternalEdit = false;
          Organization.Key = nanoid();
          return Organization;
        })
      );
    });
  };
  const OrganizationHandler = (Index, FeeldArrays) => {
    let NewOrganizationsTable = [...OrganizationsTable];
    FeeldArrays.forEach((FeeldArray) => {
      NewOrganizationsTable[Index][FeeldArray[0]] = FeeldArray[1];
    });

    SetNewOrganizationsTable(NewOrganizationsTable);
  };
  useEffect(() => {
    RequestData();
    EventListener();
  }, []);
  return (
    <>
      <TableButtonBar />
      <Table
        scroll={{ y: 700 }}
        pagination={false}
        rowKey="Key"
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
            onCell: (Record, Index) => {
              return {
                onDoubleClick: () => {
                  OrganizationHandler(Index, [['CaptionEdit', true]]);
                },
              };
            },
            render: (Value, Record, Index) => {
              return Record.CaptionEdit ? (
                <RowInputStyle>
                  <Input size="small" value={Value} />
                </RowInputStyle>
              ) : (
                <RowTablePointerStyle>{Value}</RowTablePointerStyle>
              );
            },
          },
          {
            title: 'Внутренняя',
            dataIndex: 'Internal',
            key: 'Internal',
            render: (Value, Record, Index) => {
              return (
                <RowStyle width="250px" justifyContent="space-between">
                  <RowInputStyle>
                    <Checkbox
                      checked={Value}
                      onChange={(Event) => {
                        OrganizationHandler(Index, [
                          ['Internal', Event.target.checked],
                          ['InternalEdit', true],
                        ]);
                      }}
                    />
                  </RowInputStyle>
                  {Record.InternalEdit || Record.CaptionEdit ? (
                    <RowStyle width="350px" justifyContent="space-between">
                      <Button size="small" type="primary" onClick={() => {}}>
                        Сохранить
                      </Button>
                      <Button
                        size="small"
                        onClick={(Event) => {
                          Event.stopPropagation();
                        }}
                      >
                        Отмена
                      </Button>
                    </RowStyle>
                  ) : null}
                </RowStyle>
              );
            },
          },
        ]}
      />
    </>
  );
}
