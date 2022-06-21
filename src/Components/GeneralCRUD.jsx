import { Button, Input, Modal, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { nanoid } from 'nanoid';
import {
  RowButtonsWrapperStyle,
  RowInputStyle,
  RowStyle,
  RowTablePointerStyle,
} from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';

const GeneralCRUD = inject('GlobalStore')(
  observer((props) => {
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const [Objects, SetNewObjects] = useState([]);
    const InputRef = React.createRef();
    const RequestObjects = () => {
      return ApiFetch(
        `api/${props.GlobalStore.GetCurrentTab.CurrentMenuElementKey}`,
        'GET',
        undefined,
        (Response) => {
          SetNewObjects(
            Response.Data.map((Object) => {
              Object.Key = nanoid();
              Object.Editing = false;
              return Object;
            })
          );
        }
      );
    };
    const AddObject = () => {
      let NewObjects = [...Objects];
      NewObjects.push({ Caption: '', Editing: true, Key: nanoid() });
      SetNewObjects(NewObjects);
    };
    const EditingObject = (Key) => {
      let NewObjects = [...Objects];
      let ObjectIndex = NewObjects.findIndex((Object) => {
        return Object.Key == Key;
      });
      NewObjects[ObjectIndex].Editing = true;
      SetNewObjects(NewObjects);
    };
    const ShowDeleteModal = () => {
      if (SelectedKey != null) {
        Modal.confirm({
          icon: null,
          okText: 'Удалить',
          cancelText: 'Отмена',
          onOk: () => {
            DeleteObject();
          },
          cancelButtonProps: { size: 'small' },
          okButtonProps: { size: 'small', danger: true, type: 'primary' },
          title: 'Подтвердите действие',
          content: 'Вы действительно хотите удалить этот объект?',
        });
      }
    };
    const DeleteObject = () => {
      let NewObjects = [...Objects];
      let ObjectIndex = NewObjects.findIndex((Object) => {
        return Object.Key == SelectedKey;
      });
      if (!('Id' in NewObjects[ObjectIndex])) {
        NewObjects.splice(ObjectIndex, 1);
      } else {
      }
      SetNewObjects(NewObjects);
    };
    const SaveObject = (Key) => {
      let NewObjects = [...Objects];
      let ObjectIndex = NewObjects.findIndex((Object) => {
        return Object.Key == Key;
      });
      NewObjects[ObjectIndex].Caption = InputRef.current.input.value;
      NewObjects[ObjectIndex].Editing = false;
      SetNewObjects(NewObjects);
    };
    const CancelEditing = (Key) => {
      let NewObjects = [...Objects];
      let ObjectIndex = NewObjects.findIndex((Object) => {
        return Object.Key == Key;
      });
      if ('Id' in NewObjects[ObjectIndex]) {
        NewObjects[ObjectIndex].Editing = false;
      } else {
        NewObjects.splice(ObjectIndex, 1);
      }
      SetNewObjects(NewObjects);
    };
    useEffect(() => {
      RequestObjects();
    }, []);
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
          onRow={(Record) => {
            return {
              onClick: () => {
                SetNewSelectedKey(Record.Key);
              },

              onDoubleClick: () => {
                EditingObject(Record.Key);
              },
            };
          }}
          rowSelection={{
            selectedRowKeys: [SelectedKey],
            renderCell: () => null,
            hideSelectAll: true,
            columnWidth: '0px',
          }}
          rowKey="Key"
          pagination={false}
          dataSource={Objects}
          size="small"
          columns={[
            {
              title: 'Наименование',
              dataIndex: 'Caption',
              key: 'Caption',
              render: (Value, Record, Index) =>
                Record.Editing ? (
                  <RowStyle>
                    <RowInputStyle>
                      <Input size="small" defaultValue={Value} ref={InputRef} />
                    </RowInputStyle>
                    <RowButtonsWrapperStyle>
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
                        onClick={() => {
                          CancelEditing(Record.Key);
                        }}
                      >
                        Отмена
                      </Button>
                    </RowButtonsWrapperStyle>
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

export default GeneralCRUD;
