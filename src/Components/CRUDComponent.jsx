import { Button, Input, message, Modal, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { ApiFetch, TableSorter } from '../Helpers/Helpers';
import {
  RowInputStyle,
  RowStyle,
  RowTablePointerStyle,
} from '../Styles/TableStyles';
import { SearchOutlined } from '@ant-design/icons';
import TableButtonBar from './TableButtonBar';

const CRUDComponent = inject('GlobalStore')(
  observer((props) => {
    const [ObjectTable, SetNewObjectTable] = useState([]);
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const [SearchString, SetNewSearchString] = useState(null);
    const InputRef = React.createRef();
    const SearchRef = React.createRef();
    const RequestData = () => {
      ApiFetch(
        `api/${props.GlobalStore.GetCurrentTab.GetCurrentMenuElementKey}`,
        'GET',
        undefined,
        (Response) => {
          SetNewObjectTable(
            Response.Data.map((Object) => {
              Object.Key = nanoid();
              Object.Edited = false;
              return Object;
            })
          );
        }
      );
    };
    const DeleteObject = () => {
      let DeleteIndex = ObjectTable.findIndex((Object) => {
        return Object.Key == SelectedKey;
      });

      if ('Id' in ObjectTable[DeleteIndex]) {
        ApiFetch(
          `api/${props.GlobalStore.GetCurrentTab.GetCurrentMenuElementKey}/${ObjectTable[DeleteIndex].Id}`,
          'DELETE',
          undefined,
          (Response) => {
            RequestData();
          }
        );
      } else {
        let NewObjectTable = [...ObjectTable];
        NewObjectTable.splice(DeleteIndex, 1);
        SetNewObjectTable(NewObjectTable);
      }
      SetNewSelectedKey(null);
    };
    const ShowDeleteModal = () => {
      if (SelectedKey != null) {
        Modal.confirm({
          title: 'Подтвердите действие',
          content: 'Вы действительно хотите удалить объект?',
          okButtonProps: { type: 'primary', danger: true, size: 'small' },
          cancelButtonProps: { size: 'small' },
          okText: 'Удалить',
          cancelText: 'Отмена',
          onOk: () => {
            DeleteObject();
          },
        });
      }
    };
    const SaveObject = (Key) => {
      if (
        InputRef.current.input.value.length == 0 ||
        ObjectTable.some((Object) => {
          return Object.Caption == InputRef.current.input.value;
        })
      ) {
        message.warning('Выберете другое наименование');
      } else {
        let SavedObject = ObjectTable.find((Object) => {
          return Object.Key == Key;
        });
        SavedObject.Caption = InputRef.current.input.value;
        ApiFetch(
          `api/${props.GlobalStore.GetCurrentTab.GetCurrentMenuElementKey}${
            'Id' in SavedObject ? `/${SavedObject.Id}` : ''
          }`,
          `${'Id' in SavedObject ? 'PATCH' : 'POST'}`,
          SavedObject,
          (Response) => {
            RequestData();
          }
        );
      }
    };
    const AddObject = () => {
      if (
        ObjectTable.some((Object) => {
          return Object.Edited;
        })
      ) {
        message.warning('Завершите редактирование объекта');
      } else {
        let NewObjectsTable = [...ObjectTable];
        NewObjectsTable.unshift({ Caption: '', Edited: true, Key: nanoid() });
        SetNewObjectTable(NewObjectsTable);
      }
    };
    const CancelEdit = (Key) => {
      let NewObjectsTable = [...ObjectTable];
      let ObjectIndex = NewObjectsTable.findIndex((Object) => {
        return Object.Key == Key;
      });
      if ('Id' in NewObjectsTable[ObjectIndex]) {
        NewObjectsTable[ObjectIndex].Edited = false;
      } else {
        NewObjectsTable.splice(ObjectIndex, 1);
        SetNewSelectedKey(null);
      }
      SetNewObjectTable(NewObjectsTable);
    };
    const EditObject = (Key) => {
      if (
        ObjectTable.some((Object) => {
          return Object.Edited;
        })
      ) {
        message.warning('Завершите редактирование объекта');
      } else {
        let NewObjectTable = [...ObjectTable];
        let ObjectIndex = NewObjectTable.findIndex((Object) => {
          return Object.Key == Key;
        });
        NewObjectTable[ObjectIndex].Edited = true;
        SetNewObjectTable(NewObjectTable);
      }
    };
    const ClearSearch = (Event) => {
      if (Event.key == 'Escape') {
        SetNewSearchString(null);
      }
    };
    const EventListener = () => {
      document.addEventListener('keydown', ClearSearch, false);
      return document.removeEventListener('keydown', ClearSearch, false);
    };
    useEffect(() => {
      EventListener();
      RequestData();
    }, [props.GlobalStore.GetCurrentTab.GetCurrentMenuElementKey]);
    return (
      <>
        <TableButtonBar
          OnAdd={() => {
            AddObject();
          }}
          OnDelete={() => {
            ShowDeleteModal();
          }}
        />
        <Table
          scroll={{ y: 700 }}
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
              onDoubleClick: () => {
                EditObject(Record.Key);
              },
            };
          }}
          pagination={false}
          dataSource={ObjectTable}
          rowKey="Key"
          size="small"
          columns={[
            {
              defaultSortOrder: 'ascend',
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
              title: 'Наименование',
              dataIndex: 'Caption',
              key: 'Caption',
              filterIcon: <SearchOutlined />,
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
              render: (Value, Record, Index) =>
                Record.Edited ? (
                  <RowStyle width="350px" justifyContent="space-between">
                    <RowInputStyle>
                      <Input size="small" defaultValue={Value} ref={InputRef} />
                    </RowInputStyle>
                    <RowStyle width="160px" justifyContent="space-between">
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                          SaveObject(Record.Key);
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
                  </RowStyle>
                ) : (
                  <RowTablePointerStyle>{Value}</RowTablePointerStyle>
                ),
            },
          ]}
        />
      </>
    );
  })
);

export default CRUDComponent;
