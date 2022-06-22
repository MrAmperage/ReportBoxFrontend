import { Table, Input, Button } from 'antd';
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
    const EditObject = (Key) => {
      let NewObjectTable = [...ObjectTable];
      let ObjectIndex = NewObjectTable.findIndex((Object) => {
        return Object.Key == Key;
      });
      NewObjectTable[ObjectIndex].Edited = true;
      SetNewObjectTable(NewObjectTable);
    };
    const CancelEditObject = (Key) => {
      let NewObjectTable = [...ObjectTable];
      let ObjectIndex = NewObjectTable.findIndex((Object) => {
        return Object.Key == Key;
      });
      if (!('Id' in NewObjectTable[ObjectIndex])) {
        NewObjectTable.splice(ObjectIndex, 1);
      } else {
        NewObjectTable[ObjectIndex].Edited = false;
      }

      SetNewObjectTable(NewObjectTable);
    };
    const AddObject = (ObjectPrototype) => {
      let NewObjectTable = [...ObjectTable];
      NewObjectTable.unshift(ObjectPrototype);
      SetNewObjectTable(NewObjectTable);
    };
    const GenerateLayout = (Scheme) => {
      if ('Reference' in Scheme) {
        return GenerateLayout(Scheme.Reference);
      }
      if ('Profile' in Scheme) {
        return GenerateLayout(Scheme.Profile);
      }

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
                          CancelEditObject(Record.Key);
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
              Column.onCell = (Record) => {
                return {
                  onDoubleClick: (event) => {
                    if (Column.edited) {
                      EditObject(Record.Key);
                    }
                  },
                };
              };
              return Column;
            });
            return (
              <div key={SchemeObject.Id}>
                {'TableButtonBar' in SchemeObject ? (
                  <TableButtonBar
                    OnAdd={() => {
                      let NewObject = {
                        ...SchemeObject.TableButtonBar.ObjectPrototype,
                      };
                      NewObject.Key = nanoid();
                      AddObject(NewObject);
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
      ApiFetch(
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
    useEffect(RequestData, []);
    return GenerateLayout(props.GlobalStore.GetCurrentTab.GetCurrentScheme);
  })
);
export default ReferenceLayoutGenerator;
