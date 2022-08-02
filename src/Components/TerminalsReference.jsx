import { Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { RowTablePointerStyle } from '../Styles/TableStyles';
import TableButtonBar from './TableButtonBar';

export default function TerminalsReference() {
  const TerminalProfile = React.lazy(() => import('./TerminalProfile'));
  const [TerminalsTable, SetNewTerminalsTable] = useState([]);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [ShowModal, SetNewShowModal] = useState(false);
  const [Profile, SetNewProfile] = useState(null);
  const RequestData = () => {
    ApiFetch('api/Terminals', 'GET', undefined, (Response) => {
      SetNewTerminalsTable(Response.Data);
    });
  };
  const RequestProfile = () => {
    return ApiFetch(
      `api/Terminals/${SelectedKey}`,
      'GET',
      undefined,
      (Response) => {
        SetNewProfile(Response.Data);
      }
    );
  };
  useEffect(() => {
    RequestData();
  }, []);
  return (
    <>
      <Modal
        visible={ShowModal}
        maskClosable={false}
        title="Профиль терминала"
        okButtonProps={{ size: 'small', type: 'primary' }}
        cancelButtonProps={{ size: 'small' }}
        okText="Сохранить"
        cancelText="Отмена"
        closable={false}
        onCancel={() => {
          SetNewShowModal(false);
        }}
      >
        <React.Suspense>
          <TerminalProfile Profile={Profile} />
        </React.Suspense>
      </Modal>
      <TableButtonBar />
      <Table
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
              SetNewSelectedKey(Record.Id);
            },
            onDoubleClick: () => {
              RequestProfile().then(() => {
                SetNewShowModal(true);
              });
            },
          };
        }}
        scroll={{ y: 700 }}
        pagination={false}
        rowKey="Id"
        size="small"
        dataSource={TerminalsTable}
        columns={[
          {
            dataIndex: 'Id',
            key: 'Id',
            title: 'ID Терминала',
            render: (Value, Record, Index) => {
              return <RowTablePointerStyle>{Value}</RowTablePointerStyle>;
            },
          },
        ]}
      />
    </>
  );
}
