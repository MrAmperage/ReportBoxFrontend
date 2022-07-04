import { Table, Input, Button, Modal, message } from 'antd';
import { inject, observer } from 'mobx-react';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { SearchOutlined } from '@ant-design/icons';
import TableButtonBar from './TableButtonBar';
import { ColumnTableSetRender } from '../ReferenceGenerator/Table';

const ReferenceLayoutGenerator = inject('GlobalStore')(
  observer((props) => {
    const [ObjectTablesMap, SetNewObjectTablesMap] = useState(new Map());
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const [Scheme, SetNewScheme] = useState([]);
    const [SearchString, SetNewSearchString] = useState(null);
    const EditObject = (Index, ContainerId, Feeld) => {
      if (
        ObjectTablesMap.get(ContainerId).some((Object) => {
          return Object[Feeld].Edited;
        })
      ) {
        message.warning('Сначала завершите редактирование объекта');
      } else {
        let NewObjectTableMap = new Map(ObjectTablesMap);
        NewObjectTableMap.get(ContainerId)[Index][`${Feeld}Edited`] = true;
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

    const AddObject = (SchemeObject) => {
      let ObjectPrototype = {
        ...SchemeObject.TableButtonBar.ObjectPrototype,
      };
      Object.keys(ObjectPrototype).forEach((Feeld) => {
        let CurrentScheme = Scheme.find((Container) => {
          return Container.Id == SchemeObject.Id;
        });
        CurrentScheme.Columns.forEach((Column) => {
          if (Feeld == Column.key) {
            if (Column.edited) {
              ObjectPrototype[`${Column.key}Edited`] = true;
              ObjectPrototype[`${Column.key}Ref`] = React.createRef();
            }
          }
        });
      });

      ObjectPrototype.Key = nanoid();
      console.log(ObjectPrototype);
      let Table = [...ObjectTablesMap.get(SchemeObject.Id)];
      Table.unshift(ObjectPrototype);
      SetNewObjectTablesMap(
        new Map(ObjectTablesMap.set(SchemeObject.Id, Table))
      );
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
              Column.render = ColumnTableSetRender(
                Column,
                ObjectTablesMap,
                SetNewObjectTablesMap,
                SchemeObject,
                props.GlobalStore.GetCurrentTab.CurrentMenuElementKey
              );
              if (Column.edited) {
                Column.onCell = (Record, Index) => {
                  return {
                    onDoubleClick: (Event) => {
                      EditObject(Index, SchemeObject.Id, Column.dataIndex);
                    },
                  };
                };
              }
              if (Column.search) {
                Column.filteredValue = [Column.dataIndex];
                Column.onFilter = (Value, Record) => {
                  if (SearchString != null) {
                    return Record[Column.dataIndex]
                      .toString()
                      .toLowerCase()
                      .includes(SearchString);
                  } else {
                    return true;
                  }
                };
                Column.filterIcon = <SearchOutlined />;
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
                  return true;
                };
              }
              if (Column.unique) {
                Column.IsUnique = () => {
                  return true;
                };
              }

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
    const RequestData = (Scheme) => {
      ApiFetch(
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
                  Container.Container.map((TableRow) => {
                    let CurrentTableScheme = Scheme.find((SchemeObject) => {
                      return SchemeObject.Id == Container.Id;
                    });
                    Object.keys(TableRow).forEach((Feeld) => {
                      CurrentTableScheme.Columns.forEach((Column) => {
                        if (Feeld == Column.key) {
                          if (Column.edited) {
                            TableRow[`${Column.key}Edited`] = false;
                            TableRow[`${Column.key}Ref`] = React.createRef();
                          }
                        }
                      });
                    });
                    TableRow.Key = nanoid();
                    console.log(TableRow);
                    return TableRow;
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
          RequestData(Response.Data.Scheme.Items);
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
      RequestScheme();
    }, [props.GlobalStore.GetCurrentTab.CurrentMenuElementKey]);

    return GenerateLayout(Scheme);
  })
);
export default ReferenceLayoutGenerator;
