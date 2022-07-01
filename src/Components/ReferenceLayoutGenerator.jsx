import { Table, Input, Button, Modal, message } from 'antd';
import { inject, observer } from 'mobx-react';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { SearchOutlined } from '@ant-design/icons';
import {
  RowButtonsWrapperStyle,
  RowInputStyle,
  RowStyle,
  RowTablePointerStyle,
} from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';

const ReferenceLayoutGenerator = inject('GlobalStore')(
  observer((props) => {
    const [ObjectTablesMap, SetNewObjectTablesMap] = useState(new Map());
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const [Scheme, SetNewScheme] = useState([]);
    const [SearchString, SetNewSearchString] = useState(null);
    const EditObject = (Index, ContainerId) => {
      if (
        ObjectTablesMap.get(ContainerId).some((Object) => {
          return Object.Edited;
        })
      ) {
        message.warning('Сначала завершите редактирование объекта');
      } else {
        let NewObjectTableMap = new Map(ObjectTablesMap);
        NewObjectTableMap.get(ContainerId)[Index].Edited = true;
        SetNewObjectTablesMap(NewObjectTableMap);
      }
    };
    const DeleteObject = (Key) => {
      let NewObjectTable = [...ObjectTable];
      let ObjectIndex = NewObjectTable.findIndex((Object) => {
        return Object.Key == Key;
      });
      if ('Id' in NewObjectTable[ObjectIndex]) {
        ApiFetch(
          `api/${props.GlobalStore.GetCurrentTab.CurrentMenuElementKey}/${NewObjectTable[ObjectIndex].Id}`,
          'DELETE',
          undefined,
          (Response) => {
            NewObjectTable.splice(ObjectIndex, 1);
            SetNewObjectTable(NewObjectTable);
            SetNewSelectedKey(null);
          }
        );
      } else {
        NewObjectTable.splice(ObjectIndex, 1);
        SetNewObjectTable(NewObjectTable);
        SetNewSelectedKey(null);
      }
    };
    const SaveObject = (Index, Value) => {
      let NewObjectTable = [...ObjectTable];
      NewObjectTable[Index].Caption = Value;
      NewObjectTable[Index].Edited = false;
      ApiFetch(
        `api/${props.GlobalStore.GetCurrentTab.CurrentMenuElementKey}${
          'Id' in NewObjectTable[Index] ? `/${NewObjectTable[Index].Id}` : ''
        }`,
        `${'Id' in NewObjectTable[Index] ? 'PATCH' : 'POST'}`,
        NewObjectTable[Index],
        (Response) => {
          let NewObject = Response.Data;
          NewObject.Key = nanoid();
          NewObject.Edited = false;
          NewObjectTable[Index] = NewObject;
          SetNewObjectTable(NewObjectTable);
        }
      );
    };
    const ShowDeleteModal = (Key) => {
      if (Key != null && ObjectTable.length > 0) {
        Modal.confirm({
          icon: null,
          title: 'Подтвердите действие',
          content: 'Вы действительно хотите удалить объект?',
          okText: 'Удалить',
          okButtonProps: { size: 'small', type: 'primary', danger: true },
          cancelText: 'Отмена',
          cancelButtonProps: {
            size: 'small',
          },
          onOk: () => {
            DeleteObject(Key);
          },
        });
      }
    };
    const CancelEditObject = (Index) => {
      let NewObjectTable = [...ObjectTable];
      if (!('Id' in NewObjectTable[Index])) {
        NewObjectTable.splice(Index, 1);
        if (NewObjectTable.length == 0) {
          SetNewSelectedKey(null);
        }
      } else {
        NewObjectTable[Index].Edited = false;
      }

      SetNewObjectTable(NewObjectTable);
    };
    const AddObject = (SchemeObject) => {
      if (
        ObjectTable.some((Object) => {
          return Object.Edited;
        })
      ) {
        message.warning('Сначала завершите редактирование объекта');
      } else {
        let ObjectPrototype = {
          ...SchemeObject.TableButtonBar.ObjectPrototype,
        };
        ObjectPrototype.Key = nanoid();
        let NewObjectTable = [...ObjectTable];
        NewObjectTable.unshift(ObjectPrototype);
        SetNewObjectTable(NewObjectTable);
      }
    };
    const ClearSearch = (Event) => {
      if (Event.key === 'Escape') {
        SetNewSearchString(null);
      }
    };
    const GenerateLayout = (Scheme) => {
      return Scheme.map((SchemeObject, ObjectIndex) => {
        switch (SchemeObject.Type) {
          case 'Table':
            SchemeObject.Columns.map((Column) => {
              if (Column.edited) {
                Column.InputRef = React.createRef();
                Column.onCell = (Record, Index) => {
                  return {
                    onDoubleClick: (Event) => {
                      EditObject(Index, SchemeObject.Id);
                    },
                  };
                };
                Column.onFilter = (Value, Record) => {
                  if (SearchString != null) {
                    return Record[Value].toString()
                      .toLowerCase()
                      .includes(SearchString);
                  } else {
                    return true;
                  }
                };
              }
              if (Column.search) {
                Column.filterIcon = <SearchOutlined />;
                Column.filteredValue = [Column.key];
                Column.filterDropdown = (
                  <Input
                    size="small"
                    placeholder="Поиск"
                    onPressEnter={(Event) => {
                      SetNewSearchString(Event.target.value);
                    }}
                  />
                );
              }
              if (Column.validate) {
                Column.IsValid = () => {
                  return new RegExp(Column.validate).test(
                    Column.InputRef.current.input.value
                  );
                };
              } else {
                Column.IsValid = () => {
                  return true;
                };
              }
              if (Column.unique) {
                Column.IsUnique = () => {
                  return ObjectTable.every((Object) => {
                    return (
                      Object.Caption != Column.InputRef.current.input.value
                    );
                  });
                };
              } else {
                Column.IsUnique = () => {
                  return true;
                };
              }
              Column.render = (Value, Record, Index) => {
                return Record.Edited ? (
                  <RowStyle>
                    <RowInputStyle>
                      <Input
                        size="small"
                        defaultValue={Value}
                        ref={Column.InputRef}
                      />
                    </RowInputStyle>
                    <RowButtonsWrapperStyle>
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                          if (Column.IsValid()) {
                            if (Column.IsUnique()) {
                              SaveObject(
                                Index,
                                Column.InputRef.current.input.value
                              );
                            } else {
                              message.warning('Повторяющееся значение');
                            }
                          } else {
                            message.warning('Неверное значение');
                          }
                        }}
                      >
                        Сохранить
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          CancelEditObject(Index);
                        }}
                      >
                        Отмена
                      </Button>
                    </RowButtonsWrapperStyle>
                  </RowStyle>
                ) : (
                  <RowTablePointerStyle>{Value}</RowTablePointerStyle>
                );
              };

              return Column;
            });
            return (
              <div key={SchemeObject.Id}>
                {'TableButtonBar' in SchemeObject ? (
                  <TableButtonBar
                    OnAdd={() => {
                      AddObject(SchemeObject);
                    }}
                    OnDelete={() => {
                      ShowDeleteModal(SelectedKey);
                    }}
                  />
                ) : null}
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
                  onRow={(Record) => {
                    return {
                      onClick: () => {
                        SetNewSelectedKey(Record.Key);
                      },
                    };
                  }}
                  pagination={false}
                  rowKey="Key"
                  dataSource={ObjectTablesMap.get(SchemeObject.Id)}
                  size="small"
                  columns={SchemeObject.Columns}
                />
              </div>
            );
        }
      });
    };
    const RequestData = () => {
      return ApiFetch(
        `api/${props.GlobalStore.GetCurrentTab.CurrentMenuElementKey}`,
        'GET',
        undefined,
        (Response) => {
          Response.Data.forEach((Container) => {
            switch (Container.Type) {
              case 'Table':
                let NewObjectTablesMap = new Map();
                NewObjectTablesMap.set(
                  Container.Id,
                  Container.Container.map((Object) => {
                    Object.Key = nanoid();
                    Object.Edited = false;
                    return Object;
                  })
                );
                SetNewObjectTablesMap(NewObjectTablesMap);
                break;
            }
          });
        }
      );
    };
    const RequestScheme = () => {
      ApiFetch(
        `api/Schemes/${props.GlobalStore.GetCurrentTab.GetCurrentSchemeId}`,
        'GET',
        undefined,
        (Response) => {
          SetNewScheme(Response.Data.Scheme.Items);
        }
      );
    };
    const AddEventListeners = () => {
      document.addEventListener('keydown', ClearSearch, false);
      return () => {
        document.removeEventListener('keydown', ClearSearch, false);
      };
    };
    useEffect(() => {
      AddEventListeners();
      RequestData();
      RequestScheme();
    }, [props.GlobalStore.GetCurrentTab.CurrentMenuElementKey]);

    return GenerateLayout(Scheme);
  })
);
export default ReferenceLayoutGenerator;
