import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  notification,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  Category,
} from '@types';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';

const ListCategory: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  // eslint-disable-next-line max-len
  const [category, setCategory] = useState<Category[] | undefined>(undefined);

  const fetchCategory = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.category.getAll();

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar las categorías!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setCategory(result.data);
    setLoading(false);
  }, [backend.category]);

  useEffect(() => {
    fetchCategory();
  }, [history, fetchCategory]);

  const columns = [
    {
      title: 'Clave',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      {isLoading || !category ? <LoadingIndicator /> : (
        <Table
          rowKey={(row) => `${row.id}`}
          data={
              category.map((cat) => ({
                key: (cat.name).substr(0, 2).toUpperCase(),
                name: cat.name,
              }))
          }
          columns={columns}
        />
      )}
    </Content>
  );
};

export default ListCategory;
