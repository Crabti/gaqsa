import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
  Modal,
  notification,
  Table as AntTable,
  Tooltip,
  Row,
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
import TableFilter from 'components/TableFilter';

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
                title: 'Después',
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
        description: 'Inténtalo más tarde',
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

  const actionMap: Record<number, string> = {
    0: 'Creación',
    1: 'Modificación',
    2: 'Eliminación',
  };

  const [filtered, setFiltered] = useState<AuditLog[]>([]);

  const resetFiltered = useCallback(
    () => setFiltered(auditlog || []), [auditlog],
  );

  useEffect(() => {
    resetFiltered();
  }, [auditlog, resetFiltered]);

  const onFilterAny = (
    data: AuditLog[], value: string,
  ): AuditLog[] => data.filter((log) => (
    log.actor.toLowerCase().includes(
      value.toLocaleLowerCase(),
    )
  ));

  const renderActor = (
    log: AuditLog,
  ) : any => (
    <Row>
      {log.actor ?? 'Sistema'}
    </Row>
  );

  const renderDate = (
    log: AuditLog,
  ) : any => (
    <Row>
      {moment(log.timestamp).format('YYYY-MM-DD hh:mm') ?? 'N/A'}
    </Row>
  );

  const renderIpAddress = (
    log: AuditLog,
  ) : any => (
    <Row>
      {log.remote_addr ?? 'N/A'}
    </Row>
  );

  const renderAction = (
    log: AuditLog,
  ) : any => (
    <Row>
      {actionMap[log.action]}
    </Row>
  );

  const renderObject = (
    log: AuditLog,
  ) : any => (
    <Row>
      {log.object_repr ?? 'N/A'}
    </Row>
  );

  const columns = [
    {
      title: 'Usuario',
      dataIndex: 'actor',
      key: 'actor',
      render: (
        _: number, log: AuditLog,
      ) => renderActor(log),
    },
    {
      title: 'Tiempo',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (
        _: number, log: AuditLog,
      ) => renderDate(log),
    },
    {
      title: 'Objeto',
      dataIndex: 'object_repr',
      key: 'object_repr',
      render: (
        _: number, log: AuditLog,
      ) => renderObject(log),
    },
    {
      title: 'Dirección IP',
      dataIndex: 'remote_addr',
      key: 'remote_addr',
      render: (
        _: number, log: AuditLog,
      ) => renderIpAddress(log),
    },
    {
      title: 'Acción',
      dataIndex: 'action',
      key: 'action',
      render: (
        _: number, log: AuditLog,
      ) => renderAction(log),
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

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      {isLoading || !auditlog ? <LoadingIndicator /> : (
        <>
          <TableFilter
            fieldsToFilter={[
              { key: 'actor', value: 'Usuario' },
            ]}
            onFilter={setFiltered}
            filterAny={onFilterAny}
            data={auditlog}
          />
          <Table
            rowKey={(row) => `${row.id}`}
            data={filtered}
            columns={columns}
          />
        </>
      )}
    </Content>
  );
};

export default ListAuditLog;
