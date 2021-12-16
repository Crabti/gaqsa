import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
  Modal,
  notification,
  Table as AntTable,
  Tooltip,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import moment from 'moment';
import {
  AuditLog,
} from '@types';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import { SearchOutlined } from '@ant-design/icons';

const ListAuditLog: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [auditlog, setAuditLog] = useState<AuditLog[] | undefined>(undefined);

  const showModal = (auditLog: AuditLog) : void => {
    const data = Object.entries(auditLog.changes).map(
      ([key, value]) => (
        {
          field: key,
          before: value[0] ?? 'N/A',
          after: value[1] ?? 'N/A',
        }
      ),
    );
    Modal.info({
      title: `Detalle - ${auditLog.object_repr} - ${auditLog.action}
       - ${auditLog.timestamp}`,
      closable: true,
      width: 800,
      okButtonProps: { style: { display: 'none' } },
      content: (
        <Content>
          <AntTable
            scroll={{ x: true }}
            rowKey={(row) => `${row.field}`}
            dataSource={data}
            pagination={false}
            columns={[
              {
                title: 'Campo',
                dataIndex: 'field',
                key: 'field',
              },
              {
                title: 'Antes',
                dataIndex: 'before',
                key: 'before',
              },
              {
                title: 'Despues',
                dataIndex: 'after',
                key: 'after',
              },
            ]}
          />
        </Content>
      ),
    });
  };

  const fetchAuditLog = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.users.get<AuditLog[]>('/audit');

    if (error || !result) {
      notification.error({
        message: '',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setAuditLog(result.data);
    setLoading(false);
  }, [backend.users]);

  useEffect(() => {
    fetchAuditLog();
  }, [history, fetchAuditLog]);

  const columns = [
    {
      title: 'Uusario',
      dataIndex: 'actor',
      key: 'actor',
    },
    {
      title: 'Tiempo',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Objeto',
      dataIndex: 'object_repr',
      key: 'object_repr',
    },
    {
      title: 'Direccion IP',
      dataIndex: 'remote_addr',
      key: 'remote_addr',
    },
    {
      title: 'Accion',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Detalle',
      dataIndex: 'detail',
      key: 'detail',
      render: (
        _: number, log: AuditLog,
      ) => (
        <Tooltip title="Ver detalles">
          <Button
            shape="circle"
            icon={<SearchOutlined />}
            onClick={() => showModal(log)}
          />
        </Tooltip>
      ),
    },
  ];

  const actionMap: Record<number, string> = {
    0: 'Creación',
    1: 'Modificación',
    2: 'Eliminación',
  };

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      {isLoading || !auditlog ? <LoadingIndicator /> : (
        <>
          <Table
            rowKey={(row) => `${row.id}`}
            data={
              auditlog.map((log) => ({
                id: log.pk,
                actor: log.actor ?? 'Sistema',
                timestamp: moment(
                  log.timestamp,
                ).format('YYYY-MM-DD hh:mm:ss') ?? 'N/A',
                object_repr: log.object_repr ?? 'N/A',
                remote_addr: log.remote_addr ?? 'N/A',
                action: actionMap[log.action],
                changes: log.changes,
              }))
            }
            columns={columns}
          />
        </>
      )}
    </Content>
  );
};

export default ListAuditLog;
