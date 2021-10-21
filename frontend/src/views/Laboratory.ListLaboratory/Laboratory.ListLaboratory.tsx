import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  notification,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  Laboratory,
} from '@types';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';

const ListLaboratory: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  // eslint-disable-next-line max-len
  const [laboratory, setLaboratory] = useState<Laboratory[] | undefined>(undefined);

  const fetchLaboratory = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.laboratory.getAll();

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar los laboratorios!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setLaboratory(result.data);
    setLoading(false);
  }, [backend.laboratory]);

  useEffect(() => {
    fetchLaboratory();
  }, [history, fetchLaboratory]);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      {isLoading || !laboratory ? <LoadingIndicator /> : (
        <Table
          rowKey={(row) => `${row.id}`}
          data={
              laboratory.map((lab) => ({
                name: lab.name,

              }))
          }
          columns={columns}
        />
      )}
    </Content>
  );
};

export default ListLaboratory;
