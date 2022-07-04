import {
  RowButtonsWrapperStyle,
  RowInputStyle,
  RowStyle,
  RowTablePointerStyle,
} from '../Styles/TableStyles';
import { ApiFetch } from '../Helpers/Helpers';
import React from 'react';
import { Input, Button, message, Checkbox } from 'antd';
export const ColumnTableSetRender = (
  Column,
  ObjectTablesMap,
  SetNewObjectTablesMap,
  SchemeObject,
  CurrentMenuElementKey
) => {
  switch (Column.type) {
    case 'Checkbox':
      return (Value, Record, Index) => {
        return (
          <Checkbox
            defaultChecked={Record[Column.dataIndex]}
            ref={Record[`${Column.dataIndex}Ref`]}
          />
        );
      };

    case 'String':
      return (Value, Record, Index) => {
        return Record[`${Column.dataIndex}Edited`] ? (
          <RowStyle>
            <RowInputStyle>
              <Input
                size="small"
                defaultValue={Value}
                ref={Record[`${Column.dataIndex}Ref`]}
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
                        ObjectTablesMap,
                        SetNewObjectTablesMap,
                        SchemeObject,
                        CurrentMenuElementKey
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
                  CancelEditObject(
                    Index,
                    ObjectTablesMap,
                    SetNewObjectTablesMap,
                    SchemeObject
                  );
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
  }
};
const CancelEditObject = (
  Index,
  Feeld,
  ObjectTablesMap,
  SetNewObjectTablesMap,
  SchemeObject
) => {
  let Table = [...ObjectTablesMap.get(SchemeObject.Id)];
  if ('Id' in Table[Index]) {
    Table[Index][`${Feeld}Edited`] = false;
  } else {
    Table.splice(Index, 1);
  }

  SetNewObjectTablesMap(new Map(ObjectTablesMap.set(SchemeObject.Id, Table)));
};

const SaveObject = (
  Index,
  ObjectTablesMap,
  SetNewObjectTablesMap,
  SchemeObject,
  CurrentMenuElementKey
) => {
  let Table = [...ObjectTablesMap.get(SchemeObject.Id)];
  Object.keys(Table[Index]).forEach((Feeld) => {
    if (Feeld.includes('Ref')) {
      switch (SchemeObject.Type) {
        case 'Table':
          SchemeObject.Columns.forEach((Column) => {
            switch (Column.type) {
              case 'String':
                Table[Index][Feeld.replace(/Ref/, '')] =
                  Table[Index][Feeld].current.input.value;

                break;
              case 'Checkbox':
                Table[Index][Feeld.replace(/Ref/, '')] =
                  Table[Index][Feeld].current.input.checked;

                break;
            }
          });
          break;
      }
    }
  });

  ApiFetch(
    `api/${CurrentMenuElementKey}${
      'Id' in Table[Index] ? `/${Table[Index].Id}` : ''
    }`,
    `${'Id' in Table[Index] ? 'PATCH' : 'POST'}`,
    Table[Index],
    (Response) => {}
  );
};
