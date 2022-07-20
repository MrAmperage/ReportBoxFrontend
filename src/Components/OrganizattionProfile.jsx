import { Button, Checkbox, Input, Modal, Table } from 'antd';
import React, { useState } from 'react';

import {
  ProfileRowElement,
  ProfileWrapper,
  RowProfileWrapper,
} from '../Styles/ProfileStyles';
import {
  RowInputStyle,
  RowStyle,
  RowTablePointerStyle,
} from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';

export default function OrganizationProfile(props) {
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const ShowDeleteModal = () => {
    if (SelectedKey != null) {
      Modal.confirm({
        title: 'Подтвердите действие',
        content: 'Вы действительно хотите удалить объект?',
        okButtonProps: { size: 'small', danger: true, type: 'primary' },
        cancelButtonProps: { size: 'small' },
        okText: 'Удалить',
        cancelText: 'Отмена',
      });
    }
  };
  return (
    <>
      <ProfileWrapper GridRowsTemplate="1fr 1fr">
        <RowProfileWrapper>
          <ProfileRowElement>Наименование:</ProfileRowElement>
          <ProfileRowElement>
            <Input
              size="small"
              value={props.Profile.Caption}
              onChange={(Event) => {
                props.ProfileHandler('Caption', Event.target.value);
              }}
            />
          </ProfileRowElement>
        </RowProfileWrapper>
        <RowProfileWrapper>
          <ProfileRowElement>Внутренняя:</ProfileRowElement>
          <ProfileRowElement>
            <Checkbox
              checked={props.Profile.Internal}
              onChange={(Event) => {
                props.ProfileHandler('Internal', Event.target.checked);
              }}
            />
          </ProfileRowElement>
        </RowProfileWrapper>
      </ProfileWrapper>
      <TableButtonBar
        OnDelete={() => {
          ShowDeleteModal();
        }}
      />
      <Table
        scroll={{ y: 400 }}
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
              props.AreasHandler('Edit', Index, true);
            },
          };
        }}
        rowKey="Key"
        pagination={false}
        columns={[
          {
            title: 'Участок',
            dataIndex: 'Caption',
            key: 'Caption',
            render: (Value, Record, Index) =>
              Record.Edited ? (
                <RowStyle width="350px" justifyContent="space-between">
                  <RowInputStyle>
                    <Input
                      size="small"
                      value={Value}
                      onChange={(Event) => {
                        props.AreasHandler(
                          'Caption',
                          Index,
                          Event.target.value
                        );
                      }}
                    />
                  </RowInputStyle>
                  <RowStyle width="160px" justifyContent="space-between">
                    <Button size="small" type="primary" onClick={() => {}}>
                      Сохранить
                    </Button>
                    <Button
                      size="small"
                      onClick={(Event) => {
                        props.AreasHandler('Edit', Index, false);
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
        size="small"
        dataSource={props.Profile.Areas}
      />
    </>
  );
}
