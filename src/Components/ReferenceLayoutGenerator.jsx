import { Table, Input, Button, Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import {
  RowButtonsWrapperStyle,
  RowInputStyle,
  RowStyle,
  RowTablePointerStyle,
} from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';

const ReferenceLayoutGenerator = inject('GlobalStore')(
  observer((props) => {
    const [ObjectTable, SetNewObjectTable] = useState([]);
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const [Scheme, SetNewScheme] = useState([]);
    const EditObject = (Index) => {
      let NewObjectTable = [...ObjectTable];
      NewObjectTable[Index].Edited = true;
      SetNewObjectTable(NewObjectTable);
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
            RequestData();
            SetNewSelectedKey(null);
          }
        );
      } else {
        NewObjectTable.splice(ObjectIndex, 1);
        SetNewObjectTable(NewObjectTable);
        SetNewSelectedKey(null);
      }
    };
    const SaveObject = () => {};
    const ShowDeleteModal = (Key) => {
      if (Key != null && ObjectTable.length > 0) {
        Modal.confirm({
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
      let ObjectPrototype = {
        ...SchemeObject.TableButtonBar.ObjectPrototype,
      };
      ObjectPrototype.Key = nanoid();
      let NewObjectTable = [...ObjectTable];
      NewObjectTable.unshift(ObjectPrototype);
      SetNewObjectTable(NewObjectTable);
    };
    const GenerateLayout = (Scheme, ParrentId) => {
      return Scheme.map((SchemeObject, ObjectIndex) => {
        switch (SchemeObject.Type) {
          case 'Table':
            SchemeObject.Columns.map((Column) => {
              Column.render = (Value, Record, Index) => {
                return Record.Edited ? (
                  <RowStyle>
                    <RowInputStyle>
                      <Input size="small" defaultValue={Value} />
                    </RowInputStyle>
                    <RowButtonsWrapperStyle>
                      <Button size="small" type="primary">
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
              Column.onCell = (Record, Index) => {
                return {
                  onDoubleClick: (event) => {
                    if (Column.edited) {
                      EditObject(Index);
                    }
                  },
                };
              };
              return Column;
            });
            return (
              <div
                key={
                  ParrentId != null
                    ? `${ParrentId}Children${ObjectIndex}`
                    : `Parrent${ObjectIndex}`
                }
              >
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
                  dataSource={ObjectTable}
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
    const RequestScheme = () => {
      ApiFetch(
        `api/schemes/${props.GlobalStore.GetCurrentTab.GetCurrentSchemeId}`,
        'GET',
        undefined,
        (Response) => {
          SetNewScheme(Response.Data.Scheme.Items);
        }
      );
    };
    useEffect(() => {
      RequestData();
      RequestScheme();
    }, []);

    return GenerateLayout(Scheme, null);
  })
);
export default ReferenceLayoutGenerator;
