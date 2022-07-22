import { SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Input, message, Modal, Table } from 'antd';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { ApiFetch, TableSorter } from '../Helpers/Helpers';
import {
  RowInputStyle,
  RowStyle,
  RowTablePointerStyle,
} from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';

export default function OrganizationsReference() {
  const [OrganizationsTable, SetNewOrganizationsTable] = useState([]);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [SearchString, SetNewSearchString] = useState(null);
  const SearchRef = React.createRef();
  const InputRef = React.createRef();
  const ClearSearch = (Event) => {
    if (Event.key == 'Escape') {
      SetNewSearchString(null);
    }
  };
  const ShowDeleteModal = () => {
    if (SelectedKey != null) {
      Modal.confirm({
        title: 'Подтвердите действие',
        content: 'Вы действительно хотите удалить объект?',
        okButtonProps: {
          type: 'primary',
          size: 'small',
          danger: true,
        },
        okText: 'Удалить',
        cancelButtonProps: {
          size: 'small',
        },
        cancelText: 'Отмена',
        onOk: () => {
          DeleteOrganization().then(() => {
            RequestData();
          });
        },
      });
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
  const SaveOrganization = (Key) => {
    const Index = OrganizationsTable.findIndex((Organization) => {
      return Organization.Key == Key;
    });
    let NewOrganizationsTable = [...OrganizationsTable];
    if (OrganizationsTable[Index].CaptionEdit) {
      NewOrganizationsTable[Index].Caption = InputRef.current.input.value;
      ApiFetch(
        `api/Organizations${
          'Id' in NewOrganizationsTable[Index]
            ? `/${NewOrganizationsTable[Index].Id}`
            : ''
        }`,
        `${'Id' in NewOrganizationsTable[Index] ? 'PATCH' : 'POST'}`,
        NewOrganizationsTable[Index],
        (Response) => {
          RequestData();
        }
      );
    } else {
      ApiFetch(
        `api/Organizations${
          'Id' in NewOrganizationsTable[Index]
            ? `/${NewOrganizationsTable[Index].Id}`
            : ''
        }`,
        `${'Id' in NewOrganizationsTable[Index] ? 'PATCH' : 'POST'}`,
        NewOrganizationsTable[Index],
        (Response) => {
          RequestData();
        }
      );
    }
  };
  const DeleteOrganization = () => {
    const Index = OrganizationsTable.findIndex((Organization) => {
      return Organization.Key == SelectedKey;
    });
    if ('Id' in OrganizationsTable[Index]) {
      return ApiFetch(
        `api/Organizations/${OrganizationsTable[Index].Id}`,
        'DELETE',
        undefined,
        () => {
          SetNewSelectedKey(null);
        }
      );
    } else {
      let NewOrganizationTable = [...OrganizationsTable];
      NewOrganizationTable.splice(Index, 1);
      SetNewOrganizationsTable(NewOrganizationTable);
      SetNewSelectedKey(null);
      return Promise.resolve();
    }
  };
  const CancelEdit = (Key) => {
    let NewOrganizationsTable = [...OrganizationsTable];
    const Index = NewOrganizationsTable.findIndex((Organization) => {
      return Organization.Key == Key;
    });
    if ('Id' in NewOrganizationsTable[Index]) {
      ApiFetch(
        `api/Organizations/${NewOrganizationsTable[Index].Id}`,
        'GET',
        undefined,
        (Response) => {
          Response.Data.CaptionEdit = false;
          Response.Data.InternalEdit = false;
          Response.Data.Key = nanoid();
          NewOrganizationsTable[Index] = Response.Data;
          SetNewOrganizationsTable(NewOrganizationsTable);
        }
      );
    } else {
      NewOrganizationsTable.splice(Index, 1);
      SetNewOrganizationsTable(NewOrganizationsTable);
    }
  };
  const EditCaption = (Key) => {
    if (
      OrganizationsTable.some((Organization) => {
        return Organization.CaptionEdit;
      })
    ) {
      message.warning('Завершите редактирование объекта');
    } else {
      let NewOrganizationsTable = [...OrganizationsTable];
      let Index = NewOrganizationsTable.findIndex((Organization) => {
        return Organization.Key == Key;
      });
      NewOrganizationsTable[Index].CaptionEdit = true;
      SetNewOrganizationsTable(NewOrganizationsTable);
    }
  };
  const EditInternal = (Key, Value) => {
    if (
      OrganizationsTable.some((Organization) => {
        if (Organization.Key == Key) {
          return false;
        } else {
          return Organization.InternalEdit || Organization.CaptionEdit;
        }
      })
    ) {
      message.warning('Завершите редактирование объекта');
    } else {
      let NewOrganizationsTable = [...OrganizationsTable];
      let Index = NewOrganizationsTable.findIndex((Organization) => {
        return Organization.Key == Key;
      });
      NewOrganizationsTable[Index].Internal = Value;
      NewOrganizationsTable[Index].InternalEdit = true;
      SetNewOrganizationsTable(NewOrganizationsTable);
    }
  };

  const AddOrganization = () => {
    if (
      OrganizationsTable.some((Organization) => {
        return Organization.InternalEdit || Organization.CaptionEdit;
      })
    ) {
      message.warning('Завершите редактирование объекта');
    } else {
      let NewOrganizationsTable = [...OrganizationsTable];
      NewOrganizationsTable.unshift({
        Caption: '',
        CaptionEdit: true,
        InternalEdit: true,
        Key: nanoid(),
      });
      SetNewOrganizationsTable(NewOrganizationsTable);
    }
  };
  useEffect(() => {
    RequestData();
    EventListener();
  }, []);
  return (
    <>
      <TableButtonBar
        OnAdd={() => {
          AddOrganization();
        }}
        OnDelete={() => {
          ShowDeleteModal();
        }}
      />
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
        onRow={(Record, Index) => {
          return {
            onClick: () => {
              SetNewSelectedKey(Record.Key);
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
            defaultSortOrder: 'ascend',
            sorter: TableSorter('Caption'),
            onCell: (Record) => {
              return {
                onDoubleClick: () => {
                  EditCaption(Record.Key);
                },
              };
            },
            render: (Value, Record, Index) => {
              return Record.CaptionEdit ? (
                <RowInputStyle>
                  <Input size="small" defaultValue={Value} ref={InputRef} />
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
                <RowStyle width="200px" justifyContent="space-between">
                  <Checkbox
                    checked={Value}
                    onChange={(Event) => {
                      EditInternal(Record.Key, Event.target.checked);
                    }}
                  />

                  {Record.InternalEdit || Record.CaptionEdit ? (
                    <RowStyle width="160px" justifyContent="space-between">
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                          SaveOrganization(Record.Key);
                        }}
                      >
                        Сохранить
                      </Button>
                      <Button
                        size="small"
                        onClick={(Event) => {
                          Event.stopPropagation();
                          CancelEdit(Record.Key);
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
