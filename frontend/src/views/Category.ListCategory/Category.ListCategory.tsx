import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
  Col,
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

  const buttonHandler = () :void => {
    history.replace('/categorias/nuevo');
  };

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
      title: 'Código',
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
        <>
          <Col span={3} push={20}>
            <Button type="primary" onClick={buttonHandler}> + Agregar</Button>
          </Col>
          <Table
            rowKey={(row) => `${row.id}`}
            data={category.map((cat) => ({
              key: cat.code.toUpperCase(),
              name: cat.name,
            }))}
            columns={columns}
          />

        </>
      )}
    </Content>
  );
};

export default ListCategory;
